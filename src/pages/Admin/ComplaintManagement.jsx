import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      let url = `http://localhost:3000/api/complaints?page=${page}&limit=10`;
      
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
        `http://localhost:3000/api/complaints/${anonymousId}/status`,
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
          `http://localhost:3000/api/complaints/${anonymousId}/approve-forum`,
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
        `http://localhost:3000/api/complaints/${anonymousId}`
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Complaint Management
              </h1>
              <p className="text-gray-600">
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
            { label: "All", status: "all", icon: Shield, color: "indigo" },
            { label: "Pending", status: "pending", icon: Clock, color: "yellow" },
            { label: "Under Review", status: "under_review", icon: Eye, color: "blue" },
            { label: "Verified", status: "verified", icon: CheckCircle, color: "green" },
            { label: "Rejected", status: "rejected", icon: XCircle, color: "red" }
          ].map((item) => (
            <button
              key={item.status}
              onClick={() => setFilter(item.status)}
              className={`p-4 rounded-lg shadow transition-all ${
                filter === item.status
                  ? `bg-${item.color}-600 text-white`
                  : "bg-white hover:shadow-md"
              }`}
            >
              <item.icon className="w-6 h-6 mx-auto mb-2" />
              <div className="font-semibold">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or Anonymous ID..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Complaints Found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Forum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm font-mono text-gray-900">
                            {complaint.anonymousId}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {complaint.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => viewDetails(complaint.anonymousId)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
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
            <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Complaint Details
                </h2>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Anonymous ID</p>
                    <p className="font-mono font-semibold">{selectedComplaint.anonymousId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[selectedComplaint.status]}`}>
                      {selectedComplaint.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <p className="font-semibold">{selectedComplaint.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold">{selectedComplaint.category}</p>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedComplaint.title}</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedComplaint.description}</p>
              </div>

              {/* Evidence */}
              {(selectedComplaint.evidenceFiles?.length > 0 || selectedComplaint.evidenceUrls?.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Evidence</h3>
                  <div className="space-y-2">
                    {selectedComplaint.evidenceFiles?.map((file, index) => (
                      <div key={index} className="flex items-center bg-gray-50 p-3 rounded">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    ))}
                    {selectedComplaint.evidenceUrls?.map((item, index) => (
                      <div key={index} className="flex items-center bg-gray-50 p-3 rounded">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                          Evidence Link {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
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
