import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext"; 
import {
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaSignInAlt,
  FaUserPlus,
  FaClock,
  FaBolt,
  FaCog,
  FaHandsHelping,
  FaKeyboard,
  FaBell,
  FaFileAlt,
  FaUserSecret,
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaBuilding,
  FaCertificate,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaComments,
  FaBalanceScale,
} from "react-icons/fa";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { HiDesktopComputer } from "react-icons/hi";

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const { theme, setLightTheme, setDarkTheme, setSystemTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/");
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Handle broken images
  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  return (
    <nav className={`${isDark ? 'bg-[#1a2332]' : 'bg-[#AFDDE590] '} ${isDark ? 'text-white' : 'text-[#0B2B37]'} shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(97, 124, 136, 0)",
                    "0 0 20px rgba(97, 124, 136, 0.4)",
                    "0 0 0px rgba(97, 124, 136, 0)"
                  ]
                }}
                transition={{
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.2 }
                }}
                className="h-8 w-8 bg-[#617C88] rounded-full flex items-center justify-center mr-2"
              >
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-[#D5E6EE] font-bold text-xl"
                >
                  অ
                </motion.span>
              </motion.div>
              <span className={`font-bold text-xl hidden sm:inline ${isDark ? 'text-white' : 'text-[#0B2B37]'}`}>
                ভয়
              </span>
            </Link>
          </div>
{/* Nav */}
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-[#0B2B37] hover:text-white'} transition duration-300 flex items-center`}
              >
                <FaHome className="mr-1" /> Home
              </Link>

              <Link
                to="/lawyers"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-[#0B2B37] hover:text-white'} transition duration-300 flex items-center`}
              >
                <FaBalanceScale className="mr-1" /> Lawyers
              </Link>

              {user ? (
                <>
                  {/* Chat Button */}
                  <Link
                    to="/chat"
                    className={`relative px-3 py-2 rounded-md text-sm font-medium ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-[#0B2B37] hover:text-white'} transition duration-300 flex items-center`}
                  >
                    <FaComments className="text-xl" />
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative ml-3">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-[#0B2B37] hover:text-white'} transition duration-300 focus:outline-none`}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white text-[#0B2B37] flex items-center justify-center">
                        <FaUser />
                      </div>
                    )}
                    <span className="ml-2">{user.displayName || "User"}</span>
                  </button>

                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute right-0 mt-2 w-80 ${isDark ? 'bg-[#1a2332] border-[#2d3748]' : 'bg-white border-gray-200'} rounded-xl shadow-2xl py-3 z-50 border`}
                    >
                      {/* User Info Header */}
                      <div className={`px-4 py-3 border-b ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
                        <div className="flex items-center space-x-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt="Profile"
                              className="h-12 w-12 rounded-full object-cover border-2 border-[#617C88]"
                              onError={handleImageError}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-[#617C88] text-white flex items-center justify-center">
                              <FaUser className="text-xl" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                {user.displayName || "User"}
                              </p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                user.role === 'admin' 
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}>
                                {user.role === 'admin' ? 'ADMIN' : 'EMPLOYEE'}
                              </span>
                            </div>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                              {user.email}
                            </p>
                          </div>
                          <button className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                            <FaBell />
                          </button>
                        </div>
                      </div>

                      {/* Quick Access - Role Based */}
                      <div className="px-3 py-2">
                        <p className={`text-xs uppercase font-semibold px-2 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Quick Access</p>
                        
                        {user.role === 'admin' ? (
                          // Admin Quick Access
                          <div className="grid grid-cols-5 gap-2">
                            <Link to="/admin/enhanced-dashboard" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaTachometerAlt className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Dashboard</span>
                            </Link>
                            <Link to="/admin/reports" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaClipboardList className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Reports</span>
                            </Link>
                            <Link to="/admin/complaints" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaExclamationTriangle className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Complaints</span>
                            </Link>
                            <Link to="/admin/analytics" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaChartLine className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Analytics</span>
                            </Link>
                            <Link to="/admin/users" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaUsers className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Users</span>
                            </Link>
                          </div>
                        ) : (
                          // Employee Quick Access
                          <div className="grid grid-cols-5 gap-2">
                            <Link to="/employee/home" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaUser className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Profile</span>
                            </Link>
                            <Link to="/employee/reports" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaClock className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>My Reports</span>
                            </Link>
                            <Link to="/employee/forum" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaBolt className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Forum</span>
                            </Link>
                            <Link to="/employee/track-complaint" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaBell className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Track</span>
                            </Link>
                            <Link to="/employee/settings" className={`flex flex-col items-center p-2 rounded-lg ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-gray-100'} transition`}>
                              <FaCog className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-1`} />
                              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Settings</span>
                            </Link>
                          </div>
                        )}
                      </div>

                      {/* More Options - Role Based */}
                      <div className={`px-3 py-2 border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-200'} mt-2`}>
                        <p className={`text-xs uppercase font-semibold px-2 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>More Options</p>
                        
                        {user.role === 'admin' ? (
                          // Admin More Options
                          <>
                            <Link to="/admin/departments" className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'text-gray-300 hover:bg-[#2d3748]' : 'text-gray-700 hover:bg-gray-100'} transition`}>
                              <FaBuilding className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span>Departments</span>
                            </Link>
                            <Link to="/admin/certifications" className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'text-gray-300 hover:bg-[#2d3748]' : 'text-gray-700 hover:bg-gray-100'} transition`}>
                              <FaCertificate className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span>Certifications</span>
                            </Link>
                            <Link to="/admin/dashboard" className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'text-gray-300 hover:bg-[#2d3748]' : 'text-gray-700 hover:bg-gray-100'} transition`}>
                              <FaTachometerAlt className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span>Classic Dashboard</span>
                            </Link>
                          </>
                        ) : (
                          // Employee More Options
                          <>
                            <Link to="/employee/report" className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'text-gray-300 hover:bg-[#2d3748]' : 'text-gray-700 hover:bg-gray-100'} transition`}>
                              <FaFileAlt className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span>Report Incident</span>
                            </Link>
                            <Link to="/employee/anonymous-complaint" className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'text-gray-300 hover:bg-[#2d3748]' : 'text-gray-700 hover:bg-gray-100'} transition`}>
                              <FaUserSecret className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span>Anonymous Complaint</span>
                            </Link>
                            <Link to="/employee/legal-support" className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'text-gray-300 hover:bg-[#2d3748]' : 'text-gray-700 hover:bg-gray-100'} transition`}>
                              <FaHandsHelping className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span>Legal Support</span>
                            </Link>
                            <Link to="/employee/workplace-finder" className={`flex items-center w-full px-3 py-2 rounded-lg text-sm ${isDark ? 'text-gray-300 hover:bg-[#2d3748]' : 'text-gray-700 hover:bg-gray-100'} transition`}>
                              <FaKeyboard className={`mr-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                              <span>Workplace Finder</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Theme Toggle */}
                      <div className={`px-3 py-2 border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between px-3 py-2">
                          <div className="flex space-x-2">
                            <button 
                              onClick={setLightTheme}
                              className={`p-2 rounded-lg ${theme === 'light' ? 'bg-indigo-600 text-white' : isDark ? 'bg-[#2d3748] text-gray-400' : 'bg-gray-200 text-gray-600'} hover:text-white transition`}
                              title="Light Mode"
                            >
                              <FiSun />
                            </button>
                            <button 
                              onClick={setDarkTheme}
                              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-600 text-white' : isDark ? 'bg-[#2d3748] text-gray-400' : 'bg-gray-200 text-gray-600'} hover:text-white transition`}
                              title="Dark Mode"
                            >
                              <FiMoon />
                            </button>
                            <button 
                              onClick={setSystemTheme}
                              className={`p-2 rounded-lg ${isDark ? 'bg-[#2d3748] text-gray-400' : 'bg-gray-200 text-gray-600'} hover:text-white transition`}
                              title="System Theme"
                            >
                              <HiDesktopComputer />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sign Out */}
                      <div className={`px-3 py-2 border-t ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
                        <button
                          onClick={handleSignOut}
                          className={`flex items-center justify-center w-full px-3 py-2 rounded-lg text-sm text-red-400 ${isDark ? 'hover:bg-[#2d3748]' : 'hover:bg-red-50'} transition font-semibold`}
                        >
                          <FaSignOutAlt className="mr-2" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#0B2B37] hover:text-white transition duration-300 flex items-center"
                  >
                    <FaSignInAlt className="mr-1" /> Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signup"
                      className="px-3 py-2 rounded-md text-sm font-medium bg-white text-[#0B2B37] hover:bg-[#D5E6EE] transition duration-300 flex items-center"
                    >
                      <FaUserPlus className="mr-1" /> Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="mr-4 flex items-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-white text-[#0B2B37] flex items-center justify-center">
                    <FaUser />
                  </div>
                )}
                <span className="ml-2 text-sm">
                  {user.displayName || "User"}
                </span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-[#0B2B37] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-[#0B2B37]"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#0B2B37]"
            >
              Home
            </Link>

            <Link
              to="/lawyers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#0B2B37]"
            >
              Lawyers
            </Link>

            {user ? (
              <>
                <div className="px-3 py-2 flex items-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover mr-2"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-white text-[#0B2B37] flex items-center justify-center mr-2">
                      <FaUser />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-indigo-100">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium hover:bg-[#0B2B37] text-left"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#0B2B37] hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-[#0B2B37] hover:bg-[#D5E6EE] hover:text-[#0B2B37]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
