import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { componentsAPI } from '../services/api';

const ComponentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [component, setComponent] = useState({
    name: '',
    partNumber: '',
    category: '',
    quantity: 0,
    location: '',
    datasheetLink: '',
    unitPrice: 0,
    criticalThreshold: 5
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkMessage, setBulkMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchComponent();
    }
  }, [id]);

  const fetchComponent = async () => {
    try {
      setLoading(true);
      const response = await componentsAPI.getById(id);
      setComponent(response.data);
    } catch (error) {
      console.error('Error fetching component:', error);
      navigate('/inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setComponent(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await componentsAPI.update(id, component);
      } else {
        await componentsAPI.create(component);
      }
      navigate('/inventory');
    } catch (error) {
      console.error('Error saving component:', error);
      alert(error.response?.data?.message || 'Error saving component');
    } finally {
      setLoading(false);
    }
  };

  const generateQRData = () => {
    return JSON.stringify({
      partNumber: component.partNumber,
      name: component.name,
      location: component.location
    });
  };

  // Bulk import handlers
  const handleBulkFileChange = (e) => {
    setBulkFile(e.target.files[0]);
    setBulkMessage('');
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setBulkMessage('Uploading...');
    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      await componentsAPI.bulkImport(formData);
      setBulkMessage('Bulk import successful!');
      navigate('/inventory');
    } catch (err) {
      setBulkMessage('Bulk import failed: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading component...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Component' : 'Add New Component'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Component Details</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={component.name}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label">Part Number</label>
                    <input
                      type="text"
                      name="partNumber"
                      value={component.partNumber}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={component.category}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={component.location}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={component.quantity}
                      onChange={handleChange}
                      min="0"
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label">Critical Threshold</label>
                    <input
                      type="number"
                      name="criticalThreshold"
                      value={component.criticalThreshold}
                      onChange={handleChange}
                      min="0"
                      required
                      className="form-control"
                    />
                  </div>

                  <div>
                    <label className="form-label">Unit Price</label>
                    <input
                      type="number"
                      name="unitPrice"
                      value={component.unitPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="form-control"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Datasheet Link</label>
                    <input
                      type="url"
                      name="datasheetLink"
                      value={component.datasheetLink}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="https://..."
                    />
                  </div>
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
                        Saving...
                      </div>
                    ) : (
                      id ? 'Update Component' : 'Add Component'
                    )}
                  </button>
                </div>
              </form>
              <hr className="my-6" />
              <div>
                <h4 className="text-md font-semibold mb-2">Bulk Import Components</h4>
                <input
  type="file"
  accept=".csv,.xlsx,.json"
  onChange={handleBulkFileChange}
  className="form-control mb-2"
/>
<button
  type="button"
  className="btn btn-primary"
  onClick={handleBulkUpload}
  disabled={!bulkFile}
>
  Upload Sheet
</button>
{bulkMessage && (
  <div className="mt-2 text-sm text-gray-700">{bulkMessage}</div>
)}
<div className="text-xs text-gray-500 mt-1">
  Accepted: CSV, Excel, or JSON. Columns/fields must match database schema.
</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">QR Code</h3>
            </div>
            <div className="card-body">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <QRCodeSVG
                    value={generateQRData()}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Scan this QR code to locate the component</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Contains: Part Number, Name, and Location
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentForm;