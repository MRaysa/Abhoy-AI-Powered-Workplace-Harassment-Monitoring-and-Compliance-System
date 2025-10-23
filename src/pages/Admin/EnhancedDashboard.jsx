import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaEye,
  FaBan,
  FaThumbsUp,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const EnhancedAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    approvedComplaints: 0,
    rejectedComplaints: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, usersRes] = await Promise.all([
        fetch('http://localhost:3000/api/complaints'),
        fetch('http://localhost:3000/api/users'),
      ]);

      const complaintsData = await complaintsRes.json();
      const usersData = await usersRes.json();

      if (complaintsData.success) {
        const allComplaints = complaintsData.data || [];
        setComplaints(allComplaints);

        // Calculate statistics
        const pending = allComplaints.filter((c) => c.status === 'pending').length;
        const approved = allComplaints.filter((c) => c.status === 'approved').length;
        const rejected = allComplaints.filter((c) => c.status === 'rejected').length;

        setStats({
          totalUsers: usersData.data?.length || 0,
          totalComplaints: allComplaints.length,
          pendingComplaints: pending,
          approvedComplaints: approved,
          rejectedComplaints: rejected,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (complaintId) => {
    try {
      // Update status to approved
      const statusResponse = await fetch(`http://localhost:3000/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      // Approve for public forum
      const forumResponse = await fetch(`http://localhost:3000/api/complaints/${complaintId}/approve-forum`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });

      if (statusResponse.ok && forumResponse.ok) {
        fetchDashboardData();
        setSelectedComplaint(null);
        // Show success message
        alert('Complaint approved and will now appear in the public forum!');
      }
    } catch (error) {
      console.error('Error approving complaint:', error);
      alert('Failed to approve complaint. Please try again.');
    }
  };

  const handleReject = async (complaintId) => {
    try {
      // Update status to rejected
      const statusResponse = await fetch(`http://localhost:3000/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      // Make sure it's NOT approved for public forum
      const forumResponse = await fetch(`http://localhost:3000/api/complaints/${complaintId}/approve-forum`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false }),
      });

      if (statusResponse.ok && forumResponse.ok) {
        fetchDashboardData();
        setSelectedComplaint(null);
        // Show success message
        alert('Complaint rejected and will NOT appear in the public forum.');
      }
    } catch (error) {
      console.error('Error rejecting complaint:', error);
      alert('Failed to reject complaint. Please try again.');
    }
  };

  // Prepare chart data
  const getComplaintTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const dayComplaints = complaints.filter(
        (c) => c.createdAt && c.createdAt.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        complaints: dayComplaints.length,
        approved: dayComplaints.filter((c) => c.status === 'approved').length,
        pending: dayComplaints.filter((c) => c.status === 'pending').length,
      };
    });
  };

  const getCategoryData = () => {
    const categories = {};
    complaints.forEach((c) => {
      const cat = c.category || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getSeverityData = () => {
    const severities = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    complaints.forEach((c) => {
      const sev = c.severity || 'Medium';
      severities[sev] = (severities[sev] || 0) + 1;
    });

    return Object.entries(severities).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const statusData = [
    { name: 'Pending', value: stats.pendingComplaints, color: '#FFA500' },
    { name: 'Approved', value: stats.approvedComplaints, color: '#10B981' },
    { name: 'Rejected', value: stats.rejectedComplaints, color: '#EF4444' },
  ];

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 dark:text-white mb-2"
        >
          📊 Enhanced Admin Analytics
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time monitoring and complaint management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaUsers className="text-3xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-100 text-sm">
            <FaChartLine className="mr-2" />
            Active in system
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Complaints</p>
              <p className="text-3xl font-bold">{stats.totalComplaints}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaExclamationTriangle className="text-3xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-100 text-sm">
            <FaChartLine className="mr-2" />
            All submissions
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Pending Review</p>
              <p className="text-3xl font-bold">{stats.pendingComplaints}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaClock className="text-3xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-orange-100 text-sm">
            <FaClock className="mr-2" />
            Need action
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Approved</p>
              <p className="text-3xl font-bold">{stats.approvedComplaints}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaCheckCircle className="text-3xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-100 text-sm">
            <FaThumbsUp className="mr-2" />
            In public feed
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">Rejected</p>
              <p className="text-3xl font-bold">{stats.rejectedComplaints}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <FaBan className="text-3xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-red-100 text-sm">
            <FaBan className="mr-2" />
            Not approved
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Complaint Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📈 Complaint Trends (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getComplaintTrendData()}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="complaints"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorComplaints)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            🎯 Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            📊 Complaints by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getCategoryData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Severity Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            ⚠️ Severity Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getSeverityData()} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="name" type="category" stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Pending Complaints Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            🔍 Pending Complaints for Review
          </h3>
          <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-4 py-2 rounded-lg font-semibold">
            {stats.pendingComplaints} Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                  ID
                </th>
                <th className="text-left py-4 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                  Category
                </th>
                <th className="text-left py-4 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                  Severity
                </th>
                <th className="text-left py-4 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                  Date
                </th>
                <th className="text-left py-4 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                  Status
                </th>
                <th className="text-center py-4 px-4 text-gray-600 dark:text-gray-300 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints
                .filter((c) => c.status === 'pending')
                .map((complaint) => (
                  <tr
                    key={complaint._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-4 px-4 text-gray-800 dark:text-gray-200 font-mono text-sm">
                      #{complaint._id?.slice(-6)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                        {complaint.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          complaint.severity === 'Critical'
                            ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                            : complaint.severity === 'High'
                            ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300'
                            : complaint.severity === 'Medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300'
                            : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                        }`}
                      >
                        {complaint.severity || 'Medium'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                        >
                          <FaEye /> Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {complaints.filter((c) => c.status === 'pending').length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">
                    🎉 No pending complaints to review
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Review Modal */}
      {selectedComplaint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedComplaint(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  🔍 Review Complaint
                </h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Complaint ID</label>
                  <p className="text-lg font-mono text-gray-800 dark:text-gray-200">
                    #{selectedComplaint._id?.slice(-8)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Category</label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {selectedComplaint.category || 'General'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Severity</label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {selectedComplaint.severity || 'Medium'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Description</label>
                  <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {selectedComplaint.description || 'No description provided'}
                  </p>
                </div>

                {selectedComplaint.location && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Location</label>
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedComplaint.location}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Submitted</label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(selectedComplaint.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(selectedComplaint._id)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg"
                >
                  <FaCheckCircle /> Approve & Publish to Feed
                </button>
                <button
                  onClick={() => handleReject(selectedComplaint._id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg"
                >
                  <FaBan /> Reject Complaint
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedAdminDashboard;
