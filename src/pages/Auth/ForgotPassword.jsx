import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      await Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent",
        text: "Please check your email inbox for password reset instructions.",
        confirmButtonColor: "#4F46E5",
      });
      navigate("/signin");
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send password reset email";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      }

      setError(errorMessage);
      await Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
        confirmButtonColor: "#4F46E5",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2 opacity-20"></div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg"
            >
              <FaEnvelope className="text-indigo-600 text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Reset Password</h1>
            <p className="text-indigo-100 mt-2">
              We'll send you reset instructions
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="p-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg"
            >
              <p className="font-medium">{error}</p>
            </motion.div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaEnvelope className="mr-2 text-indigo-500" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="your@email.com"
              required
            />
            <p className="text-xs text-gray-500">
              Enter the email associated with your SafeDesk account
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            } transition-all shadow-lg hover:shadow-xl`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : "Send Reset Link"}
          </motion.button>

          {/* Back to Sign In */}
          <div className="text-center pt-2">
            <Link
              to="/signin"
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition"
            >
              <FaArrowLeft className="mr-2" />
              Back to Sign In
            </Link>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-8 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact support@safedesk.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
