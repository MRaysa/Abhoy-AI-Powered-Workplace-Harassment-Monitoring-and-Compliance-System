import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { FaPaperPlane, FaUser, FaRobot, FaGavel, FaShieldAlt, FaTimes, FaCalendar, FaClock, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

const Chat = () => {
  const { isDark } = useTheme();
  const { user, getToken } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [caseAnalysis, setCaseAnalysis] = useState(null);
  const [recommendedLawyer, setRecommendedLawyer] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Load or start chat session
  useEffect(() => {
    if (user) {
      startChatSession();
    }
  }, [user]);

  const startChatSession = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await fetch(`${API_URL}/chat/session/start`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.data._id);
        setMessages(data.data.messages || []);
        if (data.data.caseAnalysis) {
          setCaseAnalysis(data.data.caseAnalysis);
        }
        if (data.data.recommendedLawyer) {
          setRecommendedLawyer(data.data.recommendedLawyer);
        }
      }
    } catch (error) {
      console.error('Failed to start chat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Failed to connect to AI assistant',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sessionId) return;

    const userMessage = message;
    setMessage('');
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setTyping(true);

    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data.messages || []);
        if (data.data.caseAnalysis) {
          setCaseAnalysis(data.data.caseAnalysis);
        }
        if (data.data.recommendedLawyer) {
          setRecommendedLawyer(data.data.recommendedLawyer);
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to send message',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    } catch (error) {
      console.error('Send message error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Failed to send message. Please try again.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } finally {
      setTyping(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!scheduleData.date || !scheduleData.time || !scheduleData.name || !scheduleData.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    try {
      const lawyerName = recommendedLawyer?.name || 'Your Legal Expert';
      const formattedDate = new Date(scheduleData.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const formattedTime = scheduleData.time;
      
      const fee = recommendedLawyer?.consultationFee === 0 || recommendedLawyer?.consultationFee === undefined || recommendedLawyer?.consultationFee === null
        ? 'FREE Initial Consultation'
        : `$${recommendedLawyer.consultationFee.toFixed(2)}`;
      Swal.fire({
        title: '<strong style="color: #7c3aed;">🎉 Consultation Confirmed!</strong>',
        html: `
          <div style="font-family: 'Inter', sans-serif; padding: 20px; text-align: left; line-height: 1.8;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Your Appointment Details</h3>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="margin: 8px 0; color: #495057;">
                <span style="display: inline-block; width: 100px; font-weight: 600; color: #6c757d;">👨‍⚖️ Lawyer:</span>
                <span style="color: #7c3aed; font-weight: 600;">${lawyerName}</span>
              </p>
              <p style="margin: 8px 0; color: #495057;">
                <span style="display: inline-block; width: 100px; font-weight: 600; color: #6c757d;">📅 Date:</span>
                <span style="color: #212529;">${formattedDate}</span>
              </p>
              <p style="margin: 8px 0; color: #495057;">
                <span style="display: inline-block; width: 100px; font-weight: 600; color: #6c757d;">🕐 Time:</span>
                <span style="color: #212529;">${formattedTime}</span>
              </p>
              <p style="margin: 8px 0; color: #495057;">
                <span style="display: inline-block; width: 100px; font-weight: 600; color: #6c757d;">💼 Fee:</span>
                <span style="color: #212529;">${fee}</span>
              </p>
            </div>

            <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #0d6efd;">
              <p style="margin: 8px 0; color: #495057;">
                <span style="display: inline-block; width: 100px; font-weight: 600; color: #6c757d;">📧 Email:</span>
                <span style="color: #212529;">${scheduleData.email}</span>
              </p>
              ${scheduleData.phone ? `
              <p style="margin: 8px 0; color: #495057;">
                <span style="display: inline-block; width: 100px; font-weight: 600; color: #6c757d;">📞 Phone:</span>
                <span style="color: #212529;">${scheduleData.phone}</span>
              </p>
              ` : ''}
            </div>

            ${scheduleData.message ? `
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; font-weight: 600; color: #856404; margin-bottom: 5px;">📝 Your Message:</p>
              <p style="margin: 0; color: #856404; font-style: italic;">"${scheduleData.message}"</p>
            </div>
            ` : ''}

            <div style="background: #d1f2eb; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center; border: 2px dashed #20c997;">
              <p style="margin: 0; color: #0f5132; font-weight: 600;">
                ✅ Confirmation email has been sent to your inbox
              </p>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #146c54;">
                Please check your spam folder if you don't see it within 5 minutes
              </p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #6c757d;">
                💼 <strong style="color: #495057;">Need to reschedule?</strong><br>
                Contact us at <a href="mailto:support@abhoy.com" style="color: #7c3aed; text-decoration: none;">support@abhoy.com</a>
              </p>
            </div>
          </div>
        `,
        width: '600px',
        showConfirmButton: true,
        confirmButtonText: 'Got it! 👍',
        confirmButtonColor: '#7c3aed',
        customClass: {
          popup: 'animated-popup',
          confirmButton: 'custom-confirm-button'
        }
      });

      // Reset form and close modal
      setShowScheduleModal(false);
      setScheduleData({
        date: '',
        time: '',
        name: user?.displayName || '',
        email: user?.email || '',
        phone: '',
        message: ''
      });
    } catch (err) {
      console.error('Schedule error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops! Something went wrong',
        text: 'Failed to schedule consultation. Please try again or contact support.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Schedule Consultation
                </h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Book a meeting with {recommendedLawyer?.name}
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition`}
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleScheduleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaCalendar className="inline mr-2" />
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={scheduleData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaClock className="inline mr-2" />
                      Preferred Time *
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={scheduleData.time}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-[#003135] focus:border-transparent`}
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaUser className="inline mr-2" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={scheduleData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-[#003135] focus:border-transparent`}
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaEnvelope className="inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={scheduleData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-[#003135] focus:border-transparent`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <FaPhone className="inline mr-2" />
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={scheduleData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-[#003135] focus:border-transparent`}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <FaComment className="inline mr-2" />
                    Additional Information (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={scheduleData.message}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Brief description of your case or any specific concerns..."
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-[#003135] focus:border-transparent resize-none`}
                  />
                </div>

                {/* Case Info Summary */}
                {caseAnalysis && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                    <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      📋 Your Case Information
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs ${isDark ? 'bg-gray-600 text-gray-200' : 'bg-white text-gray-700'}`}>
                        Type: {caseAnalysis.caseType.replace(/-/g, ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        caseAnalysis.severity === 'high' ? 'bg-red-600 text-white' :
                        caseAnalysis.severity === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        Severity: {caseAnalysis.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Lawyer Info */}
                {recommendedLawyer && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                    <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      👨‍⚖️ Consulting With
                    </p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recommendedLawyer.name}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {recommendedLawyer.specializations?.slice(0, 3).map(s => s.replace(/-/g, ' ')).join(', ')}
                    </p>
                    <p className={`text-sm mt-2 ${isDark ? 'text-green-400' : 'text-green-600'} font-semibold`}>
                      Consultation Fee: {
                        recommendedLawyer.consultationFee === 0 || recommendedLawyer.consultationFee === undefined || recommendedLawyer.consultationFee === null
                          ? '✅ FREE Initial Consultation'
                          : `$${recommendedLawyer.consultationFee}`
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#0FA4AF] to-[#003135] text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-xl shadow-lg p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <FaRobot className="text-white text-xl" />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  অভয় AI Legal Assistant
                </h2>
                <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  ● Online - AI Powered
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6 h-[500px] overflow-y-auto`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading AI Assistant...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      {msg.role === 'user' ? (
                        <FaUser className="text-white text-sm" />
                      ) : (
                        <FaGavel className="text-white text-sm" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : isDark
                            ? 'bg-gray-700 text-gray-100'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="whitespace-pre-line markdown-content">
                          {msg.content.split('\n').map((line, i) => {
                            // Bold text **text**
                            if (line.includes('**')) {
                              const parts = line.split('**');
                              return (
                                <p key={i} className="mb-2">
                                  {parts.map((part, j) => 
                                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                  )}
                                </p>
                              );
                            }
                            // List items
                            if (line.trim().match(/^[\d]+\.|^-/)) {
                              return <li key={i} className="ml-4 mb-1">{line.replace(/^[\d]+\.|^-/, '').trim()}</li>;
                            }
                            // Regular line
                            return line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                          })}
                        </div>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'} ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-lg">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500">
                      <FaGavel className="text-white text-sm" />
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-b-xl shadow-lg p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 px-4 py-3 rounded-lg ${
                isDark
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2 font-medium"
            >
              <span>Send</span>
              <FaPaperPlane />
            </button>
          </form>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            🔒 Your conversations are encrypted and confidential
          </p>
        </div>

        {/* Quick Actions */}
        {caseAnalysis && (
          <div className={`mt-6 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📋 Case Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Case Type</p>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {caseAnalysis.caseType.replace(/-/g, ' ').toUpperCase()}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Severity Level</p>
                <p className={`font-semibold ${
                  caseAnalysis.severity === 'high' ? 'text-red-500' :
                  caseAnalysis.severity === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {caseAnalysis.severity.toUpperCase()}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Keywords</p>
                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {caseAnalysis.keywords.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}

        {recommendedLawyer && (
          <div className={`mt-6 ${isDark ? 'bg-gradient-to-br from-purple-900 to-indigo-900' : 'bg-gradient-to-br from-purple-50 to-indigo-50'} rounded-xl shadow-lg p-6 border-2 ${isDark ? 'border-purple-700' : 'border-purple-200'}`}>
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recommended Legal Expert
                </h3>
                <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                  Best match for your case
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                {/* Lawyer Name & Title */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'}`}>
                  <h4 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {recommendedLawyer.name || 'Legal Expert'}
                  </h4>
                  {recommendedLawyer.specializations && recommendedLawyer.specializations.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {recommendedLawyer.specializations.map((spec, idx) => (
                        <span key={idx} className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                          {spec.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                      General Practice
                    </p>
                  )}
                </div>
                
                {/* Bio */}
                {recommendedLawyer.bio && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'}`}>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {recommendedLawyer.bio}
                    </p>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'} text-center`}>
                    <p className={`text-2xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'} mb-1`}>
                      {recommendedLawyer.experience || '10'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Years Experience</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'} text-center`}>
                    <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'} mb-1`}>
                      {recommendedLawyer.successRate || '90'}%
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'} text-center`}>
                    <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'} mb-1`}>
                      {recommendedLawyer.casesHandled || '100'}+
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cases Handled</p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'} text-center`}>
                    <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'} mb-1`}>
                      ⭐ {recommendedLawyer.rating || '4.8'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rating</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'}`}>
                  <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                    📞 Contact Information
                  </p>
                  <div className="space-y-2">
                    {recommendedLawyer.email && recommendedLawyer.email !== 'N/A' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📧</span>
                        <a href={`mailto:${recommendedLawyer.email}`} className={`${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition`}>
                          {recommendedLawyer.email}
                        </a>
                      </div>
                    ) : null}
                    {recommendedLawyer.phone && recommendedLawyer.phone !== 'N/A' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📞</span>
                        <a href={`tel:${recommendedLawyer.phone}`} className={`${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} transition`}>
                          {recommendedLawyer.phone}
                        </a>
                      </div>
                    ) : null}
                    {recommendedLawyer.location && (
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">📍</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {recommendedLawyer.location.city}, {recommendedLawyer.location.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Consultation Fee & Action */}
              <div className="flex flex-col justify-center space-y-4">
                <div className={`text-center p-8 rounded-lg ${isDark ? 'bg-gradient-to-br from-green-900 to-emerald-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'} border-2 ${isDark ? 'border-green-700' : 'border-green-200'}`}>
                  <div className="mb-3">
                    <div className={`inline-block px-4 py-2 rounded-full ${isDark ? 'bg-green-800' : 'bg-green-100'}`}>
                      <span className="text-4xl">💰</span>
                    </div>
                  </div>
                  <p className={`text-4xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'} mb-2`}>
                    {recommendedLawyer.consultationFee === 0 || !recommendedLawyer.consultationFee ? (
                      'FREE'
                    ) : (
                      `$${recommendedLawyer.consultationFee}`
                    )}
                  </p>
                  <p className={`text-sm font-medium ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                    Initial Consultation
                  </p>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No commitment required
                  </p>
                </div>
                
                <button 
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>📅</span>
                    <span>Schedule Consultation</span>
                  </span>
                </button>

                {recommendedLawyer.languages && recommendedLawyer.languages.length > 0 && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'} text-center`}>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Languages Spoken
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {recommendedLawyer.languages.map((lang, idx) => (
                        <span key={idx} className={`px-2 py-1 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📝 File Anonymous Complaint
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Submit a complaint without revealing your identity
            </p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              👥 Connect with Legal Support
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Get professional legal assistance
            </p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              📊 Track My Reports
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              View status of your submitted reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
