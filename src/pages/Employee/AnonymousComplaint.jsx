import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertCircle,
  Upload,
  Calendar,
  MapPin,
  FileText,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Info,
  Camera,
  Link2,
  Send
} from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../../contexts/ThemeContext";

const AnonymousComplaintForm = () => {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [anonymousId, setAnonymousId] = useState(null);
  const [showId, setShowId] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    incidentType: "",
    category: "",
    priority: "medium",
    isAnonymous: true,
    
    // Step 2: Incident Details
    incidentDate: "",
    location: "",
    description: "",
    
    // Step 3: People Involved
    accusedPerson: "",
    accusedDepartment: "",
    witnessNames: "",
    
    // Step 4: Evidence
    evidenceFiles: [],
    evidenceUrls: [],
    witnessFormUrl: "",
    
    // Optional Contact
    contactMethod: "",
    encryptedContact: ""
  });

  const incidentTypes = [
    { value: "sexual_harassment", label: "Sexual Harassment", icon: "⚠️" },
    { value: "verbal_abuse", label: "Verbal Abuse", icon: "💬" },
    { value: "physical_violence", label: "Physical Violence", icon: "✊" },
    { value: "discrimination", label: "Discrimination", icon: "⚖️" },
    { value: "bullying", label: "Bullying/Intimidation", icon: "🎯" },
    { value: "stalking", label: "Stalking", icon: "👁️" },
    { value: "retaliation", label: "Retaliation", icon: "🔄" },
    { value: "hostile_environment", label: "Hostile Work Environment", icon: "🏢" },
    { value: "other", label: "Other", icon: "📋" }
  ];

  const categories = [
    "Workplace",
    "University/College",
    "Public Space",
    "Online/Virtual",
    "Other"
  ];

  const priorities = [
    { value: "low", label: "Low", color: "bg-blue-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "critical", label: "Critical", color: "bg-red-500" }
  ];

  const totalSteps = 5;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date()
    }));
    
    setFormData(prev => ({
      ...prev,
      evidenceFiles: [...prev.evidenceFiles, ...fileData]
    }));
  };

  const addEvidenceUrl = () => {
    const url = prompt("Enter evidence URL (Google Drive, Dropbox, etc.):");
    if (url) {
      setFormData(prev => ({
        ...prev,
        evidenceUrls: [...prev.evidenceUrls, { url, addedAt: new Date() }]
      }));
    }
  };

  const removeEvidence = (index, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.incidentType || !formData.category) {
          Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please fill in all required fields",
            confirmButtonColor: "#6366f1"
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.incidentDate || !formData.description) {
          Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please provide incident date and description",
            confirmButtonColor: "#6366f1"
          });
          return false;
        }
        return true;
      case 4:
        if (formData.evidenceFiles.length === 0 && 
            formData.evidenceUrls.length === 0 && 
            !formData.witnessFormUrl) {
          Swal.fire({
            icon: "warning",
            title: "Evidence Required",
            text: "Please provide evidence (files/URLs) OR a witness verification form",
            html: `
              <p class="mb-2">To prevent false accusations, you must provide:</p>
              <ul class="text-left mx-auto max-w-md">
                <li>• Supporting evidence (photos, videos, audio), OR</li>
                <li>• Witness verification form with at least 5 responses</li>
              </ul>
            `,
            confirmButtonColor: "#6366f1"
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://abhoy-rho.vercel.app/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setAnonymousId(result.data.anonymousId);
        setCurrentStep(5);
        
        await Swal.fire({
          icon: "success",
          title: "Complaint Submitted!",
          html: `
            <div class="text-center">
              <p class="mb-4">Your anonymous complaint has been submitted successfully.</p>
              <div class="bg-indigo-50 p-4 rounded-lg mb-4">
                <p class="font-semibold text-indigo-900 mb-2">Your Anonymous ID:</p>
                <p class="text-2xl font-bold text-indigo-600 tracking-wider">${result.data.anonymousId}</p>
              </div>
              <p class="text-sm text-red-600 font-semibold">⚠️ IMPORTANT: Save this ID to track your complaint!</p>
            </div>
          `,
          confirmButtonColor: "#6366f1",
          confirmButtonText: "I've Saved My ID"
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Failed to submit complaint. Please try again.",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: "Anonymous ID copied to clipboard",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const downloadIdAsImage = () => {
    // Create canvas and generate image with ID
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#4f46e5';
    ctx.fillRect(0, 0, 800, 400);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('অভয় Anonymous Complaint ID', 50, 100);
    ctx.font = 'bold 48px monospace';
    ctx.fillText(anonymousId, 50, 200);
    ctx.font = '18px Arial';
    ctx.fillText('Keep this ID safe to track your complaint', 50, 280);
    ctx.fillText(`Submitted: ${new Date().toLocaleDateString()}`, 50, 320);
    
    // Download
    const link = document.createElement('a');
    link.download = `complaint-id-${anonymousId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Step Content Components
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className={`border-l-4 border-indigo-500 p-4 rounded ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
              <div className="flex items-start">
                <Shield className={`w-6 h-6 mr-3 flex-shrink-0 mt-0.5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-indigo-300' : 'text-indigo-900'}`}>Your Identity is Protected</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                    This complaint will be submitted anonymously. You'll receive a unique ID to track your case.
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Complaint Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief title for your complaint"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
                required
              />
            </div>

            {/* Incident Type */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Type of Incident *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {incidentTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, incidentType: type.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.incidentType === type.value
                        ? `border-indigo-500 shadow-md ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-50'}`
                        : `${isDark ? 'border-gray-600 hover:border-indigo-400 bg-gray-700/50' : 'border-gray-200 hover:border-indigo-300'}`
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className={`font-medium text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{type.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Where did this occur? *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Severity Level *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {priorities.map((priority) => (
                  <motion.button
                    key={priority.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.priority === priority.value
                        ? `${priority.color} text-white border-transparent`
                        : isDark ? "border-gray-600 hover:border-gray-500 bg-gray-700/50 text-gray-300" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-semibold text-sm">{priority.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Date */}
            <div>
              <label className={`flex items-center text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Calendar className="w-4 h-4 mr-2" />
                When did this happen? *
              </label>
              <input
                type="date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                }`}
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className={`flex items-center text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <MapPin className="w-4 h-4 mr-2" />
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Office Building A, Floor 3, Meeting Room"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Be as specific as you're comfortable sharing
              </p>
            </div>

            {/* Description */}
            <div>
              <label className={`flex items-center text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <FileText className="w-4 h-4 mr-2" />
                Detailed Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="8"
                placeholder="Please describe what happened in as much detail as possible. Include:
• What happened
• Who was involved
• What was said or done
• How it made you feel
• Any previous incidents"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  Minimum 50 characters
                </p>
                <p className={`text-xs font-medium ${
                  formData.description.length < 50 ? "text-red-500" : "text-green-500"
                }`}>
                  {formData.description.length} characters
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className={`border-l-4 border-yellow-500 p-4 rounded ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
              <div className="flex items-start">
                <Info className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  This information is optional but helps us investigate better. You can skip this step.
                </p>
              </div>
            </div>

            {/* Accused Person */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Person(s) Involved (Optional)
              </label>
              <input
                type="text"
                name="accusedPerson"
                value={formData.accusedPerson}
                onChange={handleChange}
                placeholder="Name or description of the person"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Department */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Department/Division (Optional)
              </label>
              <input
                type="text"
                name="accusedDepartment"
                value={formData.accusedDepartment}
                onChange={handleChange}
                placeholder="e.g., Sales, HR, Engineering"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Witnesses */}
            <div>
              <label className={`flex items-center text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Users className="w-4 h-4 mr-2" />
                Witness Names (Optional)
              </label>
              <textarea
                name="witnessNames"
                value={formData.witnessNames}
                onChange={handleChange}
                rows="3"
                placeholder="Names of any witnesses (one per line)"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className={`border-l-4 border-red-500 p-4 rounded ${isDark ? 'bg-red-900/30' : 'bg-red-50'}`}>
              <div className="flex items-start">
                <AlertCircle className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                <div>
                  <h3 className={`font-semibold mb-1 ${isDark ? 'text-red-300' : 'text-red-900'}`}>Evidence Required</h3>
                  <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-800'}`}>
                    To prevent false accusations, please provide supporting evidence OR collect witness verification.
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className={`flex items-center text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Camera className="w-4 h-4 mr-2" />
                Upload Evidence Files
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer ${
                isDark ? 'border-gray-600 bg-gray-700/50' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Click to upload or drag and drop
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Photos, videos, audio, or documents
                  </p>
                </label>
              </div>

              {/* Uploaded Files */}
              {formData.evidenceFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.evidenceFiles.map((file, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center">
                        <FileText className={`w-4 h-4 mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidence(index, 'evidenceFiles')}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* URL Evidence */}
            <div>
              <label className={`flex items-center text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Link2 className="w-4 h-4 mr-2" />
                Evidence Links
              </label>
              <button
                type="button"
                onClick={addEvidenceUrl}
                className={`w-full px-4 py-3 border-2 rounded-lg hover:border-indigo-400 transition-colors text-left ${
                  isDark ? 'border-gray-600 text-gray-400 bg-gray-700/50' : 'border-gray-300 text-gray-600'
                }`}
              >
                + Add Google Drive, Dropbox, or other URL
              </button>

              {formData.evidenceUrls.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.evidenceUrls.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center overflow-hidden">
                        <Link2 className={`w-4 h-4 mr-2 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{item.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvidence(index, 'evidenceUrls')}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Witness Form */}
            <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`p-4 rounded-lg mb-3 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>OR Collect Witness Verification</h3>
                <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                  Create a Google Form and collect at least 5 witness responses. Paste the form URL below.
                </p>
              </div>
              <input
                type="url"
                name="witnessFormUrl"
                value={formData.witnessFormUrl}
                onChange={handleChange}
                placeholder="Google Form URL for witness verification"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            </motion.div>

            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Complaint Submitted Successfully!
            </h2>

            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Your complaint has been received and will be reviewed by our team.
            </p>

            {/* Anonymous ID Display */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-2xl text-white mb-6">
              <div className="flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold">Your Anonymous ID</h3>
              </div>

              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <p className="text-3xl font-mono font-bold tracking-wider">
                    {showId ? anonymousId : "ANON-****-********"}
                  </p>
                  <button
                    onClick={() => setShowId(!showId)}
                    className="ml-3 p-2 hover:bg-white hover:bg-opacity-20 rounded transition-all"
                  >
                    {showId ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <p className="text-sm text-indigo-100 mb-4">
                ⚠️ Save this ID securely! You'll need it to track your complaint status.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(anonymousId)}
                  className="flex-1 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Copy ID
                </button>
                <button
                  onClick={downloadIdAsImage}
                  className="flex-1 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Download
                </button>
              </div>
            </div>

            {/* Next Steps */}
            <div className={`max-w-2xl mx-auto p-6 rounded-lg text-left ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-bold text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>What Happens Next?</h3>
              <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                <li className="flex items-start">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</span>
                  <span>Your complaint will be reviewed within 24-48 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</span>
                  <span>Our system will analyze relevant laws and provide legal guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</span>
                  <span>You can track status using your Anonymous ID</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">4</span>
                  <span>If verified, you can connect with legal advisors anonymously</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/employee/reports'}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                View My Reports
              </button>
              <button
                onClick={() => window.location.reload()}
                className={`px-6 py-3 rounded-lg transition-colors font-semibold ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Submit Another
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Anonymous Complaint System
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Your safety matters. Report incidents safely and anonymously.
          </p>
        </motion.div>

        {/* Progress Bar */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Step {currentStep} of {totalSteps - 1}
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {Math.round((currentStep / (totalSteps - 1)) * 100)}% Complete
              </span>
            </div>
            <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Basic Info</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Details</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>People</span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Evidence</span>
            </div>
          </div>
        )}

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 ? (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-3 rounded-lg transition-colors font-semibold flex items-center ${
                      isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </motion.button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center ml-auto"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`px-8 py-3 rounded-lg text-white font-semibold flex items-center ml-auto ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    } transition-all shadow-lg`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Complaint
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </form>
        </motion.div>

        {/* Help Section */}
        {currentStep < 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Need help? Contact support at{" "}
              <a href="mailto:support@safedesk.com" className="text-indigo-600 hover:underline">
                support@safedesk.com
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AnonymousComplaintForm;
