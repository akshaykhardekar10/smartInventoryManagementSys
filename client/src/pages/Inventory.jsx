import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { componentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Inventory = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    partNumber: '',
    location: '',
    quantity: '',
    search: ''
  });
  const { user } = useAuth();

  // Debounce ref
  const debounceRef = useRef();

  // Debounced fetch with 2.5s delay
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchComponents();
    }, 2500); // 2.5 seconds debounce
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await componentsAPI.getAll(filters);
      setComponents(response.data);
    } catch (error) {
      console.error('Error fetching components:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await componentsAPI.delete(id);
        fetchComponents();
      } catch (error) {
        console.error('Error deleting component:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
          {user?.role === 'admin' && (
            <Link
              to="/components/add"
              className="btn btn-primary"
            >
              Add Component
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="form-label">Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Search components..."
                />
              </div>
              <div>
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Filter by category..."
                />
              </div>
              <div>
                <label className="form-label">Part Number</label>
                <input
                  type="text"
                  name="partNumber"
                  value={filters.partNumber}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Filter by part number..."
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Filter by location..."
                />
              </div>
              <div>
                <label className="form-label">Max Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={filters.quantity}
                  onChange={handleFilterChange}
                  className="form-control"
                  placeholder="Max quantity..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Components Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Part Number</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Unit Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {components.map((component) => (
                  <tr key={component._id}>
                    <td>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{component.name}</div>
                        {component.datasheetLink && (
                          <a
                            href={component.datasheetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Datasheet
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="text-sm text-gray-900">{component.partNumber}</td>
                    <td className="text-sm text-gray-500">{component.category}</td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        component.quantity <= component.criticalThreshold
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {component.quantity}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">{component.location}</td>
                    <td className="text-sm text-gray-500">
                      ${component.unitPrice?.toFixed(2) || '0.00'}
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        component.quantity <= component.criticalThreshold
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {component.quantity <= component.criticalThreshold ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <Link
                          to={`/components/${component._id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          View
                        </Link>
                        {user?.role === 'admin' && (
                          <>
                            <Link
                              to={`/components/${component._id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900 text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(component._id)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {components.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No components found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;