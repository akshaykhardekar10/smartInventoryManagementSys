import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    // Basic email validation (you can use a more robust regex)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password strength validation (example: min 8 chars, 1 uppercase, 1 number)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await signup(formData.name, formData.email, formData.password);
      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setError(result ? result.message : 'Signup failed'); // Use server message if available
      }
    } catch (error) {
      setError('An error occurred during signup');
      console.error("Signup error:", error); // Log the error for debugging
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
            Create a new account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="form-control"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
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
              autoComplete="new-password"
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
                  Signing up...
                </div>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

