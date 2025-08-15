"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile, followUser } from "../store/slices/userSlice.js";
import { updateProfile } from "../store/slices/authSlice.js";
import ImageUpload from "../components/ImageUpload.js";
import api from "../services/api.js";

const ProfilePage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  const { userId } = useParams();
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { selectedUser, loading: userLoading } = useSelector(
    (state) => state.users
  );

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      fetchUserPosts();
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (selectedUser && isOwnProfile) {
      setEditForm({
        name: selectedUser.name || "",
        bio: selectedUser.bio || "",
        avatar: selectedUser.avatar || "",
      });
    }
  }, [selectedUser, isOwnProfile]);

  const fetchUserPosts = async () => {
    try {
      const response = await api.get(`/posts/user/${userId}`);
      setUserPosts(response.data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const handleFollow = async () => {
    try {
      await dispatch(followUser(userId));
      dispatch(fetchUserProfile(userId));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(updateProfile(editForm));
      setIsEditing(false);
      dispatch(fetchUserProfile(userId));
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (imageUrl, publicId) => {
    setEditForm({
      ...editForm,
      avatar: imageUrl,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="min-h-screen   flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User not found
          </h2>
          <Link
            to="/dashboard"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen   py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="  rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              {isOwnProfile && isEditing ? (
                <div className="w-32 h-32">
                  <ImageUpload
                    onImageUpload={handleAvatarUpload}
                    currentImage={editForm.avatar}
                    type="profile"
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <img
                  src={
                    selectedUser.avatar ||
                    "/placeholder.svg?height=150&width=150&query=user avatar"
                  }
                  alt={selectedUser.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Tell us about yourself..."
                      rows="3"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-800 border border-purpule-300 text-white px-4 py-2 rounded-full opacity-80 text-lg font-semibold hover:bg-purple-500 hover:text-black transition duration-300 shadow-lg hover:shadow-xl"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-purple-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedUser.name}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    {selectedUser.bio || "No bio available"}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-center md:justify-start space-x-8 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedUser.postsCount || 0}
                      </div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedUser.followers?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {selectedUser.following?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Following</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center md:justify-start space-x-4">
                    {isOwnProfile ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-purple-800 border border-purpule-300 text-white px-4 py-2 rounded-full opacity-80 text-lg font-semibold hover:bg-purple-500 hover:text-black transition duration-300 shadow-lg hover:shadow-xl"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-2 rounded-md transition duration-300 ${
                          selectedUser.followers?.includes(currentUser?.id)
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-purple-800 text-white hover:bg-purple-900"
                        }`}
                      >
                        {selectedUser.followers?.includes(currentUser?.id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div className="  rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isOwnProfile ? "Your Posts" : `${selectedUser.name}'s Posts`} (
            {userPosts.length})
          </h2>

          {userPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 mb-6">
                {isOwnProfile
                  ? "Start sharing your thoughts with the community!"
                  : "This user hasn't posted anything yet."}
              </p>
              {isOwnProfile && (
                <Link
                  to="/create-post"
                  className="bg-purple-800 border border-purpule-300 text-white px-8 py-4 rounded-full opacity-80 text-lg font-semibold hover:bg-purple-500 hover:text-black transition duration-300 shadow-lg hover:shadow-xl"
                >
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="border   rounded-lg p-4 hover:shadow-md transition duration-300"
                >
                  {post.featuredImage && (
                    <div className="h-32 overflow-hidden rounded-md mb-4">
                      <img
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <Link to={`/post/${post._id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition duration-300">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                      ...
                    </p>
                  </Link>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
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

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
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
                        {post.likesCount || 0}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {post.commentsCount || 0}
                      </span>
                      <span className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {post.views || 0}
                      </span>
                    </div>
                  </div>

                  {/* Edit/Delete buttons for own posts */}
                  {isOwnProfile && (
                    <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                      <Link
                        to={`/edit-post/${post._id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this post?"
                            )
                          ) {
                            try {
                              await api.delete(`/posts/${post._id}`);
                              fetchUserPosts(); // Refresh posts
                            } catch (error) {
                              console.error("Error deleting post:", error);
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
