import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useCurrency } from '../context/CurrencyContext';
import api from '../services/api';
import { FiStar, FiMapPin, FiCheckCircle, FiAward } from 'react-icons/fi';

const ProviderDetails = () => {
    const { id } = useParams();
    const { formatPrice } = useCurrency();
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await api.get(`/providers/${id}`);
                setProvider(response.data.provider);

                // Fetch provider's services
                const servicesResponse = await api.get(`/services?providerId=${id}`);
                setServices(servicesResponse.data.services || []);
            } catch (error) {
                console.error('Error fetching provider:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProvider();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0BA5EC]"></div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold dark:text-white mb-4">Provider Not Found</h1>
                    <Link to="/services" className="text-[#0BA5EC] hover:underline">
                        Back to Services
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const rating = provider.Rating ? parseFloat(provider.Rating) : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Provider Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg flex items-center justify-center">
                                <span className="text-4xl font-bold text-gray-400">
                                    {provider.Name?.charAt(0) || 'P'}
                                </span>
                            </div>
                            {provider.Status === 'Approved' && (
                                <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg" title="Verified Provider">
                                    <FiCheckCircle className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold dark:text-white mb-2">
                                {provider.Name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 dark:text-gray-400 mb-4">
                                <div className="flex items-center gap-1">
                                    <FiAward className="h-5 w-5" />
                                    <span>{provider.Specialization || 'Service Provider'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiMapPin className="h-5 w-5" />
                                    <span>Baalbek-Hermel</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FiStar className="h-5 w-5 text-yellow-400 fill-current" />
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {rating > 0 ? rating.toFixed(1) : 'New'}
                                    </span>
                                    <span>({provider.TotalReviews || 0} reviews)</span>
                                </div>
                            </div>
                            <p className="max-w-2xl text-gray-600 dark:text-gray-400">
                                Professional {(provider.Specialization || 'service').toLowerCase()} provider with experience.
                                Committed to delivering high-quality work and ensuring customer satisfaction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Provider Services */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold dark:text-white mb-8">Services by {provider.Name}</h2>

                {services.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {services.map(service => (
                            <Link
                                key={service.ServiceID}
                                to={`/services/${service.ServiceID}`}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                            >
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                    <img
                                        src={service.images?.[0]?.ImageURL || '/placeholder.jpg'}
                                        alt={service.Title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold dark:text-white mb-2 group-hover:text-[#0BA5EC] transition-colors">
                                        {service.Title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                        {service.Description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-[#0BA5EC]">
                                            {formatPrice(service.Price || 0)}
                                        </span>
                                        <span className="text-sm text-gray-500">View Details</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <p className="text-gray-600 dark:text-gray-400">No services listed yet.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProviderDetails;
