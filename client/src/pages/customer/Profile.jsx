import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
    checkPendingRequest();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const userData = response.data.user || response.data;
      setFormData({
        name: userData.Name || '',
        email: userData.Email || '',
        phone: userData.Phone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPendingRequest = async () => {
    try {
      const response = await api.get('/profile-change-requests/my-requests');
      const requests = response.data.requests || [];
      const pending = requests.find(r => r.Status === 'pending');
      setPendingRequest(pending || null);
    } catch (error) {
      console.error('Error checking pending requests:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/profile-change-requests', formData);
      setMessage({
        type: 'success',
        text: 'Change request submitted! Awaiting admin approval.'
      });
      checkPendingRequest();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to submit change request'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!pendingRequest) return;

    try {
      await api.delete(`/profile-change-requests/${pendingRequest.RequestID}`);
      setPendingRequest(null);
      setMessage({ type: 'success', text: 'Change request cancelled' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to cancel request'
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      await api.put('/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to change password'
      });
    }
  };

  const inputClass =
    'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white';

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Profile</h1>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Pending Request Notice */}
      {pendingRequest && (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-400">
                You have a pending profile change request
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
                Submitted: {new Date(pendingRequest.RequestedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleCancelRequest}
              className="text-sm text-yellow-800 dark:text-yellow-400 underline hover:no-underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold dark:text-white mb-4">Personal Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || pendingRequest}
            className="w-full px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : pendingRequest ? 'Request Pending' : 'Request Changes'}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Profile changes require admin approval
          </p>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold dark:text-white mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 font-medium"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
