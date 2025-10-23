import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Heart,
  AlertCircle,
  Users,
  Calendar,
  MapPin,
  Shield,
  TrendingUp,
  Send,
  Filter,
  Search,
  ThumbsUp,
  Share2,
  MoreHorizontal,
  FileText
} from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../../contexts/ThemeContext";

const PublicForum = () => {
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/complaints/forum/posts?page=${page}&limit=10`
      );
      const result = await response.json();

      if (result.success) {
        setPosts(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Posts",
        text: "Please refresh the page and try again.",
        confirmButtonColor: "#6366f1"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (anonymousId, reactionType) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/complaints/${anonymousId}/react`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reactionType }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update local state
        setPosts(posts.map(post => {
          if (post.anonymousId === anonymousId) {
            return {
              ...post,
              forumReactions: {
                ...post.forumReactions,
                [reactionType]: post.forumReactions[reactionType] + 1
              }
            };
          }
          return post;
        }));

        await Swal.fire({
          icon: "success",
          title: "Reaction Added",
          text: "Your reaction has been recorded",
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  const handleComment = async (anonymousId) => {
    const { value: comment } = await Swal.fire({
      title: "Add a Comment",
      input: "textarea",
      inputPlaceholder: "Share your thoughts or support...",
      inputAttributes: {
        "aria-label": "Type your comment here",
        style: "height: 100px"
      },
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      confirmButtonText: "Post Comment",
      inputValidator: (value) => {
        if (!value) {
          return "Please write a comment";
        }
      }
    });

    if (comment) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/complaints/${anonymousId}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment }),
          }
        );

        const result = await response.json();

        if (result.success) {
          await Swal.fire({
            icon: "success",
            title: "Comment Posted",
            text: "Your comment has been added",
            confirmButtonColor: "#6366f1"
          });
          
          // Refresh posts to show new comment
          fetchPosts();
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const reactionButtons = [
    { type: "support", icon: Heart, label: "Support", color: "text-red-500", bg: "bg-red-50", hoverBg: "hover:bg-red-100" },
    { type: "concern", icon: AlertCircle, label: "Concern", color: "text-orange-500", bg: "bg-orange-50", hoverBg: "hover:bg-orange-100" },
    { type: "similar", icon: Users, label: "Me Too", color: "text-blue-500", bg: "bg-blue-50", hoverBg: "hover:bg-blue-100" }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#18191a]' : 'bg-gray-100'} py-6 px-4 transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto">
        {/* Header - Similar to Facebook */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-[#242526]' : 'bg-white'} rounded-lg shadow p-6 mb-4`}
        >
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'} mb-1`}>
            Community Stories
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Verified harassment complaints shared by the community
          </p>
        </motion.div>

        {/* Search Bar - Facebook Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-[#242526]' : 'bg-white'} rounded-lg shadow p-4 mb-4`}
        >
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search stories..."
              className={`w-full pl-10 pr-4 py-2 ${isDark ? 'bg-[#3a3b3c] text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
        </motion.div>

        {/* Posts - Facebook Style */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-4`}>Loading stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className={`${isDark ? 'bg-[#242526]' : 'bg-white'} rounded-lg shadow p-12 text-center`}>
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>No Stories Yet</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Check back later for community stories.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${isDark ? 'bg-[#242526]' : 'bg-white'} rounded-lg shadow hover:shadow-md transition-shadow`}
              >
                {/* Post Header - Like Facebook */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {/* Anonymous Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Anonymous Report
                          </h3>
                          {post.verificationStatus === 'verified' && (
                            <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {formatDate(post.createdAt)}
                          </span>
                          <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>•</span>
                          <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} font-mono text-xs`}>
                            {post.anonymousId}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className={`${isDark ? 'text-gray-400 hover:bg-[#3a3b3c]' : 'text-gray-600 hover:bg-gray-100'} p-2 rounded-full transition`}>
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Category & Priority */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                      {post.incidentType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      post.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      post.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {post.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  {/* Post Title */}
                  <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {post.title}
                  </h2>

                  {/* Post Content */}
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-3 whitespace-pre-line`}>
                    {post.description.length > 400
                      ? `${post.description.substring(0, 400)}... `
                      : post.description}
                    {post.description.length > 400 && (
                      <button className="text-indigo-600 font-medium">See more</button>
                    )}
                  </p>

                  {/* Evidence Indicator */}
                  {(post.evidenceFiles?.length > 0 || post.evidenceUrls?.length > 0) && (
                    <div className={`${isDark ? 'bg-[#3a3b3c] border-[#4e4f50]' : 'bg-gray-50 border-gray-200'} border rounded-lg p-3 mb-3`}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          📎 {(post.evidenceFiles?.length || 0) + (post.evidenceUrls?.length || 0)} evidence file(s) attached
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {post.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{post.location}</span>
                    </div>
                  )}
                </div>

                {/* Reactions Summary - Like Facebook */}
                <div className={`px-4 py-2 border-t border-b ${isDark ? 'border-[#3a3b3c]' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                          <AlertCircle className="w-3 h-3 text-white" />
                        </div>
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Users className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} ml-2`}>
                        {(post.forumReactions.support || 0) + (post.forumReactions.concern || 0) + (post.forumReactions.similar || 0)} reactions
                      </span>
                    </div>
                    <button 
                      onClick={() => toggleComments(post._id)}
                      className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {post.forumComments?.length || 0} comments
                    </button>
                  </div>
                </div>

                {/* Action Buttons - Like Facebook */}
                <div className={`px-4 py-2 border-b ${isDark ? 'border-[#3a3b3c]' : 'border-gray-200'}`}>
                  <div className="grid grid-cols-3 gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReaction(post.anonymousId, 'support')}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg ${isDark ? 'hover:bg-[#3a3b3c] text-gray-400 hover:text-red-500' : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'} transition font-medium`}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Support</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReaction(post.anonymousId, 'concern')}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg ${isDark ? 'hover:bg-[#3a3b3c] text-gray-400 hover:text-orange-500' : 'hover:bg-gray-100 text-gray-600 hover:text-orange-600'} transition font-medium`}
                    >
                      <AlertCircle className="w-5 h-5" />
                      <span>Concern</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleComment(post.anonymousId)}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg ${isDark ? 'hover:bg-[#3a3b3c] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'} transition font-medium`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span>Comment</span>
                    </motion.button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments[post._id] && post.forumComments && post.forumComments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-4 py-3 space-y-3"
                  >
                    {post.forumComments.map((comment) => (
                      <div key={comment.commentId} className="flex gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className={`${isDark ? 'bg-[#3a3b3c]' : 'bg-gray-100'} rounded-2xl px-4 py-2`}>
                            <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {comment.isAnonymous ? "Anonymous" : "Community Member"}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {comment.comment}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 px-4">
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination - Facebook Style */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-2 mt-4"
          >
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 ${isDark ? 'bg-[#242526] text-white hover:bg-[#3a3b3c]' : 'bg-white text-gray-900 hover:bg-gray-50'} rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition`}
            >
              Previous
            </button>
            <span className={`px-4 py-2 ${isDark ? 'bg-indigo-600' : 'bg-indigo-600'} text-white rounded-lg font-semibold`}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 ${isDark ? 'bg-[#242526] text-white hover:bg-[#3a3b3c]' : 'bg-white text-gray-900 hover:bg-gray-50'} rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition`}
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PublicForum;
