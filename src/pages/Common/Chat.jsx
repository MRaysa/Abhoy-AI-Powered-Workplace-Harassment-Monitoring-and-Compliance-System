import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import { FaPaperPlane, FaUser, FaRobot, FaPhone, FaVideo, FaEllipsisV, FaGavel, FaShieldAlt } from 'react-icons/fa';
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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
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
                  অভয় Support
                </h2>
                <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  ● Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition`}>
                <FaPhone className="text-lg" />
              </button>
              <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition`}>
                <FaVideo className="text-lg" />
              </button>
              <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition`}>
                <FaEllipsisV className="text-lg" />
              </button>
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
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-purple-600 text-2xl mr-3" />
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recommended Legal Expert
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h4 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {recommendedLawyer.name}
                </h4>
                <p className={`text-sm mb-4 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                  {recommendedLawyer.specializations.map(s => s.replace(/-/g, ' ')).join(' • ')}
                </p>
                
                {recommendedLawyer.bio && (
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {recommendedLawyer.bio}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Experience</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recommendedLawyer.experience} years
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Success Rate</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recommendedLawyer.successRate}%
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Cases Handled</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recommendedLawyer.casesHandled}+
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Rating</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ⭐ {recommendedLawyer.rating}/5
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Contact Information</p>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                    📧 {recommendedLawyer.email}
                  </p>
                  <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                    📞 {recommendedLawyer.phone}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className={`text-center p-6 rounded-lg ${isDark ? 'bg-black bg-opacity-30' : 'bg-white'} mb-4`}>
                  <p className={`text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'} mb-2`}>
                    {recommendedLawyer.consultationFee === 0 ? 'FREE' : `$${recommendedLawyer.consultationFee}`}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Initial Consultation
                  </p>
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-xl transition">
                  Schedule Consultation
                </button>
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
