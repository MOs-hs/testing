import React, { useState, useEffect } from 'react';
import { getReviews, getRequests, getUsers, initializeMockData } from '../../utils/mockData';
import { FiStar } from 'react-icons/fi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeMockData();
    setReviews(getReviews());
    setUsers(getUsers());
  }, []);

  const getCustomerName = (requestId) => {
    const requests = getRequests();
    const request = requests.find(r => r.request_id === requestId);
    if (request) {
      const user = users.find(u => u.user_id === request.customer_id);
      return user ? `${user.first_name} ${user.last_name}` : 'Unknown Customer';
    }
    return 'Unknown Customer';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Reviews</h1>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.review_id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold dark:text-white mb-1">
                  {getCustomerName(review.request_id)}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(review.create_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">No reviews found</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
