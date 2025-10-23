import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaPaperPlane, FaUser, FaRobot, FaPhone, FaVideo, FaEllipsisV } from 'react-icons/fa';

const Chat = () => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! How can I help you today? I\'m here to assist with any questions about harassment reporting or workplace safety.',
      time: '10:30 AM'
    },
    {
      id: 2,
      sender: 'user',
      text: 'I need help filing a complaint.',
      time: '10:31 AM'
    },
    {
      id: 3,
      sender: 'bot',
      text: 'I can help you with that. You have two options:\n\n1. **Anonymous Complaint** - Your identity remains completely hidden\n2. **Regular Report** - Your identity is visible to authorized personnel\n\nWhich would you prefer?',
      time: '10:31 AM'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          sender: 'bot',
          text: 'Thank you for your message. Our support team will assist you shortly.',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
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
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-lg ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {msg.sender === 'user' ? (
                      <FaUser className="text-white text-sm" />
                    ) : (
                      <FaRobot className="text-white text-sm" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white'
                          : isDark
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'} ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
