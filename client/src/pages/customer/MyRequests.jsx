import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiClock, FiCheckCircle, FiXCircle, FiStar, FiX } from 'react-icons/fi';
import api from '../../services/api';

const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get('/requests/my');
        setRequests(response.data.requests || []);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load your requests');
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
      1: { label: 'Pending', icon: FiClock, color: 'bg-yellow-100 text-yellow-800' },
      2: { label: 'Accepted', icon: FiClock, color: 'bg-blue-50 text-blue-700' },
      3: { label: 'Completed', icon: FiCheckCircle, color: 'bg-green-100 text-green-800' },
      4: { label: 'Rejected', icon: FiXCircle, color: 'bg-red-100 text-red-800' },
      5: { label: 'Cancelled', icon: FiXCircle, color: 'bg-gray-100 text-gray-800' }
    };
    return statuses[statusId] || statuses[1];
  };

  const handleReviewClick = (request) => {
    setSelectedRequest(request);
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log out and log in again.');
      return;
    }

    console.log('Submitting review for request:', selectedRequest.RequestID);

    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        requestId: selectedRequest.RequestID,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      // Refresh requests to update UI
      const response = await api.get('/requests/my');
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Review submission error:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please Log Out and Log In again.');
      } else if (error.response?.status === 404) {
        alert('The Request ID was not found in the database.');
      } else {
        alert(error.response?.data?.error || 'Failed to submit review');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">My Requests</h1>

      <div className="space-y-4">
        {requests.map((request) => {
          // Use StatusID 3 for Completed based on backend/fix-status.js
          const status = getStatusInfo(request.StatusID);
          const StatusIcon = status.icon;
          return (
            <div key={request.RequestID} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold dark:text-white mb-2">Request #{request.RequestID}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Service: {request.ServiceTitle}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">{request.Details}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${status.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  {request.StatusName || status.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                  <p className="text-xl font-bold dark:text-white">${request.Price}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Request Date</p>
                  <p className="text-sm dark:text-white">
                    {new Date(request.RequestDate).toLocaleDateString()}
                  </p>
                  {request.ScheduledDate && (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1">Scheduled Date</p>
                      <p className="text-sm dark:text-white">
                        {new Date(request.ScheduledDate).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Show review button only for completed requests (StatusID = 4) */}
              {request.StatusID === 4 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                  <button
                    onClick={() => handleReviewClick(request)}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium shadow-sm"
                  >
                    <FiStar /> Write a Review
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            >
              <FiX size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-4 dark:text-white">Write a Review</h3>
            <form onSubmit={submitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <FiStar className="fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-[#0BA5EC] text-white py-2 rounded-lg font-medium hover:bg-[#0BA5EC]/90 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">No requests found</p>
          <a
            href="/services"
            className="inline-block px-6 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90"
          >
            Request New Service
          </a>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
