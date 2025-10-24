"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPosts, toggleLike } from "../store/slices/postSlice.js";
import PostCard from "../components/PostCard.js";
import SearchAndFilter from "../components/SearchAndFilter.js";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    page: 1,
  });

  const dispatch = useDispatch();
  const { posts, loading, totalPages, currentPage } = useSelector(
    (state) => state.posts
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPosts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleLike = (postId) => {
    dispatch(toggleLike(postId));
  };

  return (
    <div className="min-h-screen  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Discover amazing stories from our community
              </p>
            </div>
            <Link
              to="/create-post"
              className="bg-purple-800 border border-purpule-300 text-white px-8 py-2 rounded-full opacity-80 text-lg font-semibold hover:bg-purple-500 hover:text-black transition duration-300 shadow-lg hover:shadow-xl"
            >
              Create New Post
            </Link>
          </div>
        </div>

        
        <div className="mb-8">
          <SearchAndFilter onFilterChange={handleFilterChange} />
        </div>

        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.category !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to create a post!"}
            </p>
            <Link
              to="/create-post"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition duration-300"
            >
              Create Your First Post
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={handleLike}
                  currentUserId={user?.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                          currentPage === page
                            ? "bg-purple-600 text-white"
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
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
