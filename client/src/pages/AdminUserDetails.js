"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import api from "../services/api.js"

const AdminUserDetails = () => {
  const [user, setUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userLikes, setUserLikes] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({})

  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useSelector((state) => state.auth)

  // Check if current user is admin
  useEffect(() => {
    if (currentUser?.role !== "Admin") {
      navigate("/dashboard")
    }
  }, [currentUser, navigate])

  useEffect(() => {
    if (userId && currentUser?.role === "Admin") {
      fetchUserDetails()
    }
  }, [userId, currentUser])

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      // Fetch user profile
      const userResponse = await api.get(`/users/${userId}`)
      setUser(userResponse.data)

      // Fetch user posts
      const postsResponse = await api.get(`/posts/user/${userId}`)
      setUserPosts(postsResponse.data)

      // Fetch user likes
      const likesResponse = await api.get(`/admin/user-likes/${userId}`)
      setUserLikes(likesResponse.data || [])

      // Fetch followers and following
      const followersResponse = await api.get(`/admin/user-followers/${userId}`)
      setFollowers(followersResponse.data.followers || [])
      setFollowing(followersResponse.data.following || [])

      // Calculate stats
      const userStats = {
        totalPosts: postsResponse.data.length,
        totalLikes: likesResponse.data?.length || 0,
        totalFollowers: followersResponse.data.followers?.length || 0,
        totalFollowing: followersResponse.data.following?.length || 0,
        totalViews: postsResponse.data.reduce((sum, post) => sum + (post.views || 0), 0),
      }
      setStats(userStats)
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${user.name}"? This action cannot be undone and will delete all their posts, comments, and likes.`,
      )
    ) {
      try {
        await api.delete(`/admin/users/${userId}`)
        navigate("/admin")
      } catch (error) {
        console.error("Error deleting user:", error)
        alert("Error deleting user. Please try again.")
      }
    }
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/admin/posts/${postId}`)
        fetchUserDetails() // Refresh data
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await api.delete(`/comments/${commentId}`)
        fetchUserDetails() // Refresh data
      } catch (error) {
        console.error("Error deleting comment:", error)
      }
    }
  }

  const handleRoleChange = async (newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole })
      setUser({ ...user, role: newRole })
    } catch (error) {
      console.error("Error updating user role:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateContent = (content, maxLength = 100) => {
    const textContent = content.replace(/<[^>]*>/g, "")
    return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "posts", name: "Posts", icon: "📝", count: stats.totalPosts },
    { id: "likes", name: "Likes", icon: "❤️", count: stats.totalLikes },
    { id: "social", name: "Social", icon: "👥" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <Link to="/admin" className="text-indigo-600 hover:text-indigo-800">
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            </div>
            <div className="flex space-x-3">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={user.avatar || "/placeholder.svg?height=120&width=120&query=user avatar"}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p className="text-gray-700 mb-4">{user.bio || "No bio available"}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full ${
                    user.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
                <span className="text-gray-500">Joined {formatDate(user.createdAt)}</span>
                <span className="text-gray-500">Last updated {formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600">{stats.totalPosts}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-red-600">{stats.totalLikes}</div>
            <div className="text-sm text-gray-600">Likes</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-purple-600">{stats.totalFollowers}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-indigo-600">{stats.totalFollowing}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-orange-600">{stats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-300 ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{tab.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Posts */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                    <div className="space-y-3">
                      {userPosts.slice(0, 5).map((post) => (
                        <div key={post._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage || "/placeholder.svg"}
                              alt={post.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/post/${post._id}`}
                              className="font-medium text-gray-900 hover:text-indigo-600 block truncate"
                            >
                              {post.title}
                            </Link>
                            <p className="text-sm text-gray-600">{formatDate(post.createdAt)}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>{post.likesCount || 0} likes</span>
                              <span>{post.views || 0} views</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {userPosts.length === 0 && <p className="text-gray-500 text-center py-4">No posts yet</p>}
                    </div>
                  </div>

                  {/* Recent Comments */}
                  {/* <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Comments</h3>
                    <div className="space-y-3">
                      {userComments.slice(0, 5).map((comment) => (
                        <div key={comment._id} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700 mb-2">{truncateContent(comment.content)}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>On: {comment.postId?.title || "Deleted Post"}</span>
                            <span>{formatDate(comment.createdAt)}</span>
                          </div>
                        </div>
                      ))}
                      {userComments.length === 0 && <p className="text-gray-500 text-center py-4">No comments yet</p>}
                    </div>
                  </div> */}
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">All Posts ({userPosts.length})</h3>
                </div>
                <div className="space-y-4">
                  {userPosts.map((post) => (
                    <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {post.featuredImage && (
                              <img
                                src={post.featuredImage || "/placeholder.svg"}
                                alt={post.title}
                                className="w-16 h-16 rounded object-cover"
                              />
                            )}
                            <div>
                              <Link
                                to={`/post/${post._id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                              >
                                {post.title}
                              </Link>
                              <p className="text-sm text-gray-600">{formatDate(post.createdAt)}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{truncateContent(post.content, 200)}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
                            <span>{post.likesCount || 0} likes</span>
                            <span>{post.commentsCount || 0} comments</span>
                            <span>{post.views || 0} views</span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                post.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {post.status}
                            </span>
                          </div>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {userPosts.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No posts found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comments Tab
            {activeTab === "comments" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">All Comments ({userComments.length})</h3>
                </div>
                <div className="space-y-4">
                  {userComments.map((comment) => (
                    <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-gray-700 mb-3">{comment.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              On post:
                              {comment.postId ? (
                                <Link
                                  to={`/post/${comment.postId._id}`}
                                  className="text-indigo-600 hover:text-indigo-800 ml-1"
                                >
                                  {comment.postId.title}
                                </Link>
                              ) : (
                                <span className="text-red-500 ml-1">Deleted Post</span>
                              )}
                            </span>
                            <span>{formatDate(comment.createdAt)}</span>
                            {comment.parentComment && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Reply</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {userComments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No comments found</p>
                    </div>
                  )}
                </div>
              </div>
            )} */}

            {/* Likes Tab */}
            {activeTab === "likes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Liked Posts ({userLikes.length})</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userLikes.map((like) => (
                    <div key={like._id} className="border border-gray-200 rounded-lg p-4">
                      {like.postId ? (
                        <div>
                          <Link
                            to={`/post/${like.postId._id}`}
                            className="font-semibold text-gray-900 hover:text-indigo-600 block mb-2"
                          >
                            {like.postId.title}
                          </Link>
                          <p className="text-sm text-gray-600 mb-2">
                            By {like.postId.authorId?.name || "Unknown Author"}
                          </p>
                          <p className="text-xs text-gray-500">Liked on {formatDate(like.createdAt)}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-red-500 font-medium">Deleted Post</p>
                          <p className="text-xs text-gray-500">Liked on {formatDate(like.createdAt)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {userLikes.length === 0 && (
                    <div className="col-span-2 text-center py-8">
                      <p className="text-gray-500">No liked posts found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === "social" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Followers */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Followers ({followers.length})</h3>
                  <div className="space-y-3">
                    {followers.map((follower) => (
                      <div key={follower._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={follower.avatar || "/placeholder.svg?height=40&width=40&query=user avatar"}
                          alt={follower.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/admin/user/${follower._id}`}
                            className="font-medium text-gray-900 hover:text-indigo-600"
                          >
                            {follower.name}
                          </Link>
                          <p className="text-sm text-gray-600">{follower.email}</p>
                        </div>
                      </div>
                    ))}
                    {followers.length === 0 && <p className="text-gray-500 text-center py-4">No followers yet</p>}
                  </div>
                </div>

                {/* Following */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Following ({following.length})</h3>
                  <div className="space-y-3">
                    {following.map((followedUser) => (
                      <div key={followedUser._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={followedUser.avatar || "/placeholder.svg?height=40&width=40&query=user avatar"}
                          alt={followedUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/admin/user/${followedUser._id}`}
                            className="font-medium text-gray-900 hover:text-indigo-600"
                          >
                            {followedUser.name}
                          </Link>
                          <p className="text-sm text-gray-600">{followedUser.email}</p>
                        </div>
                      </div>
                    ))}
                    {following.length === 0 && (
                      <p className="text-gray-500 text-center py-4">Not following anyone yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUserDetails
