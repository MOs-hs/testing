import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCertificates, initializeMockData } from '../../utils/mockData';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    initializeMockData();
    const allCerts = getCertificates();
    setCertificates(allCerts.filter(c => c.provider_id === (user?.user_id || 1)));
  }, [user]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCert = {
          certificate_id: Date.now(),
          provider_id: user?.user_id || 1,
          image: reader.result,
          issue_date: new Date().toISOString()
        };
        const allCerts = getCertificates();
        allCerts.push(newCert);
        localStorage.setItem('khadamati_certificates', JSON.stringify(allCerts));
        setCertificates([...certificates, newCert]);
        alert('Certificate uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (certId) => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      const updated = certificates.filter(c => c.certificate_id !== certId);
      setCertificates(updated);
      localStorage.setItem('khadamati_certificates', JSON.stringify(updated));
      alert('Certificate deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">Certificates</h1>
        <label className="flex items-center gap-2 px-4 py-2 bg-[#0BA5EC] text-white rounded-lg hover:bg-[#0BA5EC]/90 cursor-pointer">
          <FiPlus className="h-5 w-5" />
          Upload Certificate
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <div key={cert.certificate_id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="h-64 bg-gray-200 dark:bg-gray-700">
              <img
                src={cert.image}
                alt="Certificate"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Issue Date: {new Date(cert.issue_date).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(cert.certificate_id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <FiTrash2 className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">No certificates found</p>
        </div>
      )}
    </div>
  );
};

export default Certificates;
