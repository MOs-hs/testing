import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FiAlertCircle } from 'react-icons/fi';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, serviceRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/services/${id}`)
        ]);

        setCategories(catRes.data.categories || []);

        const service = serviceRes.data.service;
        if (service) {
          setFormData({
            title: service.Title,
            description: service.Description,
            category_id: service.CategoryID,
            price: service.Price
          });
        }
      } catch (err) {
        console.error('Error fetching service data:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/services/${id}`, {
        title: formData.title,
        description: formData.description,
        categoryId: parseInt(formData.category_id),
        price: parseFloat(formData.price) || 0,
        status: 'active'
      });

      alert('Service updated successfully');
      navigate('/provider/services');
    } catch (err) {
      console.error('Error updating service:', err);
      setError(err.response?.data?.error || 'Failed to update service');
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white";

  if (loading && !formData.title) { // Initial loading
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Edit Service</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.CategoryID} value={category.CategoryID}>
                  {category.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="6"
              className={inputClass}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 font-medium disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/provider/services')}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditService;
