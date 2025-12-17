import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiCheckCircle } from 'react-icons/fi';

const ProviderCard = ({ provider, user }) => {
  const name = provider.Name || (user ? `${user.first_name} ${user.last_name}` : 'Provider');
  const specialization = provider.Specialization || provider.specialization;
  const rating = provider.Rating ? parseFloat(provider.Rating) : 4.5;
  const providerId = provider.ProviderID || provider.provider_id;
  const isVerified = provider.Status === 'Approved' || provider.approved;
  const totalReviews = provider.TotalReviews || 0;
  const profileImage = provider.ProfileImage;
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center">
        {profileImage ? (
          <img
            src={`${baseUrl}/${profileImage}`}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-6xl font-bold text-gray-400">{name.charAt(0)}</span>
        )}
        {isVerified && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
            <FiCheckCircle className="h-3 w-3" />
            <span>Verified</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold dark:text-white">
          {name}
        </h3>
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <FiMapPin className="h-4 w-4" />
          <span>{specialization || 'General'}</span>
        </div>
        <div className="mb-4 flex items-center gap-1">
          <FiStar className="h-4 w-4 text-yellow-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
          <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
        </div>
        <Link
          to={`/providers/${providerId}`}
          className="block w-full text-center px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition-colors text-sm font-medium"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default ProviderCard;

