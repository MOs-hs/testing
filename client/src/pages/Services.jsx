import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useCurrency } from '../context/CurrencyContext';
import { FiStar, FiMapPin, FiUser } from 'react-icons/fi';
import api from '../services/api';

const Services = () => {
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
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

        // Fetch from real API
        const response = await api.get('/services');
        let filteredServices = response.data.services || [];

        // Filter by category if selected
        if (categoryParam) {
          filteredServices = filteredServices.filter(
            s => s.CategoryID === parseInt(categoryParam)
          );
        }

        // Filter by search query
        if (searchParam) {
          const query = searchParam.toLowerCase();
          filteredServices = filteredServices.filter(s =>
            s.Title?.toLowerCase().includes(query) ||
            s.Description?.toLowerCase().includes(query)
          );
        }

        setServices(filteredServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center dark:text-white mb-8">
          {searchQuery ? 'Search Results' : 'All Services'}
        </h1>

        {/* Category Filter */}
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
                key={category.CategoryID}
                onClick={() => handleCategoryFilter(category.CategoryID)}
                className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.CategoryID
                  ? 'bg-[#0BA5EC] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {category.Name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-4">
            {services.map((service) => {
              const rating = parseFloat(service.Rating) || 0;

              return (
                <Link
                  key={service.ServiceID}
                  to={`/services/${service.ServiceID}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Service Image */}
                    <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold dark:text-white mb-2">
                            {service.Title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                            {service.Description}
                          </p>
                        </div>
                        <div className="text-left md:text-right mb-4 md:mb-0">
                          <div className="text-3xl font-bold text-[#0BA5EC] mb-2">
                            {formatPrice(service.Price || 0)}
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
                            <span>{service.ProviderName}</span>
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
              No services found
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Services;
