import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, initializeMockData } from '../../utils/mockData';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDroplet,
  FiZap,
  FiTool,
  FiFeather,
  FiHome,
  FiSun,
  FiWind,
  FiTruck,
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    initializeMockData();
    setCategories(getCategories());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory, formData);
      alert('Changes saved successfully');
    } else {
      createCategory(formData);
      alert('Category added successfully');
    }
    setCategories(getCategories());
    setFormData({ name: '', description: '' });
    setShowAddForm(false);
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category.category_id);
    setFormData({ name: category.name, description: category.description || '' });
    setShowAddForm(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
      setCategories(getCategories());
      alert('Category deleted successfully');
    }
  };

  const getCategoryIcon = (categoryName) => {
    const IconComponent = categoryIcons[categoryName] || FiHome;
    return IconComponent;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Category Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage service categories
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0BA5EC] to-[#0891D1] text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <FiPlus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold dark:text-white mb-4">
            {editingCategory ? 'Edit' : 'Add'} Category
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Category Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Description"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0891D1] transition-all font-medium"
              >
                {editingCategory ? 'Edit' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '' });
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.name);
          return (
            <div
              key={category.category_id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-[#0BA5EC]/10 to-[#0BA5EC]/5 rounded-lg">
                  <IconComponent className="h-8 w-8 text-[#0BA5EC]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold dark:text-white mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium"
                >
                  <FiEdit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.category_id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {categories.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <FiHome className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No categories found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add a new category to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default Categories;
