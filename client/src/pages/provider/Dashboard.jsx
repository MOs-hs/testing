import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { FiFileText, FiDollarSign, FiStar, FiHome, FiBell } from 'react-icons/fi';
import { getRequests, getProviders, getNotifications, initializeMockData } from '../../utils/mockData';

const Dashboard = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    requests: 0,
    earnings: 0,
    rating: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    const fetchDashboardData = async () => {
      try {
        if (user) {
          // Find provider ID for the current user
          const allProviders = getProviders();
          const providerInfo = allProviders.find(p => p.user_id === user.UserID || p.user_id === user.user_id); // Handle case sensitivity

          if (providerInfo) {
            // Get requests
            const allRequests = getRequests();
            const providerRequests = allRequests.filter(r => r.provider_id === providerInfo.provider_id);

            // Calculate earnings
            // Mock statuses: 1: Pending, 2: In Progress, 3: Completed
            const completedRequests = providerRequests.filter(r => r.status_id === 3);
            const totalEarnings = completedRequests.reduce((sum, r) => sum + (parseFloat(r.price) || 0), 0);

            setStats({
              requests: providerRequests.length,
              earnings: totalEarnings,
              rating: 4.8 // Mock rating since calculation is complex without reviews
            });

            setRecentRequests(providerRequests.slice(0, 5));

            // Get Notifications
            const myNotifications = getNotifications(user.UserID || user.user_id);
            setNotifications(myNotifications);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">{t('dashboard.provider.title')}</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
        >
          <FiHome className="h-5 w-5" />
          <span>{t('common.home') || 'Home'}</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
        </div>
      ) : (
        <>
          {/* Notifications Section */}
          {notifications.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-4">
                <FiBell className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold dark:text-white">Notifications</h2>
              </div>
              <div className="space-y-3">
                {notifications.map(notif => (
                  <div key={notif.notification_id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-bold text-gray-800 dark:text-white">{notif.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{notif.message}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {new Date(notif.sent_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{t('dashboard.provider.requests')}</p>
                  <p className="text-3xl font-bold dark:text-white">{stats.requests}</p>
                </div>
                <FiFileText className="h-8 w-8 text-[#0BA5EC]" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{t('dashboard.provider.earnings')}</p>
                  <p className="text-3xl font-bold dark:text-white">{formatPrice(stats.earnings)}</p>
                </div>
                <FiDollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{t('dashboard.provider.rating')}</p>
                  <p className="text-3xl font-bold dark:text-white">{stats.rating > 0 ? stats.rating.toFixed(1) : 'New'}</p>
                </div>
                <FiStar className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold dark:text-white mb-4">{t('dashboard.provider.recentRequests')}</h2>
            <div className="space-y-4">
              {recentRequests.length > 0 ? (
                recentRequests.map((request) => (
                  <div key={request.request_id} className="border-b dark:border-gray-700 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium dark:text-white">{t('request.requestNumber', { number: request.request_id })}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.details}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold dark:text-white">{formatPrice(request.price)}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(request.request_date).toLocaleDateString('ar-SA')}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${request.status_id === 1 ? 'bg-yellow-100 text-yellow-800' :
                            request.status_id === 2 ? 'bg-blue-100 text-blue-800' :
                              request.status_id === 3 ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {request.status_id === 1 ? 'Pending' : request.status_id === 2 ? 'In Progress' : request.status_id === 3 ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{t('request.noRequests')}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
