import React, { useState, useEffect } from 'react';
import { getRequests, getUsers, getServices, updateRequest, initializeMockData } from '../../utils/mockData';
import { FiEdit } from 'react-icons/fi';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    initializeMockData();
    setRequests(getRequests());
    setUsers(getUsers());
    setServices(getServices());
  }, []);

  const statuses = [
    { id: 1, name: 'Pending', label: 'Pending' },
    { id: 2, name: 'In Progress', label: 'In Progress' },
    { id: 3, name: 'Completed', label: 'Completed' },
    { id: 4, name: 'Cancelled', label: 'Cancelled' }
  ];

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter(r => {
      const status = statuses.find(s => s.id === r.status_id);
      return status?.name === statusFilter;
    });

  const getStatusLabel = (statusId) => {
    const status = statuses.find(s => s.id === statusId);
    return status?.label || 'Unknown';
  };

  const getStatusColor = (statusId) => {
    const colors = {
      1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      2: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      3: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      4: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[statusId] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusChange = (requestId, newStatusId) => {
    updateRequest(requestId, { status_id: newStatusId });
    setRequests(getRequests());
    alert('Request status updated');
  };

  const getCustomerName = (customerId) => {
    const user = users.find(u => u.user_id === customerId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown Customer';
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.service_id === serviceId);
    return service?.title || 'Unknown Service';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">Requests</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Statuses</option>
          {statuses.map(status => (
            <option key={status.id} value={status.name}>{status.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Request ID</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Customer</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Service</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Price</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.request_id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 dark:text-white">#{request.request_id}</td>
                  <td className="py-3 px-4 dark:text-white">{getCustomerName(request.customer_id)}</td>
                  <td className="py-3 px-4 dark:text-white">{getServiceName(request.service_id)}</td>
                  <td className="py-3 px-4 dark:text-white font-bold">${request.price}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status_id)}`}>
                      {getStatusLabel(request.status_id)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={request.status_id}
                      onChange={(e) => handleStatusChange(request.request_id, parseInt(e.target.value))}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
                    >
                      {statuses.map(status => (
                        <option key={status.id} value={status.id}>{status.label}</option>
                      ))}
                    </select>
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

export default Requests;
