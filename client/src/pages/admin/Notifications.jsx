import React, { useState, useEffect } from 'react';
import { getNotifications, getUsers, createNotification, initializeMockData } from '../../utils/mockData';
import { FiSend, FiBell } from 'react-icons/fi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: 'all',
    title: '',
    message: ''
  });

  useEffect(() => {
    initializeMockData();
    setNotifications(getNotifications());
    setUsers(getUsers());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.user_id === 'all') {
      // Send to all users
      users.forEach(user => {
        createNotification({
          user_id: user.user_id,
          type: 'Admin',
          title: formData.title,
          message: formData.message
        });
      });
      alert('Notification sent to all users');
    } else {
      createNotification({
        user_id: parseInt(formData.user_id),
        type: 'Admin',
        title: formData.title,
        message: formData.message
      });
      alert('Notification sent successfully');
    }
    setNotifications(getNotifications());
    setFormData({ user_id: 'all', title: '', message: '' });
    setShowForm(false);
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">Notifications</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90"
        >
          <FiSend className="h-5 w-5" />
          Send Notification
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold dark:text-white mb-4">Send New Notification</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipient
              </label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90"
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ user_id: 'all', title: '', message: '' });
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.notification_id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start gap-4">
              <FiBell className="h-6 w-6 text-[#0BA5EC] mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold dark:text-white mb-1">{notification.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{notification.message}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    To: {getUserName(notification.user_id)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.sent_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
