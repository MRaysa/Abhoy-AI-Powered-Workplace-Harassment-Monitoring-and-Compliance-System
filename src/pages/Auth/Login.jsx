import React, { useState, useRef, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate, useLocation, Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef();

  const { signInUser, googleSignIn } = useContext(AuthContext);
  const { isDark } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInUser(email, password);
      
      // Get user role from backend response
      const response = await fetch('http://localhost:3000/api/auth/verify-firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email
        }),
      });

      const data = await response.json();
      const userRole = data.data?.user?.role || 'employee';

      // Show success message
      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Signed in successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect based on role
      const redirectPath = userRole === 'admin' 
        ? '/admin/dashboard' 
        : location?.state?.from || '/employee/home';
      
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Sign-in error:", error);
      
      // Show error message based on error type
      let errorMessage = error.message;
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Incorrect email or password";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "User not found. Please check your email or sign up.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      setError(errorMessage);

      await Swal.fire({
        icon: "error",
        title: "Sign-in Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    
    try {
      const result = await googleSignIn();
      
      // Get user role from backend response
      const response = await fetch('http://localhost:3000/api/auth/verify-firebase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email
        }),
      });

      const data = await response.json();
      const userRole = data.data?.user?.role || 'employee';

      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Signed in with Google",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect based on role
      const redirectPath = userRole === 'admin' 
        ? '/admin/dashboard' 
        : location?.state?.from || '/employee/home';
      
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      const errorMessage = error.message || "Failed to sign in with Google. Please try again.";
      setError(errorMessage);

      await Swal.fire({
        icon: "error",
        title: "Google Sign-in Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2 opacity-20"></div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg"
            >
              <span className="text-indigo-600 font-bold text-3xl">অ</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Welcome to অভয়</h1>
            <p className="text-indigo-100 mt-2">Sign in to access your workplace safety portal</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-8 pt-6">
            <div className={`border-l-4 p-4 ${
              isDark
                ? 'bg-red-900/50 border-red-500 text-red-200'
                : 'bg-red-100 border-red-500 text-red-700'
            }`}>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className={`flex items-center text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <FaEnvelope className="mr-2 text-indigo-500" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className={`flex items-center text-sm font-medium ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <FaLock className="mr-2 text-indigo-500" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="••••••••"
                required
                minLength="6"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                ) : (
                  <FaEye className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className={`ml-2 block text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className={`text-sm hover:underline transition ${
                isDark
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              Forgot password?
            </Link>
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
                Signing In...
              </span>
            ) : "Sign In to অভয়"}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${
                isDark ? 'border-gray-600' : 'border-gray-300'
              }`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-3 ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              }`}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 border-2 rounded-lg transition-all font-medium ${
              isDark
                ? 'border-gray-600 hover:bg-gray-700 hover:border-gray-500 text-gray-200'
                : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
            }`}
          >
            <FaGoogle className="text-red-500 text-xl" />
            <span>Sign in with Google</span>
          </motion.button>
        </form>

        {/* Footer */}
        <div className={`px-8 py-5 text-center border-t ${
          isDark
            ? 'bg-gradient-to-r from-gray-700 to-gray-700 border-gray-700'
            : 'bg-gradient-to-r from-gray-50 to-indigo-50 border-gray-200'
        }`}>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Don't have an account?{" "}
            <a
              href="/signup"
              className={`font-semibold hover:underline transition ${
                isDark
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              Create an account
            </a>
          </p>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Secure workplace harassment monitoring & compliance
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
