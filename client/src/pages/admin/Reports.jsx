import React, { useState, useEffect } from 'react';
import { getReports, getUsers, deleteReport, initializeMockData } from '../../utils/mockData';
import { FiTrash2, FiCheckCircle } from 'react-icons/fi';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeMockData();
    setReports(getReports());
    setUsers(getUsers());
  }, []);

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const handleResolve = (reportId) => {
    const updatedReports = reports.map(r =>
      r.report_id === reportId ? { ...r, admin_id: 1, resolved: true } : r
    );
    setReports(updatedReports);
    localStorage.setItem('khadamati_reports', JSON.stringify(updatedReports));
    alert('Report resolved successfully');
  };

  const handleDelete = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteReport(reportId);
      setReports(getReports());
      alert('Report deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Reports</h1>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.report_id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold dark:text-white mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  From: {getUserName(report.user_id)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Type: {report.report_type} - Target: {report.target_type} #{report.target_id}
                </p>
              </div>
              {report.resolved && (
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm">
                  Resolved
                </span>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{report.content}</p>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {new Date(report.create_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                {!report.resolved && (
                  <button
                    onClick={() => handleResolve(report.report_id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <FiCheckCircle className="h-5 w-5" />
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(report.report_id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FiTrash2 className="h-5 w-5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
