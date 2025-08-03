import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">SmartLIMS</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/inventory"
                  className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}
                >
                  Inventory
                </Link>
                <Link
                  to="/movement"
                  className={`nav-link ${isActive('/movement') ? 'active' : ''}`}
                >
                  Log Movement
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/components/add"
                    className={`nav-link ${isActive('/components/add') ? 'active' : ''}`}
                  >
                    Add Component
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Welcome, {user?.name}</span>
              <span className="text-gray-500 ml-1">({user?.role})</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-danger text-xs"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 