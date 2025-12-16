import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { FiFileText, FiClock, FiCheckCircle, FiHome } from 'react-icons/fi';
import api from '../../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/requests/my');
        setRequests(response.data.requests || []);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  const getStatusInfo = (statusId) => {
    const statuses = {
      1: { label: 'Pending', icon: FiClock, color: 'text-yellow-600' },
      2: { label: 'Accepted', icon: FiCheckCircle, color: 'text-blue-500' },
      3: { label: 'In Progress', icon: FiClock, color: 'text-blue-600' },
      4: { label: 'Completed', icon: FiCheckCircle, color: 'text-green-600' },
      5: { label: 'Cancelled', icon: FiFileText, color: 'text-red-600' }
    };
    return statuses[statusId] || statuses[1];
  };

  // Calculate stats from real data
  const totalRequests = requests.length;
  const inProgressCount = requests.filter(r => r.StatusID === 3).length;
  const completedCount = requests.filter(r => r.StatusID === 4).length;
  const recentRequests = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.customer.title') || 'Customer Dashboard'}</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
        >
          <FiHome className="h-5 w-5" />
          <span>{t('common.home') || 'Home'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Requests</p>
              <p className="text-3xl font-bold dark:text-white">{loading ? '...' : totalRequests}</p>
            </div>
            <FiFileText className="h-8 w-8 text-[#0BA5EC]" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">In Progress</p>
              <p className="text-3xl font-bold dark:text-white">{loading ? '...' : inProgressCount}</p>
            </div>
            <FiClock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold dark:text-white">{loading ? '...' : completedCount}</p>
            </div>
            <FiCheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold dark:text-white">Recent Requests</h2>
          <Link
            to="/customer/requests"
            className="text-[#0BA5EC] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0BA5EC]"></div>
            </div>
          ) : recentRequests.length > 0 ? (
            recentRequests.map((request) => {
              const status = getStatusInfo(request.StatusID);
              const StatusIcon = status.icon;
              return (
                <div key={request.RequestID} className="border-b dark:border-gray-700 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium dark:text-white">Request #{request.RequestID}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{request.ServiceTitle}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{request.Details}</p>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        <span className={`${status.color} font-medium`}>{request.StatusName || status.label}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatPrice(request.Price)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No requests found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
