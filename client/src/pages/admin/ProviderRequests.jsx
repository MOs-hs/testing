import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import adminService from '../../services/adminService';
import { FiCheck, FiX, FiFileText, FiRefreshCw } from 'react-icons/fi';

const ProviderRequests = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await adminService.getPendingProviders();
            setRequests(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch provider requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (providerId) => {
        if (!window.confirm('Are you sure you want to approve this provider?')) return;
        try {
            await adminService.approveProvider(providerId);
            setRequests(requests.filter(req => req.ProviderID !== providerId));
            alert('Provider approved successfully');
        } catch (err) {
            alert('Failed to approve provider');
            console.error(err);
        }
    };

    const handleReject = async (providerId) => {
        if (!window.confirm('Are you sure you want to reject this provider?')) return;
        try {
            await adminService.rejectProvider(providerId);
            setRequests(requests.filter(req => req.ProviderID !== providerId));
            alert('Provider rejected successfully');
        } catch (err) {
            alert('Failed to reject provider');
            console.error(err);
        }
    };

    const getCvUrl = (url) => {
        if (!url) return '#';
        if (url.startsWith('http')) return url;
        return `${process.env.REACT_APP_API_URL?.replace('/api', '')}/${url}`;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Provider Requests</h1>
                <button
                    onClick={fetchRequests}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">No pending provider requests</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((provider) => (
                        <div key={provider.ProviderID} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold dark:text-white">{provider.Name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{provider.Email}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{provider.Phone}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs font-medium rounded-full">
                                        Pending
                                    </span>
                                </div>

                                <div className="mb-6 space-y-3">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specialization</span>
                                        <p className="dark:text-gray-300">{provider.Specialization}</p>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Documents</span>
                                        {provider.CVURL ? (
                                            <a
                                                href={getCvUrl(provider.CVURL)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600 dark:text-blue-400"
                                            >
                                                <FiFileText size={20} />
                                                <span className="text-sm font-medium">View CV / Certificate</span>
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No CV uploaded</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <button
                                        onClick={() => handleReject(provider.ProviderID)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <FiX /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(provider.ProviderID)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <FiCheck /> Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProviderRequests;
