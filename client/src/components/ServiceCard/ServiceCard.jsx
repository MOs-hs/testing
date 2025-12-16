import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';

const ServiceCard = ({ service }) => {
  const { formatPrice } = useCurrency();
  const title = service.Title || service.title;
  const description = service.Description || service.description;
  const serviceId = service.ServiceID || service.service_id;
  const categoryName = service.CategoryName || service.category?.name;
  const providerName = service.ProviderName || (service.providerUser ? `${service.providerUser.first_name} ${service.providerUser.last_name}` : 'Provider');
  const rating = service.Rating ? parseFloat(service.Rating) : 4.5;
  const price = service.Price || service.price || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
        <img
          src={service.images && service.images.length > 0 ? service.images[0].ImageURL : "/placeholder.jpg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {categoryName && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#0BA5EC] shadow-sm">
            {categoryName}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold dark:text-white group-hover:text-[#0BA5EC] transition-colors">{title}</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
          {description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                {providerName.charAt(0)}
              </div>
              <span className="font-medium">{providerName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiMapPin className="h-4 w-4" />
            <span>Baalbek-Hermel</span>
          </div>

          <div className="font-bold text-[#0BA5EC]">
            {formatPrice(price)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <FiStar className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {rating > 0 ? rating.toFixed(1) : 'New'}
              {service.TotalReviews > 0 && (
                <span className="text-gray-500 font-normal ml-1">({service.TotalReviews})</span>
              )}
            </span>
          </div>
          <Link
            to={`/services/${serviceId}`}
            className="px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

