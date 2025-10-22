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
  Search
} from "lucide-react";
import Swal from "sweetalert2";

const PublicForum = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Public Awareness Forum
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read verified harassment complaints and show your support. Together we build safer workplaces.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Posts</option>
                <option value="recent">Most Recent</option>
                <option value="popular">Most Supported</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold text-gray-800">{posts.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Community Support</p>
                <p className="text-3xl font-bold text-gray-800">
                  {posts.reduce((acc, post) => acc + post.forumReactions.support, 0)}
                </p>
              </div>
              <Heart className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">People Affected</p>
                <p className="text-3xl font-bold text-gray-800">
                  {posts.reduce((acc, post) => acc + post.forumReactions.similar, 0)}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Posts Yet</h3>
            <p className="text-gray-600">Be the first to share your story and help others.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Post Header */}
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          {post.anonymousId}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(post.createdAt)}
                        </span>
                        {post.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {post.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        post.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        post.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {post.priority.toUpperCase()}
                      </span>
                      {post.verificationStatus === 'verified' && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          VERIFIED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.incidentType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">
                      {post.description.length > 300
                        ? `${post.description.substring(0, 300)}...`
                        : post.description}
                    </p>
                  </div>
                </div>

                {/* Reactions */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="flex flex-wrap gap-3">
                    {reactionButtons.map((reaction) => (
                      <motion.button
                        key={reaction.type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReaction(post.anonymousId, reaction.type)}
                        className={`flex items-center gap-2 px-4 py-2 ${reaction.bg} ${reaction.hoverBg} rounded-lg transition-colors`}
                      >
                        <reaction.icon className={`w-5 h-5 ${reaction.color}`} />
                        <span className="font-medium text-gray-700">{reaction.label}</span>
                        <span className={`${reaction.color} font-bold`}>
                          {post.forumReactions[reaction.type] || 0}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => toggleComments(post._id)}
                      className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        {post.forumComments?.length || 0} Comments
                      </span>
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleComment(post.anonymousId)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Add Comment
                    </motion.button>
                  </div>

                  {/* Comments List */}
                  {showComments[post._id] && post.forumComments && post.forumComments.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 mt-4"
                    >
                      {post.forumComments.map((comment) => (
                        <div key={comment.commentId} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Shield className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {comment.isAnonymous ? "Anonymous" : "Community Member"}
                            </span>
                            <span className="text-sm text-gray-400 ml-auto">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center gap-2 mt-8"
          >
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
