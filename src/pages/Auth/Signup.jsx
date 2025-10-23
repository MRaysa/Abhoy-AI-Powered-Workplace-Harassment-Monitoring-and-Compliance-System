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
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { userAPI } from "../../services/api";
import Swal from "sweetalert2";
import { useTheme } from "../../contexts/ThemeContext";

const SignUp = () => {
  const { createUser, googleSignIn, updateUser, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const { isDark } = useTheme();

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
  const [speakingField, setSpeakingField] = useState(null);

  // Bengali voice instructions for each field
  const voiceInstructions = {
    name: "Eikhane apnar puro naam likhun",
    email: "Eikhane apnar email address likhun",
    password: "Eikhane ekti strong password likhun. Password e kom poke 6 ta character thakte hobe, boro hater o choto hater letter thakte hobe ebong number o thakte hobe",
    phone: "Eikhane apnar phone number likhun",
    address: "Eikhane apnar thikana likhun",
    photo: "Eikhane apnar profile picture upload korun ba image URL diye din"
  };

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

  const speakInstruction = (field) => {
    // Stop any currently speaking
    window.speechSynthesis.cancel();
    
    if (speakingField === field) {
      // If clicking the same field, stop speaking
      setSpeakingField(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(voiceInstructions[field]);
    utterance.lang = 'bn-BD'; // Bengali language
    utterance.rate = 0.9; // Slightly slower for clarity
    
    utterance.onend = () => {
      setSpeakingField(null);
    };
    
    utterance.onerror = () => {
      setSpeakingField(null);
    };
    
    setSpeakingField(field);
    window.speechSynthesis.speak(utterance);
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
    <div className="min-h-screen flex items-center justify-center px-4 py-20 " style={{ backgroundColor: isDark ? '#1a1a1a' : '#ecf8f8' }}>
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
              Join অভয়
            </motion.h1>
            <motion.p 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm"
              style={{ color: '#AFDDE5' }}
            >
              Create your workplace safety account
            </motion.p>
          </div>
        </div>

        {/* Error Message */}
        {errors.firebase && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mx-8 mt-6"
          >
            <div className="border-l-4 p-4 rounded-r-lg" style={{ backgroundColor: isDark ? 'rgba(150, 71, 52, 0.2)' : '#fff5f5', borderColor: '#964734' }}>
              <p className="text-sm" style={{ color: isDark ? '#ff9999' : '#964734' }}>{errors.firebase}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <div className="p-8 space-y-4">
          {/* Profile Picture Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: isDark ? '#AFDDE5' : '#003135' }}>
                Profile Picture
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => speakInstruction('photo')}
                className="p-2 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: speakingField === 'photo' ? (isDark ? '#4d4d4d' : '#AFDDE5') : 'transparent',
                  color: speakingField === 'photo' ? (isDark ? '#AFDDE5' : '#003135') : (isDark ? '#666' : '#024950')
                }}
              >
                {speakingField === 'photo' ? (
                  <FaVolumeUp className="text-lg" />
                ) : (
                  <FaVolumeMute className="text-lg" />
                )}
              </motion.button>
            </div>
            <div className="relative">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-md"
                style={{ 
                  backgroundColor: isDark ? '#3d3d3d' : '#f0f0f0',
                  borderColor: isDark ? '#666' : '#AFDDE5'
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="text-3xl" style={{ color: isDark ? '#666' : '#AFDDE5' }} />
                )}
              </motion.div>
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
                  style={{ accentColor: isDark ? '#AFDDE5' : '#024950' }}
                />
                <label
                  htmlFor="upload-option"
                  className="text-sm"
                  style={{ color: isDark ? '#ccc' : '#003135' }}
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
                    className="block w-full text-sm
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:transition-all file:duration-200"
                    style={{
                      color: isDark ? '#ccc' : '#666',
                      '--file-bg': isDark ? '#3d3d3d' : '#ecf8f8',
                      '--file-text': isDark ? '#AFDDE5' : '#003135',
                      '--file-hover-bg': isDark ? '#4d4d4d' : '#AFDDE5'
                    }}
                  />
                  <style>{`
                    input[type="file"]::file-selector-button {
                      background-color: ${isDark ? '#3d3d3d' : '#ecf8f8'};
                      color: ${isDark ? '#AFDDE5' : '#003135'};
                    }
                    input[type="file"]::file-selector-button:hover {
                      background-color: ${isDark ? '#4d4d4d' : '#AFDDE5'};
                    }
                  `}</style>
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
                  style={{ accentColor: isDark ? '#AFDDE5' : '#024950' }}
                />
                <label htmlFor="url-option" className="text-sm" style={{ color: isDark ? '#ccc' : '#003135' }}>
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
                    className="w-full px-3 py-2 border-2 rounded-md text-sm shadow-sm transition-all duration-200 focus:outline-none"
                    style={{
                      borderColor: errors.photoURL ? '#964734' : (isDark ? '#444' : '#AFDDE5'),
                      backgroundColor: isDark ? '#3d3d3d' : '#fff',
                      color: isDark ? '#fff' : '#003135'
                    }}
                    onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
                    onBlur={(e) => e.target.style.borderColor = errors.photoURL ? '#964734' : (isDark ? '#444' : '#AFDDE5')}
                  />
                  {errors.photoURL && (
                    <p className="text-xs mt-1" style={{ color: '#964734' }}>
                      {errors.photoURL}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Name Field */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="name"
                className="flex items-center text-sm font-medium"
                style={{ color: isDark ? '#AFDDE5' : '#003135' }}
              >
                <FaUser className="mr-2" style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                Full Name
              </label>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => speakInstruction('name')}
                className="p-1 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: speakingField === 'name' ? (isDark ? '#4d4d4d' : '#AFDDE5') : 'transparent',
                  color: speakingField === 'name' ? (isDark ? '#AFDDE5' : '#003135') : (isDark ? '#666' : '#024950')
                }}
              >
                {speakingField === 'name' ? (
                  <FaVolumeUp className="text-sm" />
                ) : (
                  <FaVolumeMute className="text-sm" />
                )}
              </motion.button>
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                borderColor: errors.name ? '#964734' : (isDark ? '#444' : '#AFDDE5'),
                backgroundColor: isDark ? '#3d3d3d' : '#fff',
                color: isDark ? '#fff' : '#003135'
              }}
              onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
              onBlur={(e) => e.target.style.borderColor = errors.name ? '#964734' : (isDark ? '#444' : '#AFDDE5')}
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: '#964734' }}>{errors.name}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="flex items-center text-sm font-medium"
                style={{ color: isDark ? '#AFDDE5' : '#003135' }}
              >
                <FaEnvelope className="mr-2" style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                Email Address
              </label>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => speakInstruction('email')}
                className="p-1 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: speakingField === 'email' ? (isDark ? '#4d4d4d' : '#AFDDE5') : 'transparent',
                  color: speakingField === 'email' ? (isDark ? '#AFDDE5' : '#003135') : (isDark ? '#666' : '#024950')
                }}
              >
                {speakingField === 'email' ? (
                  <FaVolumeUp className="text-sm" />
                ) : (
                  <FaVolumeMute className="text-sm" />
                )}
              </motion.button>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                borderColor: errors.email ? '#964734' : (isDark ? '#444' : '#AFDDE5'),
                backgroundColor: isDark ? '#3d3d3d' : '#fff',
                color: isDark ? '#fff' : '#003135'
              }}
              onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
              onBlur={(e) => e.target.style.borderColor = errors.email ? '#964734' : (isDark ? '#444' : '#AFDDE5')}
              placeholder="your@email.com"
              required
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: '#964734' }}>{errors.email}</p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="flex items-center text-sm font-medium"
                style={{ color: isDark ? '#AFDDE5' : '#003135' }}
              >
                <FaLock className="mr-2" style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                Password
              </label>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => speakInstruction('password')}
                className="p-1 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: speakingField === 'password' ? (isDark ? '#4d4d4d' : '#AFDDE5') : 'transparent',
                  color: speakingField === 'password' ? (isDark ? '#AFDDE5' : '#003135') : (isDark ? '#666' : '#024950')
                }}
              >
                {speakingField === 'password' ? (
                  <FaVolumeUp className="text-sm" />
                ) : (
                  <FaVolumeMute className="text-sm" />
                )}
              </motion.button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: errors.password ? '#964734' : (isDark ? '#444' : '#AFDDE5'),
                  backgroundColor: isDark ? '#3d3d3d' : '#fff',
                  color: isDark ? '#fff' : '#003135'
                }}
                onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
                onBlur={(e) => e.target.style.borderColor = errors.password ? '#964734' : (isDark ? '#444' : '#AFDDE5')}
                placeholder="••••••••"
                required
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                ) : (
                  <FaEye style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                )}
              </motion.button>
            </div>
            {errors.password ? (
              <p className="text-xs mt-1" style={{ color: '#964734' }}>{errors.password}</p>
            ) : (
              <p className="text-xs mt-1" style={{ color: isDark ? '#888' : '#666' }}>
                Must be at least 6 characters with uppercase, lowercase, and number
              </p>
            )}
          </motion.div>

          {/* Phone Number Field */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="phone"
                className="flex items-center text-sm font-medium"
                style={{ color: isDark ? '#AFDDE5' : '#003135' }}
              >
                <FaPhone className="mr-2" style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                Phone Number
              </label>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => speakInstruction('phone')}
                className="p-1 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: speakingField === 'phone' ? (isDark ? '#4d4d4d' : '#AFDDE5') : 'transparent',
                  color: speakingField === 'phone' ? (isDark ? '#AFDDE5' : '#003135') : (isDark ? '#666' : '#024950')
                }}
              >
                {speakingField === 'phone' ? (
                  <FaVolumeUp className="text-sm" />
                ) : (
                  <FaVolumeMute className="text-sm" />
                )}
              </motion.button>
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                borderColor: errors.phone ? '#964734' : (isDark ? '#444' : '#AFDDE5'),
                backgroundColor: isDark ? '#3d3d3d' : '#fff',
                color: isDark ? '#fff' : '#003135'
              }}
              onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
              onBlur={(e) => e.target.style.borderColor = errors.phone ? '#964734' : (isDark ? '#444' : '#AFDDE5')}
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="text-xs mt-1" style={{ color: '#964734' }}>{errors.phone}</p>
            )}
          </motion.div>

          {/* Address Field */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="address"
                className="flex items-center text-sm font-medium"
                style={{ color: isDark ? '#AFDDE5' : '#003135' }}
              >
                <FaMapMarkerAlt className="mr-2" style={{ color: isDark ? '#AFDDE5' : '#024950' }} />
                Address
              </label>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => speakInstruction('address')}
                className="p-1 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: speakingField === 'address' ? (isDark ? '#4d4d4d' : '#AFDDE5') : 'transparent',
                  color: speakingField === 'address' ? (isDark ? '#AFDDE5' : '#003135') : (isDark ? '#666' : '#024950')
                }}
              >
                {speakingField === 'address' ? (
                  <FaVolumeUp className="text-sm" />
                ) : (
                  <FaVolumeMute className="text-sm" />
                )}
              </motion.button>
            </div>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 rounded-lg transition-all duration-200 focus:outline-none"
              style={{
                borderColor: isDark ? '#444' : '#AFDDE5',
                backgroundColor: isDark ? '#3d3d3d' : '#fff',
                color: isDark ? '#fff' : '#003135'
              }}
              onFocus={(e) => e.target.style.borderColor = isDark ? '#AFDDE5' : '#024950'}
              onBlur={(e) => e.target.style.borderColor = isDark ? '#444' : '#AFDDE5'}
              placeholder="123 Main St, City, Country"
              rows="2"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full py-3 px-4 mt-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg"
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
                Creating Account...
              </span>
            ) : (
              "Create অভয় Account"
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: isDark ? '#444' : '#AFDDE5' }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3" style={{ backgroundColor: isDark ? '#2d2d2d' : '#ffffff', color: isDark ? '#AFDDE5' : '#024950' }}>
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Signup Button */}
          <motion.button
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 rounded-lg transition-all duration-200 shadow-sm font-medium"
            style={{ 
              borderColor: isDark ? '#444' : '#AFDDE5',
              backgroundColor: isDark ? '#3d3d3d' : '#fff',
              color: isDark ? '#fff' : '#003135'
            }}
          >
            <FaGoogle className="text-xl" style={{ color: '#964734' }} />
            <span>Sign up with Google</span>
          </motion.button>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 text-center" style={{ backgroundColor: isDark ? '#1a1a1a' : '#ecf8f8' }}>
          <p className="text-sm" style={{ color: isDark ? '#ccc' : '#024950' }}>
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold transition-all duration-200"
              style={{ color: isDark ? '#AFDDE5' : '#003135' }}
              onMouseEnter={(e) => e.target.style.transform = 'translateX(2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
            >
              Sign in
            </Link>
          </p>
          <p className="text-xs mt-2" style={{ color: isDark ? '#888' : '#024950', opacity: 0.8 }}>
            Secure workplace harassment monitoring & compliance
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;