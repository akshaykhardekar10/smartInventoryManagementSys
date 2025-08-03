import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { componentsAPI, stockLogsAPI } from '../services/api';

const LogMovement = () => {
  const navigate = useNavigate();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    componentId: '',
    quantity: 1,
    reason: '',
    type: 'inward',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await componentsAPI.getAll();
      setComponents(response.data);
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await stockLogsAPI.create(formData);
      alert('Stock movement logged successfully!');
      navigate('/inventory');
    } catch (error) {
      console.error('Error logging movement:', error);
      alert(error.response?.data?.message || 'Error logging movement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Log Stock Movement</h1>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Movement Details</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">Component</label>
                <select
                  name="componentId"
                  value={formData.componentId}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Select a component</option>
                  {components.map((component) => (
                    <option key={component._id} value={component._id}>
                      {component.name} - {component.partNumber} (Stock: {component.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Movement Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="inward">Inward</option>
                  <option value="outward">Outward</option>
                </select>
              </div>

              <div>
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="form-control"
                  placeholder="Enter the reason for this movement..."
                />
              </div>

              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/inventory')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Logging...
                    </div>
                  ) : (
                    'Log Movement'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogMovement; 