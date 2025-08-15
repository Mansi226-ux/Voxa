import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api.js";

const PostCard = ({ post, onLike, currentUserId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user) {
        try {
          const response = await api.get(`/likes/check/${post._id}`);
          setIsLiked(response.data.liked);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };

    checkLikeStatus();
  }, [post._id, user]);

  const handleLike = async () => {
    try {
      await onLike(post._id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  return (
    <div className=" rounded-lg   hover:shadow-lg transition duration-300 overflow-hidden">
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center mb-4">
          <img
            src={
              post.authorId?.avatar ||
              "/placeholder.svg?height=40&width=40&query=user avatar"
            }
            alt={post.authorId?.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <Link
              to={`/profile/${post.authorId?._id}`}
              className="text-sm font-medium text-gray-900 hover:text-indigo-600"
            >
              {post.authorId?.name}
            </Link>
            <p className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="h-48 overflow-hidden">
            <img
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        )}

        {/* Post Content */}
        <Link to={`/post/${post._id}`} className="block mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition duration-300">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {truncateContent(post.content)}
          </p>
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition duration-300 ${
                isLiked
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              <svg
                className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm">{post.likesCount || 0}</span>
            </button>

            <Link
              to={`/post/${post._id}`}
              className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm">{post.commentsCount || 0}</span>
            </Link>

            <div className="flex items-center space-x-1 text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-sm">{post.views || 0}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">{post.category}</div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
