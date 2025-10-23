import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Eye,
  Download,
  Link2
} from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../../contexts/ThemeContext";

const TrackComplaint = () => {
  const { isDark } = useTheme();
  const [anonymousId, setAnonymousId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      label: "Pending Review"
    },
    under_review: {
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-500",
      label: "Under Review"
    },
    verified: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-500",
      label: "Verified"
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-500",
      label: "Rejected"
    },
    resolved: {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-500",
      label: "Resolved"
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!anonymousId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing ID",
        text: "Please enter your Anonymous ID",
        confirmButtonColor: "#6366f1"
      });
      return;
    }

    setLoading(true);
    setNotFound(false);
    setComplaint(null);

    try {
      const response = await fetch(
        `http://localhost:3000/api/complaints/${anonymousId.trim()}`
      );
      const result = await response.json();

      if (result.success) {
        setComplaint(result.data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      Swal.fire({
        icon: "error",
        title: "Search Failed",
        text: "Failed to search for complaint. Please try again.",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const downloadReport = () => {
    if (!complaint) return;

    const reportText = `
ABHOY COMPLAINT REPORT
========================

Anonymous ID: ${complaint.anonymousId}
Title: ${complaint.title}
Status: ${statusConfig[complaint.status]?.label || complaint.status}
Type: ${complaint.incidentType}
Category: ${complaint.category}
Priority: ${complaint.priority}

Incident Date: ${formatDate(complaint.incidentDate)}
${complaint.location ? `Location: ${complaint.location}` : ''}

Description:
${complaint.description}

Submitted: ${formatDate(complaint.createdAt)}
Last Updated: ${formatDate(complaint.updatedAt)}

${complaint.verificationStatus === 'verified' ? '✓ This complaint has been verified' : ''}

---
This is an official অভয় report.
For inquiries, contact: support@safedesk.com
`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `complaint-${complaint.anonymousId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen py-12 px-4 transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Track Your Complaint
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Enter your Anonymous ID to check the status of your complaint
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-xl p-8 mb-8 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Anonymous ID
              </label>
              <div className="relative">
                <Shield className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={anonymousId}
                  onChange={(e) => setAnonymousId(e.target.value.toUpperCase())}
                  placeholder="ANON-2025-XXXXXXXX"
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-mono ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                  }`}
                />
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Format: ANON-YYYY-XXXXXXXX (e.g., ANON-2025-ABC12345)
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-4 rounded-lg text-white font-semibold flex items-center justify-center ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              } transition-all shadow-lg`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search Complaint
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Not Found Message */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border-l-4 border-red-500 p-6 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}
          >
            <div className="flex items-center">
              <AlertTriangle className={`w-6 h-6 mr-3 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-red-300' : 'text-red-900'}`}>Complaint Not Found</h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                  No complaint found with this Anonymous ID. Please check and try again.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Complaint Details */}
        {complaint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div className={`${statusConfig[complaint.status]?.bg || 'bg-gray-50'} border-l-4 ${statusConfig[complaint.status]?.border || 'border-gray-500'} p-6 rounded-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {React.createElement(statusConfig[complaint.status]?.icon || Clock, {
                    className: `w-8 h-8 ${statusConfig[complaint.status]?.color || 'text-gray-600'} mr-3`
                  })}
                  <div>
                    <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {statusConfig[complaint.status]?.label || complaint.status}
                    </h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Last updated: {formatDate(complaint.updatedAt)}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadReport}
                  className={`p-3 rounded-lg shadow hover:shadow-md transition-all ${
                    isDark ? 'bg-gray-700' : 'bg-white'
                  }`}
                  title="Download Report"
                >
                  <Download className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} />
                </motion.button>
              </div>
            </div>

            {/* Main Details Card */}
            <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Header */}
              <div className={`border-b pb-4 mb-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {complaint.title}
                    </h2>
                    <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="flex items-center">
                        <Shield className="w-4 h-4 mr-1" />
                        {complaint.anonymousId}
                      </span>
                      <span className={`px-3 py-1 rounded-full font-medium ${
                        complaint.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        complaint.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        complaint.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {complaint.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {complaint.verificationStatus === 'verified' && (
                    <div className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Verified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Incident Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Incident Type</h3>
                  <p className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {complaint.incidentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Category</h3>
                  <p className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{complaint.category}</p>
                </div>
                <div>
                  <h3 className={`text-sm font-semibold mb-2 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Calendar className="w-4 h-4 mr-1" />
                    Incident Date
                  </h3>
                  <p className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {formatDate(complaint.incidentDate)}
                  </p>
                </div>
                {complaint.location && (
                  <div>
                    <h3 className={`text-sm font-semibold mb-2 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <MapPin className="w-4 h-4 mr-1" />
                      Location
                    </h3>
                    <p className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{complaint.location}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className={`text-sm font-semibold mb-3 flex items-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FileText className="w-4 h-4 mr-1" />
                  Description
                </h3>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`whitespace-pre-line ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{complaint.description}</p>
                </div>
              </div>

              {/* Evidence Section */}
              {(complaint.evidenceFiles?.length > 0 || complaint.evidenceUrls?.length > 0 || complaint.witnessFormUrl) && (
                <div className="mb-6">
                  <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Evidence Submitted</h3>
                  <div className="space-y-2">
                    {complaint.evidenceFiles?.map((file, index) => (
                      <div key={index} className={`flex items-center p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <FileText className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{file.name}</span>
                      </div>
                    ))}
                    {complaint.evidenceUrls?.map((item, index) => (
                      <div key={index} className={`flex items-center p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <Link2 className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline">
                          Evidence Link {index + 1}
                        </a>
                      </div>
                    ))}
                    {complaint.witnessFormUrl && (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-200">
                        <div className="flex items-center">
                          <Link2 className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-800 font-medium">
                            Witness Verification Form ({complaint.witnessCount || 0} responses)
                          </span>
                        </div>
                        <a
                          href={complaint.witnessFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          View Form
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Complaint Submitted</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(complaint.createdAt)}</p>
                    </div>
                  </div>
                  {complaint.status !== 'pending' && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3"></div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Status Updated</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(complaint.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {complaint.resolvedAt && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Resolved</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(complaint.resolvedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Forum Status */}
              {complaint.approvedForForum && (
                <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm font-medium text-green-800">
                      This complaint has been approved and is visible in the public forum
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className={`rounded-xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Next Steps</h3>
              <ul className="space-y-3">
                {complaint.status === 'pending' && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Your complaint is being reviewed by our team</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Expected review time: 24-48 hours</span>
                    </li>
                  </>
                )}
                {complaint.status === 'verified' && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>You can now access legal support services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Connect with verified lawyers for guidance</span>
                    </li>
                  </>
                )}
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Keep your Anonymous ID safe for future reference</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;
