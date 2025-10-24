import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api.js";
 
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
 
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchStats();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "posts") {
      fetchPosts();
    }
  }, [activeTab, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/admin/users?page=${currentPage}&limit=10`
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/admin/posts?page=${currentPage}&limit=10`
      );
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
        fetchStats();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.delete(`/admin/posts/${postId}`);
        fetchPosts();
        fetchStats();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "users", name: "Users", icon: "👥" },
    { id: "posts", name: "Posts", icon: "📝" },
  ];

  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, posts, and monitor platform activity
          </p>
        </div>

        {/* Tabs */}
        <div className="  rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition duration-300 ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">👥</div>
                      <div>
                        <div className="text-2xl font-bold">
                          {stats.stats?.totalUsers || 0}
                        </div>
                        <div className="text-blue-100">Total Users</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">📝</div>
                      <div>
                        <div className="text-2xl font-bold">
                          {stats.stats?.totalPosts || 0}
                        </div>
                        <div className="text-green-100">Total Posts</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">💬</div>
                      <div>
                        <div className="text-2xl font-bold">
                          {stats.stats?.totalComments || 0}
                        </div>
                        <div className="text-purple-100">Total Comments</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">❤️</div>
                      <div>
                        <div className="text-2xl font-bold">
                          {stats.stats?.totalLikes || 0}
                        </div>
                        <div className="text-red-100">Total Likes</div>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Posts
                    </h3>
                    <div className="space-y-4">
                      {stats.recentActivity?.recentPosts?.map((post) => (
                        <div
                          key={post._id}
                          className="flex items-center space-x-4 p-4 bg-slate-100 rounded-lg"
                        >
                          <img
                            src={
                              post.authorId?.avatar ||
                              "/placeholder.svg?height=40&width=40&query=user avatar"
                            }
                            alt={post.authorId?.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {post.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              by {post.authorId?.name}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(post.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Users
                    </h3>
                    <div className="space-y-4">
                      {stats.recentActivity?.recentUsers?.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center space-x-4 p-4 bg-slate-100 rounded-lg"
                        >
                          <img
                            src={
                              user.avatar ||
                              "/placeholder.svg?height=40&width=40&query=user avatar"
                            }
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {user.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    User Management
                  </h3>
                  <div className="text-sm text-gray-600">
                    Total: {stats.stats?.totalUsers || 0} users
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={
                                    user.avatar ||
                                    "/placeholder.svg?height=40&width=40&query=user avatar"
                                  }
                                  alt={user.name}
                                  className="w-10 h-10 rounded-full mr-4"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                onChange={(e) =>
                                  handleRoleChange(user._id, e.target.value)
                                }
                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(user.createdAt)}
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <Link
                                to={`/admin/user/${user._id}`}
                                className="text-indigo-600 hover:text-indigo-900 transition duration-300"
                              >
                                View Details
                              </Link>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900 transition duration-300 "
                              >
                              🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 hover:bg-slate-100 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </nav>
                  </div>
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Post Management
                  </h3>
                  <div className="text-sm text-gray-600">
                    Total: {stats.stats?.totalPosts || 0} posts
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post._id} className="bg-slate-100 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <img
                                src={
                                  post.authorId?.avatar ||
                                  "/placeholder.svg?height=32&width=32&query=user avatar"
                                }
                                alt={post.authorId?.name}
                                className="w-8 h-8 rounded-full mr-3"
                              />
                              <div>
                                <h4 className="flex font-semibold text-gray-900">
                                  {post.title}
                                </h4>
                                <p className=" flex text-sm text-gray-600">
                                  by {post.authorId?.name}
                                </p>
                              </div>
                            </div>
                            <p className=" flex text-gray-700 mb-3">
                              {post.content
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 200)}
                              ...
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatDate(post.createdAt)}</span>
                              <span>{post.category}</span>
                              <span>{post.views || 0} views</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className=" flex px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition duration-300 ${
                              currentPage === page
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-700 hover:bg-slate-100 border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </nav>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
