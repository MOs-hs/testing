import React, { useState, useEffect } from 'react';
import { getPayments, initializeMockData } from '../../utils/mockData';
import { FiCreditCard, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    initializeMockData();
    setPayments(getPayments());
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'Completed') {
      return <FiCheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <FiXCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold dark:text-white">Payments</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Request ID</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Amount</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Method</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Status</th>
                <th className="text-left py-3 px-4 font-medium dark:text-white">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.payment_id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 dark:text-white">#{payment.request_id}</td>
                  <td className="py-3 px-4 dark:text-white font-bold">${payment.amount}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiCreditCard className="h-5 w-5 text-gray-400" />
                      <span className="dark:text-white">{payment.method}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`${payment.status === 'Completed' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {payment.status === 'Completed' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {new Date(payment.create_at).toLocaleDateString()}
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

export default Payments;
