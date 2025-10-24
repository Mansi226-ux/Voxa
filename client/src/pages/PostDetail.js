import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  toggleLike,
  deletePost,
  clearCurrentPost,
} from "../store/slices/postSlice.js";
import {
  fetchComments,
  createComment,
  deleteComment,
} from "../store/slices/commentSlice.js";
import api from "../services/api.js";

const PostDetail = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentPost } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
      dispatch(fetchComments(postId));
    }

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, postId]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (user && postId) {
        try {
          const response = await api.get(`/likes/check/${postId}`);
          setIsLiked(response.data.liked);
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };

    checkLikeStatus();
  }, [postId, user]);

  const handleLike = async () => {
    try {
      await dispatch(toggleLike(postId));
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deletePost(postId));
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await dispatch(
        createComment({
          postId,
          content: newComment,
          parentComment: replyTo,
        })
      );
      setNewComment("");
      setReplyTo(null);
      dispatch(fetchComments(postId));
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await dispatch(deleteComment(commentId));
        dispatch(fetchComments(postId));
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isAuthor = currentPost.authorId._id === user?.id;

  return (
    <div className="min-h-screen   py-8">
      <div className="hidden lg:block absolute fixed top-40 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="hidden lg:block absolute fixed top-65 right-25 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
      <div className="hidden lg:block absolute fixed bottom-65 left-60 w-12 h-12 bg-pink-200 rounded-full opacity-50 animate-pulse delay-2000"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Post Content */}
        <article className="bg-slate-200  rounded-lg shadow-md overflow-hidden mb-8">
         
          {currentPost.featuredImage && (
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={currentPost.featuredImage || "/placeholder.svg"}
                alt={currentPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img
                  src={
                    currentPost.authorId?.avatar ||
                    "/placeholder.svg?height=50&width=50&query=user avatar"
                  }
                  alt={currentPost.authorId?.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <Link
                    to={`/profile/${currentPost.authorId?._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                  >
                    {currentPost.authorId?.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentPost.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {isAuthor && (
                <div className="flex space-x-2">
                  <Link
                    to={`/edit-post/${currentPost._id}`}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Post Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {currentPost.title}
            </h1>

            {/* Post Meta */}
            <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {currentPost.category}
              </span>
              <span>{currentPost.views} views</span>
              <span>{formatDate(currentPost.updatedAt)}</span>
            </div>

            {/* Post Content */}
            <div
              className="prose prose-lg max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: currentPost.content }}
            />

            {/* Tags */}
            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {currentPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition duration-300 ${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
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
                  <span>{currentPost.likesCount || 0} likes</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-500">
                  <svg
                    className="w-6 h-6"
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
                  <span>{comments.length} comments</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="  rounded-lg  bg-slate-200 shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex items-start space-x-4">
              <img
                src={
                  user?.avatar ||
                  "/placeholder.svg?height=40&width=40&query=user avatar"
                }
                alt={user?.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    replyTo ? "Write a reply..." : "Write a comment..."
                  }
                className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:border-slate-300"
                  
                  rows="3"
                />
                <div className="flex justify-between items-center mt-2">
                  {replyTo && (
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel reply
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
                  >
                    {loading ? "Posting..." : replyTo ? "Reply" : "Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-4">
                <img
                  src={
                    comment.userId?.avatar ||
                    "/placeholder.svg?height=40&width=40&query=user avatar"
                  }
                  alt={comment.userId?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-slate-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {comment.userId?.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                        {(comment.userId._id === user?.id ||
                          user?.role === "Admin") && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <button
                    onClick={() => setReplyTo(comment._id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 mt-2"
                  >
                    Reply
                  </button>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 mt-4 space-y-4">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="flex items-start space-x-4"
                        >
                          <img
                            src={
                              reply.userId?.avatar ||
                              "/placeholder.svg?height=32&width=32&query=user avatar"
                            }
                            alt={reply.userId?.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="bg-slate-100 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-gray-900 text-sm">
                                  {reply.userId?.name}
                                </h5>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                  {(reply.userId._id === user?.id ||
                                    user?.role === "Admin") && (
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(reply._id)
                                      }
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">💬</div>
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
