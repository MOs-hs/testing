import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, initializeMockData } from '../../utils/mockData';
import { FiBell } from 'react-icons/fi';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    initializeMockData();
    const allNotifications = getNotifications();
    setNotifications(allNotifications.filter(n => n.user_id === user?.user_id));
  }, [user]);

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n =>
      n.notification_id === notificationId ? { ...n, is_read: true } : n
    );
    setNotifications(updatedNotifications);

    // Update data in localStorage to persist read status
    const allNotifications = getNotifications();
    localStorage.setItem(
      'khadamati_notifications',
      JSON.stringify(allNotifications.map(n =>
        n.notification_id === notificationId ? { ...n, is_read: true } : n
      ))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Notifications</h1>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div
              key={notification.notification_id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${!notification.is_read ? 'border-r-4 border-[#0BA5EC]' : ''
                }`}
            >
              <div className="flex items-start gap-4">
                <FiBell
                  className={`h-6 w-6 mt-1 ${notification.is_read ? 'text-gray-400' : 'text-[#0BA5EC]'
                    }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold dark:text-white">{notification.title}</h3>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.notification_id)}
                        className="text-sm text-[#0BA5EC] hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.sent_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">No notifications found</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
