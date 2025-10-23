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
      const response = await fetch('https://abhoy-server.vercel.app/api/auth/verify-firebase', {
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
      const response = await fetch('https://abhoy-server.vercel.app/api/auth/verify-firebase', {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-20" style={{ backgroundColor: isDark ? '#1a1a1a' : '#AFDDE540' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
        style={{ backgroundColor: isDark ? '#2d2d2d' : '#ffffff' }}
      >
        {/* Header */}
        <div className="p-8 text-center relative overflow-hidden" style={{ background: isDark ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #024950 0%, #003135 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: '#AFDDE5' }}></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full translate-x-1/2 translate-y-1/2" style={{ backgroundColor: '#AFDDE5' }}></div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-lg"
              style={{ backgroundColor: '#AFDDE5' }}
            >
              <span className="font-bold text-3xl" style={{ color: '#003135' }}>অ</span>
            </motion.div>
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Welcome to অভয়
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm"
              style={{ color: '#AFDDE5' }}
            >
              Sign in to access your workplace safety portal
            </motion.p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mx-8 mt-6"
          >
            <div className="border-l-4 p-4 rounded-r-lg" style={{ backgroundColor: isDark ? 'rgba(150, 71, 52, 0.2)' : '#fff5f5', borderColor: '#964734' }}>
              <p className="text-sm" style={{ color: isDark ? '#ff9999' : '#964734' }}>{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <div className="p-8 space-y-5">
          {/* Email Field */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="space-y-2"
          >
            <label
              htmlFor="email"
              className="flex items-center text-sm font-medium"
              style={{ color: isDark ? '#AFDDE5' : '#003135' }}
            >
              <FaEnvelope className="mr-2" style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none"
              style={{ 
                borderColor: isDark ? '#444' : '#AFDDE5',
                backgroundColor: isDark ? '#3d3d3d' : '#fff',
                color: isDark ? '#fff' : '#003135'
              }}
              onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
              onBlur={(e) => e.target.style.borderColor = isDark ? '#444' : '#AFDDE5'}
              placeholder="your@email.com"
              required
            />
          </motion.div>

          {/* Password Field */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="space-y-2"
          >
            <label
              htmlFor="password"
              className="flex items-center text-sm font-medium"
              style={{ color: isDark ? '#AFDDE5' : '#003135' }}
            >
              <FaLock className="mr-2" style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none"
                style={{ 
                  borderColor: isDark ? '#444' : '#AFDDE5',
                  backgroundColor: isDark ? '#3d3d3d' : '#fff',
                  color: isDark ? '#fff' : '#003135'
                }}
                onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
                onBlur={(e) => e.target.style.borderColor = isDark ? '#444' : '#AFDDE5'}
                placeholder="••••••••"
                required
                minLength="6"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                ) : (
                  <FaEye style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-2 cursor-pointer"
                style={{ accentColor: isDark ? '#AFDDE5' : '#024950', borderColor: isDark ? '#666' : '#AFDDE5' }}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 cursor-pointer"
                style={{ color: isDark ? '#ccc' : '#003135' }}
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="font-medium transition-all duration-200"
              style={{ color: isDark ? '#AFDDE5' : '#024950' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateX(2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg"
            style={{ 
              backgroundColor: loading ? (isDark ? '#666' : '#AFDDE5') : (isDark ? '#AFDDE5' : '#003135'),
              color: loading ? '#fff' : (isDark ? '#003135' : '#fff'),
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style={{ color: isDark ? '#003135' : '#fff' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In to অভয়"
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: isDark ? '#444' : '#AFDDE5' }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3" style={{ backgroundColor: isDark ? '#2d2d2d' : '#ffffff', color: isDark ? '#AFDDE5' : '#024950' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <motion.button
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 rounded-lg transition-all duration-200 shadow-sm font-medium"
            style={{ 
              borderColor: isDark ? '#444' : '#AFDDE5',
              backgroundColor: isDark ? '#3d3d3d' : '#fff',
              color: isDark ? '#fff' : '#003135'
            }}
          >
            <FaGoogle className="text-xl" style={{ color: '#964734' }} />
            <span>Sign in with Google</span>
          </motion.button>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 text-center" style={{ backgroundColor: isDark ? '#1a1a1a' : '#ecf8f8' }}>
          <p className="text-sm" style={{ color: isDark ? '#ccc' : '#024950' }}>
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-semibold transition-all duration-200"
              style={{ color: isDark ? '#AFDDE5' : '#003135' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateX(2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
            >
              Create an account
            </a>
          </p>
          <p className="text-xs mt-2" style={{ color: isDark ? '#888' : '#024950', opacity: 0.8 }}>
            Secure workplace harassment monitoring & compliance
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
