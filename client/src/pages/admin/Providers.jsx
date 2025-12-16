import React, { useState, useEffect } from 'react';
import { getProviders, getUsers, initializeMockData } from '../../utils/mockData';
import { FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeMockData();
    setProviders(getProviders());
    setUsers(getUsers());
  }, []);

  const handleApprove = (providerId) => {
    const updatedProviders = providers.map(p =>
      p.provider_id === providerId ? { ...p, approved: true } : p
    );
    setProviders(updatedProviders);
    localStorage.setItem('khadamati_providers', JSON.stringify(updatedProviders));
    alert('Provider approved successfully');
  };

  const handleRemove = (providerId) => {
    if (window.confirm('Are you sure you want to remove this provider?')) {
      const updatedProviders = providers.filter(p => p.provider_id !== providerId);
      setProviders(updatedProviders);
      localStorage.setItem('khadamati_providers', JSON.stringify(updatedProviders));
      alert('Provider removed successfully');
    }
  };

  const getProviderUser = (provider) => {
    return users.find(u => u.user_id === provider.user_id);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Provider Management</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => {
          const user = getProviderUser(provider);
          return (
            <div key={provider.provider_id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/placeholder-user.jpg"
                  alt={user?.first_name}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="font-bold dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Specialization</p>
                <p className="font-medium dark:text-white">{provider.specialization}</p>
              </div>
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${provider.approved
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                  {provider.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="flex gap-2">
                {!provider.approved && (
                  <button
                    onClick={() => handleApprove(provider.provider_id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <FiCheckCircle className="h-5 w-5" />
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleRemove(provider.provider_id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FiXCircle className="h-5 w-5" />
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Providers;
