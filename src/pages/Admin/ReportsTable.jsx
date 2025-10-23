import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import Swal from "sweetalert2";
import { FaTable, FaEye, FaFilter, FaCheck, FaTimes } from "react-icons/fa";

const ReportsTable = () => {
  const { isDark } = useTheme();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://abhoy-server.vercel.app/api/complaints?limit=1000');
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (complaintId) => {
    try {
      // Update status to verified (backend's "approved" equivalent)
      const statusResponse = await fetch(`https://abhoy-server.vercel.app/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' }),
      });

      // Approve for public forum
      const forumResponse = await fetch(`https://abhoy-server.vercel.app/api/complaints/${complaintId}/approve-forum`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });

      if (statusResponse.ok && forumResponse.ok) {
        fetchReports();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Complaint approved and will now appear in the public forum!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        const statusData = await statusResponse.json();
        const forumData = await forumResponse.json();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: `Failed to approve: ${statusData.message || forumData.message}`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error approving complaint:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to approve complaint. Please try again.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleReject = async (complaintId) => {
    try {
      // Update status to rejected
      const statusResponse = await fetch(`https://abhoy-server.vercel.app/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      // Remove from public forum
      const forumResponse = await fetch(`https://abhoy-server.vercel.app/api/complaints/${complaintId}/approve-forum`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false }),
      });

      if (statusResponse.ok && forumResponse.ok) {
        fetchReports();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Complaint rejected and will NOT appear in the public forum.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error rejecting complaint:', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Failed to reject complaint. Please try again.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaTable className="text-3xl text-indigo-600 mr-3" />
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>All Reports</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Total: {reports.length} reports
            </span>
            <button 
              onClick={fetchReports}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <FaFilter className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="w-full">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  ID
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Type
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Reporter
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Priority
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No reports found
                    </p>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <motion.tr
                    key={report._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      #{report.anonymousId?.slice(-6) || report._id?.slice(-6)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                      {report.incidentType || report.category || 'General'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                      {report.isAnonymous !== false ? 'Anonymous' : report.reporter || 'Anonymous'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.severity === 'critical' || report.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : report.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {report.severity || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'verified' || report.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : report.status === 'under_review'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {report.status === 'verified' ? 'approved' : report.status === 'under_review' ? 'reviewing' : report.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="text-indigo-600 hover:text-indigo-900 p-2"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        {(report.status === 'pending' || report.status === 'under_review') && (
                          <>
                            <button 
                              onClick={() => handleApprove(report.anonymousId)}
                              className="text-green-600 hover:text-green-900 p-2"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              onClick={() => handleReject(report.anonymousId)}
                              className="text-red-600 hover:text-red-900 p-2"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Report Details
                </h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className={`text-2xl ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Report ID</label>
                  <p className={`text-lg font-mono ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    #{selectedReport.anonymousId?.slice(-8)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Type</label>
                    <p className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {selectedReport.incidentType || 'General'}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Severity</label>
                    <p className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {selectedReport.severity || 'Medium'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Title</label>
                  <p className={`text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {selectedReport.title || 'No title'}
                  </p>
                </div>

                <div>
                  <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Description</label>
                  <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                    {selectedReport.description || 'No description'}
                  </p>
                </div>

                <div>
                  <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date</label>
                  <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {new Date(selectedReport.createdAt).toLocaleString()}
                  </p>
                </div>

                {(selectedReport.status === 'pending' || selectedReport.status === 'under_review') && (
                  <div className={`flex gap-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => {
                        handleApprove(selectedReport.anonymousId);
                        setSelectedReport(null);
                      }}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <FaCheck />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedReport.anonymousId);
                        setSelectedReport(null);
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
