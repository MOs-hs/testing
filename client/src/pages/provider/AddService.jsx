import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiX, FiImage, FiAlertCircle } from 'react-icons/fi';
import api from '../../services/api';

const AddService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  // Images state kept for UI but upload functionality is limited/disabled in backend for now
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white';

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Limit to 1 image for now if backend doesn't support array easily or just handle UI
    // For now we just preview them but don't send to backend as it doesn't support base64 uploads yet
    const totalImages = images.length + files.length;

    if (totalImages > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) invalidFiles.push(`${file.name}: File too large`);
      else if (!file.type.startsWith('image/')) invalidFiles.push(`${file.name}: Invalid file type`);
      else validFiles.push(file);
    });

    if (invalidFiles.length > 0) alert(invalidFiles.join('\n'));

    const newPreviews = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        categoryId: parseInt(formData.category_id),
        status: 'active'
      };

      await api.post('/services', payload);

      // Note: Images are not uploaded yet as backend requires multipart/form-data support
      // which we haven't implemented fully in this step.

      alert('Service added successfully');
      navigate('/provider/services');
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err.response?.data?.error || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold dark:text-white mb-6">
        Add New Service
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              required
              className={inputClass}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Category
            </label>

            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              className={inputClass}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.CategoryID} value={cat.CategoryID}>
                  {cat.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Price ($)
            </label>

            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              className={inputClass}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Description
            </label>

            <textarea
              rows="6"
              required
              className={inputClass}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Image Upload Message */}
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Note: Image upload is currently disabled while we upgrade the system. You can add images later.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Add Service'}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate('/provider/services')}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddService;
