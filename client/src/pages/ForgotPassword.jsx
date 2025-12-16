import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import { FiMail } from 'react-icons/fi';
import api from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <KhadamatiLogo className="h-12 w-12" />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Reset your password
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
                        {!submitted ? (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="focus:ring-[#0BA5EC] focus:border-[#0BA5EC] block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md py-3 dark:bg-gray-700 dark:text-white"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0BA5EC] hover:bg-[#0BA5EC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0BA5EC] disabled:opacity-50"
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                                    <FiMail className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Check your email</h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    We sent a password reset link to {email}
                                </p>
                                <div className="mt-6">
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium text-[#0BA5EC] hover:text-[#0BA5EC]/80"
                                    >
                                        Back to login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPassword;
