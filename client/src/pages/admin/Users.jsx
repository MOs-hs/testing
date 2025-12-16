import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser, initializeMockData } from '../../utils/mockData';
import { FiSearch, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    initializeMockData();
    setUsers(getUsers());
  }, []);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (user) => {
    setEditingUser(user.user_id);
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'customer'
    });
  };

  const handleSave = (userId) => {
    updateUser(userId, editForm);
    setUsers(getUsers());
    setEditingUser(null);
    alert('User updated successfully');
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      setUsers(getUsers());
      alert('User deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">User Management</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#0BA5EC] dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium dark:text-white">Name</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Email</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Phone</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Role</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    {editingUser === user.user_id ? (
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <FiUser className="h-5 w-5 text-gray-400" />
                        <span className="dark:text-white">{user.first_name} {user.last_name}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser === user.user_id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-white"
                      />
                    ) : (
                      <span className="dark:text-white">{user.email}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser === user.user_id ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-white"
                      />
                    ) : (
                      <span className="dark:text-white">{user.phone || '-'}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser === user.user_id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-600 dark:text-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="provider">Provider</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                        {user.role === 'admin' ? 'Admin' : user.role === 'provider' ? 'Provider' : 'Customer'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {editingUser === user.user_id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(user.user_id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.user_id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
