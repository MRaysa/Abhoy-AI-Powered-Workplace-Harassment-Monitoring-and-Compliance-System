import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { userAPI } from "../../services/api";
import Swal from "sweetalert2";

const SignUp = () => {
  const { createUser, googleSignIn, updateUser, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters with uppercase, lowercase, and number";
    }

    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (formData.photoURL && !isValidUrl(formData.photoURL)) {
      newErrors.photoURL = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, photoURL: url }));

    if (isValidUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUserToDatabase = async (userProfile) => {
    try {
      console.log("Saving user to database:", userProfile);
      const response = await userAPI.create(userProfile);
      console.log("Database response:", response);
      return response;
    } catch (error) {
      console.error("Error saving user to database:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create user with email, password, and displayName
      const userCredential = await createUser(
        formData.email,
        formData.password,
        formData.name
      );

      // Update Firebase user profile with photo if provided
      if (formData.photoURL) {
        await updateUser({
          photoURL: formData.photoURL,
        });
      }

      // Show success message
      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your account has been created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect to employee home (new users are always employees)
      navigate("/employee/home", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      
      // Handle different types of errors
      let errorMessage = "An error occurred during signup";
      
      if (error.code === "auth/email-already-in-use" || error.message?.includes("email-already-in-use")) {
        errorMessage = "An account with this email already exists";
      } else if (error.code === "auth/weak-password" || error.message?.includes("weak-password")) {
        errorMessage = "Password is too weak";
      } else if (error.code === "auth/invalid-email" || error.message?.includes("invalid-email")) {
        errorMessage = "Invalid email address";
      } else if (error.message?.includes("Email already registered")) {
        errorMessage = "An account with this email already exists";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ firebase: errorMessage });
      
      await Swal.fire({
        icon: "error",
        title: "Account Creation Failed",
        text: errorMessage,
      });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your account has been created successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect based on role (Google sign-in users are employees by default)
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/employee/home';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Google signup error:", error);
      
      const errorMessage = error.message || "An error occurred during Google signup";
      setErrors({ firebase: errorMessage });
      
      await Swal.fire({
        icon: "error",
        title: "Google Sign-up Failed",
        text: errorMessage,
      });
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
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg"
            >
              <span className="text-indigo-600 font-bold text-3xl">S</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Join অভয়</h1>
            <p className="text-indigo-100 mt-2">Create your workplace safety account</p>
          </div>
        </div>

        {/* Error Message */}
        {errors.firebase && (
          <div className="px-8 pt-6">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{errors.firebase}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-indigo-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="text-gray-400 text-3xl" />
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="upload-option"
                  name="image-option"
                  checked={!useImageUrl}
                  onChange={() => setUseImageUrl(false)}
                  className="mr-2"
                />
                <label
                  htmlFor="upload-option"
                  className="text-sm text-gray-700"
                >
                  Upload Image
                </label>
              </div>

              {!useImageUrl && (
                <label className="block w-full">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </label>
              )}

              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="url-option"
                  name="image-option"
                  checked={useImageUrl}
                  onChange={() => setUseImageUrl(true)}
                  className="mr-2"
                />
                <label htmlFor="url-option" className="text-sm text-gray-700">
                  Use Image URL
                </label>
              </div>

              {useImageUrl && (
                <div className="mt-1">
                  <input
                    type="text"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-3 py-2 border ${
                      errors.photoURL ? "border-red-500" : "border-gray-300"
                    } rounded-md text-sm shadow-sm`}
                  />
                  {errors.photoURL && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.photoURL}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaUser className="mr-2 text-indigo-500" />
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaEnvelope className="mr-2 text-indigo-500" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              placeholder="your@email.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaLock className="mr-2 text-indigo-500" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Must be at least 6 characters with uppercase, lowercase, and number
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaPhone className="mr-2 text-indigo-500" />
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address Field */}
          <div className="space-y-1">
            <label
              htmlFor="address"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaMapMarkerAlt className="mr-2 text-indigo-500" />
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="123 Main St, City, Country"
              rows="2"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 mt-4 rounded-lg text-white font-semibold ${
              loading ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            } transition-all shadow-lg hover:shadow-xl`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : "Create অভয় Account"}
          </motion.button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Signup Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-gray-700"
          >
            <FaGoogle className="text-red-500 text-xl" />
            <span>Sign up with Google</span>
          </motion.button>
        </form>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-8 py-5 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
            >
              Sign in
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Secure workplace harassment monitoring & compliance
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
