import React, { useState, useEffect } from 'react';
import { FiTrash2, FiSearch, FiMessageSquare } from 'react-icons/fi';
import api from '../../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data.services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.Title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        // Refresh the list
        fetchServices();
        alert('Service deleted successfully');
      } catch (err) {
        console.error('Error deleting service:', err);
        alert(err.response?.data?.error || 'Failed to delete service');
      }
    }
  };

  const handleRemark = async (service) => {
    const message = window.prompt(`Send remark to provider about "${service.Title}":`);
    if (message) {
      try {
        await api.post('/notifications', {
          userId: service.ProviderUserID,
          type: 'admin_remark',
          title: `Admin Remark: ${service.Title}`,
          message: message
        });
        alert('Remark sent successfully!');
      } catch (err) {
        console.error('Error sending remark:', err);
        alert('Failed to send remark');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Service Management</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium dark:text-white">Title</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Category</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Provider</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Price</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No services found
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.ServiceID} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 dark:text-white">{service.Title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                        {service.CategoryName || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 dark:text-white">{service.ProviderName || '-'}</td>
                    <td className="py-3 px-4 dark:text-white">${parseFloat(service.Price || 0).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemark(service)}
                          title="Send Remark"
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          <FiMessageSquare className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.ServiceID)}
                          title="Delete Service"
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Services;
