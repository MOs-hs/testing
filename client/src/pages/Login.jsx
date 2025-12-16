import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Login - backend will return the actual role from database
      const result = await login(email, password);

      if (result.success && result.user) {
        // Get role from user object (handle both Role and role from backend)
        const userRole = result.user.Role || result.user.role;

        console.log('Login successful, user role:', userRole, 'User object:', result.user);

        // Navigate based on actual role from database
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'provider') {
          navigate('/provider/dashboard');
        } else if (userRole === 'customer') {
          navigate('/customer/dashboard');
        } else {
          console.warn('Unknown role:', userRole);
          navigate('/');
        }
      } else {
        setError(result.error || t('auth.loginError') || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || t('auth.loginError') || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-all duration-300 hover:shadow-glow">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0BA5EC]/10 to-transparent rounded-full blur-3xl -z-0 animate-pulse-slow"></div>

            {/* Logo Section */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-block relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                  <KhadamatiLogo className="h-16 w-16" />
                </div>
              </div>
              <h2 className="mt-6 text-3xl md:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
                {t('auth.loginTitle')}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-400">
                {t('auth.welcomeBack')}
              </p>
            </div>

            {/* Role Selection Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-8 relative z-10 animate-fade-in-up animation-delay-500">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${selectedRole === 'customer'
                  ? 'border-[#0BA5EC] bg-[#0BA5EC]/5 text-[#0BA5EC] shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-[#0BA5EC]/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <div className={`p-2 rounded-full mb-2 ${selectedRole === 'customer' ? 'bg-[#0BA5EC] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-bold text-xs">{t('auth.customer')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('provider')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${selectedRole === 'provider'
                  ? 'border-purple-500 bg-purple-500/5 text-purple-600 shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <div className={`p-2 rounded-full mb-2 ${selectedRole === 'provider' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-bold text-xs">{t('auth.provider')}</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg animate-fade-in-up">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 animate-fade-in-up animation-delay-600">

              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-[#0BA5EC]">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-[#0BA5EC] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-[#0BA5EC]/20 focus:border-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all duration-300 placeholder:text-gray-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors group-focus-within:text-[#0BA5EC]">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-[#0BA5EC] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-[#0BA5EC]/20 focus:border-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all duration-300 placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#0BA5EC] hover:text-[#0BA5EC]/80"
                  >
                    {t('auth.forgotPassword', 'Forgot Password?')}
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full relative py-4 px-6 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group btn-ripple"
              >
                <span className="relative z-10">{t('common.login')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0891D1] to-[#0BA5EC] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Create Account Link */}
            <div className="mt-8 text-center relative z-10 animate-fade-in-up animation-delay-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.noAccount')}{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#0BA5EC] hover:text-[#0891D1] transition-colors underline decoration-2 underline-offset-2"
                >
                  {t('auth.createAccount')}
                </Link>
              </p>
            </div>

            {/* Demo Account Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 relative z-10 animate-fade-in-up animation-delay-1000">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                <span className="font-bold text-gray-900 dark:text-white block mb-1">{t('auth.demoAccount')}</span>
                {t('auth.demoCredentials')}
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-1000">
            © 2024 Khadamati. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
