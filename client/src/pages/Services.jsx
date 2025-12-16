import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useCurrency } from '../context/CurrencyContext';
import { FiStar, FiMapPin, FiUser } from 'react-icons/fi';
import { getServices, getCategories, getProviders, getUsers } from '../utils/mockData';

const Services = () => {
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from mock data
    const allCategories = getCategories();
    setCategories(allCategories);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        if (categoryParam) {
          setSelectedCategory(parseInt(categoryParam));
        } else {
          setSelectedCategory(null);
        }

        if (searchParam) {
          setSearchQuery(searchParam);
        } else {
          setSearchQuery('');
        }

        // Mock filtering
        let filteredServices = getServices();
        const providers = getProviders();
        const users = getUsers();

        // Join provider name
        filteredServices = filteredServices.map(service => {
          const provider = providers.find(p => p.provider_id === service.provider_id);
          let providerName = 'Unknown Provider';
          if (provider) {
            const user = users.find(u => u.user_id === provider.user_id);
            if (user) providerName = `${user.first_name} ${user.last_name}`;
          }
          return { ...service, ProviderName: providerName };
        });

        if (categoryParam) {
          filteredServices = filteredServices.filter(s => s.category_id === parseInt(categoryParam));
        }

        if (searchParam) {
          filteredServices = filteredServices.filter(s =>
            s.title.toLowerCase().includes(searchParam.toLowerCase()) ||
            s.description.toLowerCase().includes(searchParam.toLowerCase())
          );
        }

        setServices(filteredServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [searchParams]);

  const handleCategoryFilter = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === categoryId) {
      newParams.delete('category');
    } else {
      if (categoryId === null) {
        newParams.delete('category');
      } else {
        newParams.set('category', categoryId);
      }
    }
    setSearchParams(newParams);
  };

  const getServiceImage = (service) => {
    return '/placeholder.jpg';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center dark:text-white mb-8">
          {searchQuery ? 'Search Results' : 'All Services'}
        </h1>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === null
                ? 'bg-[#0BA5EC] text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.category_id}
                onClick={() => handleCategoryFilter(category.category_id)}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.category_id
                  ? 'bg-[#0BA5EC] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => {
              const rating = service.rating || 0;
              const serviceImage = getServiceImage(service);

              return (
                <Link
                  key={service.service_id}
                  to={`/services/${service.service_id}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Service Image */}
                    <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                      <img
                        src={serviceImage}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold dark:text-white mb-2">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-left md:text-right mb-4 md:mb-0">
                          <div className="text-3xl font-bold text-[#0BA5EC] mb-2">
                            {formatPrice(service.price || 0)}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <FiStar className="h-5 w-5 fill-current" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {rating > 0 ? rating.toFixed(1) : 'New'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Provider and Location Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {service.ProviderName && (
                          <div className="flex items-center gap-2">
                            <FiUser className="h-4 w-4" />
                            <span>
                              {service.ProviderName}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <FiMapPin className="h-4 w-4" />
                          <span>Baalbek-Hermel</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No results found
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Services;
