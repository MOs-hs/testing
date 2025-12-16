import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiCheckCircle, FiXCircle, FiClock, FiActivity } from 'react-icons/fi';
import api from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

const ServiceRequests = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [requests, setRequests] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [finalPrices, setFinalPrices] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, meRes] = await Promise.all([
          api.get('/requests/statuses'),
          api.get('/auth/me')
        ]);

        // Create status map
        const statusMap = {};
        if (statusRes.data.statuses) {
          statusRes.data.statuses.forEach(s => {
            statusMap[s.StatusID] = s;
          });
        }
        setStatuses(statusMap);

        const providerId = meRes.data.roleData?.ProviderID;
        if (providerId) {
          const reqRes = await api.get(`/requests/provider/${providerId}`);
          setRequests(reqRes.data.requests || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);


  const handleStatusChange = async (requestId, newStatusId) => {
    try {
      const payload = { statusId: newStatusId };

      // If completing, include final price if set
      if (newStatusId === 4 && finalPrices[requestId]) {
        payload.finalPrice = parseFloat(finalPrices[requestId]);
      }

      await api.put(`/requests/${requestId}/status`, payload);

      // Update local state
      setRequests(prev => prev.map(r => {
        if (r.RequestID === requestId) {
          return {
            ...r,
            StatusID: newStatusId,
            StatusName: statuses[newStatusId]?.StatusName || 'Updated', // Optimistic update
            FinalPrice: payload.finalPrice || r.FinalPrice
          };
        }
        return r;
      }));

      alert('Request status updated');
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusLabel = (statusId) => {
    // Default hardcoded map if API fails or for styling
    const styles = {
      1: { icon: FiClock, color: 'bg-yellow-100 text-yellow-800' }, // Pending
      2: { icon: FiActivity, color: 'bg-blue-50 text-blue-700' }, // Accepted
      3: { icon: FiActivity, color: 'bg-blue-100 text-blue-800' }, // In Progress
      4: { icon: FiCheckCircle, color: 'bg-green-100 text-green-800' }, // Completed
      5: { icon: FiXCircle, color: 'bg-red-100 text-red-800' } // Cancelled
    };

    const style = styles[statusId] || styles[1];
    const label = statuses[statusId]?.StatusName || 'Unknown';

    return { ...style, label };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Service Requests</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0BA5EC]"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const status = getStatusLabel(request.StatusID);
            const StatusIcon = status.icon;
            return (
              <div key={request.RequestID} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white mb-2">Request #{request.RequestID}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Customer: {request.CustomerName || 'Unknown'}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{request.Details || request.ServiceTitle}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Scheduled: {new Date(request.ScheduledDate || request.RequestDate).toLocaleDateString()}
                    </p>
                    {request.AddressLine && (
                      <p className="text-sm text-gray-500">
                        Location: {request.AddressLine}, {request.City}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${status.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                    <p className="text-xl font-bold dark:text-white">
                      {request.FinalPrice ? (
                        <>
                          <span className="line-through text-gray-400 text-sm mr-2">{formatPrice(request.Price)}</span>
                          {formatPrice(request.FinalPrice)}
                        </>
                      ) : (
                        formatPrice(request.Price)
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {request.StatusID === 1 && (
                      <>
                        <button
                          onClick={() => handleStatusChange(request.RequestID, 2)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(request.RequestID, 5)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.StatusID === 2 && (
                      <div className="flex gap-2">
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">$</span>
                          <input
                            type="number"
                            placeholder="Final Cost"
                            className="pl-6 w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                            value={finalPrices[request.RequestID] || ''}
                            onChange={(e) => setFinalPrices({ ...finalPrices, [request.RequestID]: e.target.value })}
                          />
                        </div>
                        <button
                          onClick={() => handleStatusChange(request.RequestID, 4)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">No requests found</p>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
