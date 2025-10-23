import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  Calendar,
  MapPin,
  FileText,
  Users,
  MessageSquare,
  Download,
  RefreshCw
} from "lucide-react";
import Swal from "sweetalert2";

const ComplaintManagement = () => {
  const { isDark } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    verified: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    resolved: "bg-gray-100 text-gray-800"
  };

  useEffect(() => {
    fetchComplaints();
  }, [page, filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let url = `https://abhoy-rho.vercel.app/api/complaints?page=${page}&limit=10`;
      
      if (filter !== "all") {
        url += `&status=${filter}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setComplaints(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load",
        text: "Could not load complaints. Please try again.",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (anonymousId, newStatus) => {
    try {
      const { value: adminNotes } = await Swal.fire({
        title: `Update Status to "${newStatus}"`,
        input: "textarea",
        inputLabel: "Admin Notes (optional)",
        inputPlaceholder: "Add notes about this decision...",
        showCancelButton: true,
        confirmButtonColor: "#6366f1"
      });

      const response = await fetch(
        `https://abhoy-rho.vercel.app/api/complaints/${anonymousId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus, adminNotes }),
        }
      );

      const result = await response.json();

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `Complaint status changed to ${newStatus}`,
          confirmButtonColor: "#6366f1"
        });
        fetchComplaints();
        if (selectedComplaint?.anonymousId === anonymousId) {
          setSelectedComplaint({ ...selectedComplaint, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const approveForForum = async (anonymousId, approved) => {
    try {
      const result = await Swal.fire({
        title: approved ? "Approve for Public Forum?" : "Remove from Forum?",
        text: approved 
          ? "This complaint will be visible to all users in the public forum"
          : "This complaint will be removed from public view",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: approved ? "#10b981" : "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: approved ? "Yes, Approve" : "Yes, Remove"
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `https://abhoy-rho.vercel.app/api/complaints/${anonymousId}/approve-forum`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ approved }),
          }
        );

        const apiResult = await response.json();

        if (apiResult.success) {
          await Swal.fire({
            icon: "success",
            title: approved ? "Approved!" : "Removed!",
            text: apiResult.message,
            confirmButtonColor: "#6366f1"
          });
          fetchComplaints();
        }
      }
    } catch (error) {
      console.error("Failed to update forum approval:", error);
    }
  };

  const viewDetails = async (anonymousId) => {
    try {
      const response = await fetch(
        `https://abhoy-rho.vercel.app/api/complaints/${anonymousId}`
      );
      const result = await response.json();

      if (result.success) {
        setSelectedComplaint(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.anonymousId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`rounded-xl shadow-lg p-6 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Complaint Management
              </h1>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Review, verify, and manage anonymous complaints
              </p>
            </div>
            <button
              onClick={fetchComplaints}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "All", status: "all", icon: Shield },
            { label: "Pending", status: "pending", icon: Clock },
            { label: "Under Review", status: "under_review", icon: Eye },
            { label: "Verified", status: "verified", icon: CheckCircle },
            { label: "Rejected", status: "rejected", icon: XCircle }
          ].map((item) => {
            const isActive = filter === item.status;
            let activeClass = '';
            if (isActive) {
              switch(item.status) {
                case 'all': activeClass = 'bg-indigo-600'; break;
                case 'pending': activeClass = 'bg-yellow-600'; break;
                case 'under_review': activeClass = 'bg-blue-600'; break;
                case 'verified': activeClass = 'bg-green-600'; break;
                case 'rejected': activeClass = 'bg-red-600'; break;
              }
            }
            
            return (
              <button
                key={item.status}
                onClick={() => setFilter(item.status)}
                className={`p-4 rounded-lg shadow transition-all ${
                  isActive
                    ? `${activeClass} text-white`
                    : isDark ? "bg-gray-800 text-gray-300 hover:shadow-md hover:bg-gray-700" : "bg-white text-gray-700 hover:shadow-md"
                }`}
              >
                <item.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{item.label}</div>
              </button>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className={`rounded-xl shadow-lg p-4 mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or Anonymous ID..."
                className={`w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>No Complaints Found</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ID
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Title
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Type
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Priority
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Status
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Forum
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Date
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className={`transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                            {complaint.anonymousId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {complaint.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {complaint.incidentType?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          complaint.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          complaint.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[complaint.status]}`}>
                          {complaint.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {complaint.approvedForForum ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Public
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Private
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => viewDetails(complaint.anonymousId)}
                          className={`hover:underline ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'}`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`px-6 py-4 border-t flex items-center justify-between ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' : 'bg-white border hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700' : 'bg-white border hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : ''}`}>
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Complaint Details
                </h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className={`text-2xl ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Anonymous ID</p>
                    <p className={`font-mono font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{selectedComplaint.anonymousId}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedComplaint.status]}`}>
                      {selectedComplaint.status}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Priority</p>
                    <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{selectedComplaint.priority}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Category</p>
                    <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{selectedComplaint.category}</p>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{selectedComplaint.title}</h3>
                <p className={`whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{selectedComplaint.description}</p>
              </div>

              {/* Evidence */}
              {(selectedComplaint.evidenceFiles?.length > 0 || selectedComplaint.evidenceUrls?.length > 0) && (
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Evidence</h3>
                  <div className="space-y-2">
                    {selectedComplaint.evidenceFiles?.map((file, index) => (
                      <div key={index} className={`flex items-center p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <FileText className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{file.name}</span>
                      </div>
                    ))}
                    {selectedComplaint.evidenceUrls?.map((item, index) => (
                      <div key={index} className={`flex items-center p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <FileText className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={`text-sm hover:underline ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          Evidence Link {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : ''}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Admin Actions</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedComplaint.status !== "verified" && (
                    <button
                      onClick={() => updateStatus(selectedComplaint.anonymousId, "verified")}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verify
                    </button>
                  )}
                  {selectedComplaint.status !== "under_review" && (
                    <button
                      onClick={() => updateStatus(selectedComplaint.anonymousId, "under_review")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  )}
                  {selectedComplaint.status !== "rejected" && (
                    <button
                      onClick={() => updateStatus(selectedComplaint.anonymousId, "rejected")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  )}
                  {!selectedComplaint.approvedForForum && (
                    <button
                      onClick={() => approveForForum(selectedComplaint.anonymousId, true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Approve for Forum
                    </button>
                  )}
                  {selectedComplaint.approvedForForum && (
                    <button
                      onClick={() => approveForForum(selectedComplaint.anonymousId, false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Remove from Forum
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
