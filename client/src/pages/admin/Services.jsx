import React, { useState, useEffect } from 'react';
import { getServices, getCategories, getProviders, getUsers, deleteService, initializeMockData, createNotification } from '../../utils/mockData';
import { FiTrash2, FiSearch, FiMessageSquare } from 'react-icons/fi';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initializeMockData();
    setServices(getServices());
    setCategories(getCategories());
    setProviders(getProviders());
    setUsers(getUsers());
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.category_id === categoryId);
    return category?.name || '-';
  };

  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.provider_id === providerId);
    if (provider) {
      const user = users.find(u => u.user_id === provider.user_id);
      return user ? `${user.first_name} ${user.last_name}` : '-';
    }
    return '-';
  };

  const handleDelete = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(serviceId);
      setServices(getServices());
      alert('Service deleted successfully');
    }
  };

  const handleRemark = (service) => {
    const message = window.prompt(`Send remark to provider about "${service.title}":`);
    if (message) {
      const provider = providers.find(p => p.provider_id === service.provider_id);
      if (provider) {
        createNotification({
          user_id: provider.user_id,
          type: 'Admin Remark',
          title: `Admin Remark: ${service.title}`,
          message: message,
          is_read: false
        });
        alert('Remark sent successfully!');
      } else {
        alert('Provider not found for this service.');
      }
    }
  };

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
                <th className="text-left py-3 px-4 font-medium dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.service_id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 dark:text-white">{service.title}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                      {getCategoryName(service.category_id)}
                    </span>
                  </td>
                  <td className="py-3 px-4 dark:text-white">{getProviderName(service.provider_id)}</td>
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
                        onClick={() => handleDelete(service.service_id)}
                        title="Delete Service"
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Services;
