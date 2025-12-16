import React, { useEffect, useState } from 'react';
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  getUsers,
  getRequests,
  getPayments,
  getServices,
  initializeMockData
} from '../../utils/mockData';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequests: 0,
    totalRevenue: 0,
    activeServices: 0,
    monthlyGrowth: {
      users: 0,
      requests: 0,
      revenue: 0
    }
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    initializeMockData();
    calculateStats();

    const interval = setInterval(() => {
      calculateStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateStats = () => {
    const users = getUsers();
    const requests = getRequests();
    const payments = getPayments();
    const services = getServices();

    const totalUsers = users.length;
    const totalRequests = requests.length;
    const totalRevenue = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const activeServices = services.length;

    const monthlyData = processMonthlyData(users, requests);
    setChartData(monthlyData);

    const currentMonthData = monthlyData[monthlyData.length - 1] || { users: 0, requests: 0 };
    const previousMonthData = monthlyData[monthlyData.length - 2] || { users: 0, requests: 0 };

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous * 100).toFixed(1);
    };

    setStats({
      totalUsers,
      totalRequests,
      totalRevenue,
      activeServices,
      monthlyGrowth: {
        users: calculateGrowth(currentMonthData.users, previousMonthData.users),
        requests: calculateGrowth(currentMonthData.requests, previousMonthData.requests),
        revenue: 0
      }
    });
  };

  const processMonthlyData = (users, requests) => {
    const months = {};
    const monthNames = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    const getMonthKey = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${date.getMonth()}`;
    };

    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      months[key] = {
        name: monthNames[d.getMonth()],
        users: 0,
        requests: 0
      };
    }

    users.forEach(user => {
      const key = getMonthKey(user.create_at || new Date().toISOString());
      if (months[key]) months[key].users++;
    });

    requests.forEach(request => {
      const key = getMonthKey(request.request_date);
      if (months[key]) months[key].requests++;
    });

    return Object.values(months);
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${parseFloat(trend) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            {parseFloat(trend) >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="bg-blue-500"
          trend={stats.monthlyGrowth.users}
        />
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          icon={FiShoppingBag}
          color="bg-purple-500"
          trend={stats.monthlyGrowth.requests}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={FiDollarSign}
          color="bg-green-500"
          trend={stats.monthlyGrowth.revenue}
        />
        <StatCard
          title="Active Services"
          value={stats.activeServices}
          icon={FiActivity}
          color="bg-orange-500"
        />
      </div>

      {/* Monthly Statistics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Monthly Statistics
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#0BA5EC]"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Users</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Requests</span>
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0BA5EC" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0BA5EC" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0BA5EC"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {/* Mock recent activity items */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FiUsers />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">New User Registered</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <FiShoppingBag />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">New Service Request</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <FiDollarSign />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Received</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
