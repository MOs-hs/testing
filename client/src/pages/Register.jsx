import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import { FiUpload, FiX } from 'react-icons/fi';


const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'customer',
    specialization: '',
    experience: '',
    cv: null
  });
  const [cvPreview, setCvPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Reset provider-specific fields if switching to customer
    if (name === 'role' && value === 'customer') {
      setFormData(prev => ({
        ...prev,
        role: 'customer',
        specialization: '',
        experience: '',
        cv: null
      }));
      setCvPreview(null);
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('errors.fileTooLarge'));
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError(t('errors.invalidFileType'));
      return;
    }

    setFormData({
      ...formData,
      cv: file
    });

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCvPreview(null);
    }
    setError('');
  };

  const removeCv = () => {
    setFormData({
      ...formData,
      cv: null
    });
    setCvPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    // Validate provider-specific fields
    if (formData.role === 'provider') {
      if (!formData.specialization) {
        setError(t('errors.required'));
        return;
      }
      if (!formData.cv) {
        setError('CV is required');
        return;
      }
    }

    // Use FormData for file upload
    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('name', `${formData.first_name} ${formData.last_name}`);
    data.append('phone', formData.phone);
    data.append('role', formData.role);

    if (formData.role === 'provider') {
      data.append('specialization', formData.specialization);
      data.append('experience', formData.experience);
      if (formData.cv) {
        data.append('cv', formData.cv);
      }
    }

    const result = await register(data);

    if (result.success) {
      setSuccess(t('auth.registerSuccess') || 'Registration successful! Redirecting...');
      const userRole = result.user.Role || result.user.role;
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'provider') {
          navigate('/provider/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }, 2000);
    } else {
      setError(result.error || t('auth.registerError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <KhadamatiLogo className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold dark:text-white">{t('auth.registerTitle')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t('auth.joinUs')}</p>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-400 rounded-lg">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.firstName')}
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.lastName')}
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.phone')}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.accountType')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'role', value: 'customer' } })}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${formData.role === 'customer'
                      ? 'bg-[#0BA5EC] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {t('auth.customer')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'role', value: 'provider' } })}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${formData.role === 'provider'
                      ? 'bg-[#0BA5EC] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {t('auth.provider')}
                  </button>
                </div>
              </div>

              {/* Provider-specific fields */}
              {formData.role === 'provider' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('provider.specialization')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={t('provider.specialization')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('provider.experienceOptional')}
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder={t('provider.experienceOptional')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CV (PDF/Image) <span className="text-red-500">*</span>
                    </label>
                    {!cvPreview && !formData.cv && (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Upload CV</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, DOC, DOCX, JPG, PNG
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,image/*"
                          onChange={handleCvChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    {cvPreview && (
                      <div className="relative">
                        <img
                          src={cvPreview}
                          alt="CV preview"
                          className="w-full h-48 object-contain border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeCv}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {formData.cv && !cvPreview && (
                      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {formData.cv.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeCv}
                          className="p-1 text-red-500 hover:text-red-600"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.confirmPassword')}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0BA5EC] text-white py-3 rounded-lg font-medium hover:bg-[#0BA5EC]/90 transition-colors"
              >
                {t('auth.createAccount')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-[#0BA5EC] hover:underline">
                  {t('common.login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;

