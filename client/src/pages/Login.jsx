import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result && result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result ? result.message : 'Login failed'); // Use server message if available
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error("Login error:", error); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            SmartLIMS
          </h2>
          <p className="text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          <div className="mt-4 text-center">
  <span className="text-gray-600">Don't have an account?</span>
  <a href="/signup" className="text-blue-600 hover:underline ml-2">Sign up</a>
</div>
        </form>
      </div>
    </div>
  );
};

export default Login; 