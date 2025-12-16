import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { FiStar, FiMapPin, FiUser, FiCalendar, FiX } from 'react-icons/fi';
import api from '../services/api';
import { format } from 'date-fns';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCustomer } = useAuth();
  const { formatPrice } = useCurrency();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    details: '',
    scheduled_date: '',
    address_line: '',
    city: ''
  });
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [eligibleRequest, setEligibleRequest] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const [serviceRes, reviewsRes] = await Promise.all([
          api.get(`/services/${id}`),
          api.get(`/reviews/service/${id}`)
        ]);

        setService(serviceRes.data.service);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.error("Error fetching service details", err);
        setError("Failed to load service details");
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!user || !isCustomer || reviewsLoading) return;

      try {
        const response = await api.get('/requests/my');
        const myRequests = response.data.requests || [];

        // Find a completed request (StatusID 4) for this service that hasn't been reviewed
        const eligible = myRequests.find(req =>
          req.ServiceID === parseInt(id) &&
          req.StatusID === 4 &&
          !reviews.some(r => r.RequestID === req.RequestID)
        );

        setEligibleRequest(eligible);
      } catch (err) {
        console.error("Error checking review eligibility", err);
      }
    };

    checkReviewEligibility();
  }, [user, isCustomer, id, reviews, reviewsLoading]);

  const handleReviewSubmitStart = () => {
    if (!eligibleRequest) return;
    setReviewForm({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!eligibleRequest) return;

    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        requestId: eligibleRequest.RequestID,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      alert('Review submitted successfully!');
      setShowReviewModal(false);

      // Refresh reviews and eligibility
      const reviewsRes = await api.get(`/reviews/service/${id}`);
      setReviews(reviewsRes.data.reviews || []);
      setEligibleRequest(null); // No longer eligible as reviewed
    } catch (error) {
      console.error('Review submission error:', error);
      alert(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!isCustomer) {
      alert('You must be logged in as a customer to request a service');
      navigate('/login');
      return;
    }

    try {
      await api.post('/requests', {
        serviceId: service.ServiceID,
        scheduledDate: requestData.scheduled_date,
        details: requestData.details,
        addressLine: requestData.address_line,
        city: requestData.city
      });

      alert('Request sent successfully!');
      navigate('/customer/requests');
    } catch (err) {
      console.error('Error submitting request:', err);
      alert(err.response?.data?.error || 'Failed to submit request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-red-600 dark:text-red-400">{error || 'Service not found'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
            {service.images && service.images.length > 0 ? (
              <img
                src={service.images[0].ImageURL}
                alt={service.Title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-300 dark:bg-gray-600">
                <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
              <span className="font-bold text-[#0BA5EC]">{formatPrice(service.Price)}</span>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold dark:text-white mb-4">{service.Title}</h1>
            {service.CategoryName && (
              <span className="inline-block px-3 py-1 bg-[#0BA5EC] text-white rounded-full text-sm mb-4">
                {service.CategoryName}
              </span>
            )}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {service.Description}
            </p>

            {/* Provider Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold dark:text-white mb-4">Service Provider</h3>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
                  {service.ProviderName?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">
                    {service.ProviderName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">{service.Specialization}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm dark:text-gray-300">
                      {service.Rating ? parseFloat(service.Rating).toFixed(1) : 'New'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                if (!isCustomer) {
                  alert('Only customers can request services');
                  return;
                }
                setShowRequestForm(!showRequestForm);
              }}
              className="w-full bg-[#0BA5EC] text-white py-3 rounded-lg font-medium hover:bg-[#0BA5EC]/90 transition-colors mb-4"
            >
              Request Service
            </button>

            {showRequestForm && (
              <form onSubmit={handleRequestSubmit} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Request Details
                  </label>
                  <textarea
                    value={requestData.details}
                    onChange={(e) => setRequestData({ ...requestData, details: e.target.value })}
                    required
                    rows="4"
                    placeholder="Describe what you need..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={requestData.scheduled_date}
                    onChange={(e) => setRequestData({ ...requestData, scheduled_date: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={requestData.city}
                      onChange={(e) => setRequestData({ ...requestData, city: e.target.value })}
                      required
                      placeholder="e.g. Beirut"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line
                    </label>
                    <input
                      type="text"
                      value={requestData.address_line}
                      onChange={(e) => setRequestData({ ...requestData, address_line: e.target.value })}
                      required
                      placeholder="Street, building, floor..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    Price: <span className="font-bold text-[#0BA5EC]">{formatPrice(service.Price)}</span>
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-[#0BA5EC] text-white py-3 rounded-lg font-medium hover:bg-[#0BA5EC]/90 transition-colors"
                  >
                    Confirm Request
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Reviews Section */}
          <div className="p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold dark:text-white">Reviews</h3>
              {eligibleRequest && (
                <button
                  onClick={handleReviewSubmitStart}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC] hover:bg-[#0BA5EC]/90 text-white rounded-lg transition-colors font-medium"
                >
                  <FiStar /> Write a Review
                </button>
              )}
            </div>
            {reviewsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0BA5EC]"></div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet for this service.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.ReviewID} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold dark:text-white">{review.CustomerName || 'Customer'}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${i < review.Rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(review.CreatedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.Comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

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
                  required
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
    </div>
  );
};

export default ServiceDetails;

