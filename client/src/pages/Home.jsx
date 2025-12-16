import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import SearchBar from '../components/SearchBar/SearchBar';
import ServiceCard from '../components/ServiceCard/ServiceCard';
import ProviderCard from '../components/ProviderCard/ProviderCard';
import SEO from '../components/SEO';
import { getCategories, getServices, getProviders, initializeMockData } from '../utils/mockData';
import homeServiceImage from '../assets/home-service.png';
import {
  FiDroplet,
  FiZap,
  FiTool,
  FiFeather,
  FiHome,
  FiSun,
  FiWind,
  FiTruck,
  FiCheckCircle,
  FiStar,
  FiAward,
  FiShield
} from 'react-icons/fi';

// Category icon mapping
const categoryIcons = {
  'Plumbing': FiDroplet,
  'Electricity': FiZap,
  'Carpentry': FiTool,
  'Painting': FiFeather,
  'Cleaning': FiHome,
  'Gardening': FiSun,
  'Air Conditioning': FiWind,
  'Moving': FiTruck,
  'Pest Control': FiShield,
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data if not exists
    initializeMockData();

    // Simulate API delay
    const fetchData = async () => {
      try {
        // Fetch data from mock storage
        const allCategories = getCategories();
        const allServices = getServices();
        const allProviders = getProviders();

        setCategories(allCategories);
        setServices(allServices.slice(0, 3)); // Top 3
        setProviders(allProviders.slice(0, 3)); // Top 3
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName] || FiHome;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <SEO
        title="Khadamati - Home Services Platform | Find Local Service Providers"
        description="Find trusted home service providers. Professional plumbing, electrical, cleaning, carpentry and more services at your fingertips."
        keywords="home services, khadamati, plumbing, electrical, cleaning, carpentry, service providers, home repair, maintenance"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${homeServiceImage})`,
          }}
        >
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-[#0BA5EC]/20 to-gray-900/85 dark:from-black/90 dark:via-[#0BA5EC]/10 dark:to-black/90"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0BA5EC] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center z-10">

          {/* Hero Title */}
          <h1 className="mb-6 text-5xl font-black text-white leading-tight md:text-6xl lg:text-7xl animate-fade-in-up">
            Find the Best Home Services
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-300 dark:text-gray-400 leading-relaxed md:text-xl animate-fade-in-up animation-delay-2000">
            Connect with trusted professionals for all your home maintenance needs. Fast, reliable, and secure.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-3xl animate-fade-in-up animation-delay-4000">
            <SearchBar />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-4000">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-sm text-gray-400">Services Completed</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">4.9</div>
              <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section className="py-20 relative">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Top Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Select a category to find services
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {categories.slice(0, 8).map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                return (
                  <Link
                    key={category.category_id}
                    to={`/services?category=${category.category_id}`}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-[#0BA5EC]/20 hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0BA5EC]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 transform scale-110"></div>
                      <div className="relative h-20 w-20 mx-auto bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-6">
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                    </div>

                    <h3 className="relative text-base lg:text-lg font-bold dark:text-white group-hover:text-[#0BA5EC] dark:group-hover:text-[#0BA5EC] transition-colors duration-300">
                      {category.name}
                    </h3>

                    <div className="relative mt-4 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FiCheckCircle className="h-3 w-3" />
                      <span>Featured</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              View All Categories
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Featured Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Check out our most popular services
            </p>
          </div>

          {!loading && services.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.service_id}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              {loading ? 'Loading...' : 'No services found.'}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-block px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#0BA5EC] dark:hover:border-[#0BA5EC] hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Top Providers
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Meet our top-rated service providers
            </p>
          </div>

          {!loading && providers.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.provider_id}
                  provider={provider}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              {loading ? 'Loading...' : 'No providers found.'}
            </div>
          )}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Get your service done in 3 simple steps
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative h-full w-full bg-gradient-to-br from-[#0BA5EC] to-[#0891D1] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  1
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold dark:text-white">Search</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Find the service you need from our wide range of categories.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group text-center">
              <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative h-full w-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  2
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold dark:text-white">Book</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Choose a provider and schedule a time that works for you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group text-center">
              <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative h-full w-full bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  3
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold dark:text-white">Relax</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Sit back while our professional handles the job.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-16 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FiAward className="h-6 w-6" />
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
