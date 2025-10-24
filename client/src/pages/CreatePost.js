"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createPost } from "../store/slices/postSlice.js";
import ImageUpload from "../components/ImageUpload.js";
import RichTextEditor from "../components/RichTextEditor.js";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
    featuredImage: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = [
    "General",
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Health",
    "Advanture",
    "Nature",
    "Games",
    "Business",
    "Education",
    "Entertainment",
    "Sports",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      const result = await dispatch(createPost(postData));

      if (result.type === "posts/createPost/fulfilled") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50   py-8">
      <div className="hidden lg:block absolute fixed top-40 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-50 animate-pulse"></div>
      <div className="hidden lg:block absolute fixed top-65 right-25 w-16 h-16 bg-purple-200 rounded-full opacity-50 animate-pulse delay-1000"></div>
      <div className="hidden lg:block absolute fixed bottom-65 left-60 w-12 h-12 bg-pink-200 rounded-full opacity-50 animate-pulse delay-2000"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" rounded-lg  bg-slate-200 shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900">
              Create New Post
            </h1>
            <p className="text-lg text-slate-700 mt-1">
              Share your thoughts with the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Post Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:border-slate-300"
                placeholder="Enter your post title..."
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Featured Image
              </label>
              <ImageUpload
                onImageUpload={(imageUrl, publicId) => {
                  setFormData({
                    ...formData,
                    featuredImage: imageUrl,
                  });
                }}
                currentImage={formData.featuredImage}
                type="post"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:border-slate-300"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-400 rounded-md focus:outline-none bg-slate-100 focus:ring-2 focus:ring-slate-950 focus:border-slate-300"
                  placeholder="react, javascript, web development"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your post content here..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-16">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-2 border border-slate-400 rounded-md text-slate-700 bg-slate-100 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.content}
                className="bg-purple-800 border border-purpule-300 text-white px-4 py-2  rounded-md opacity-80 text-lg font-semibold hover:bg-purple-500 hover:text-black transition duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
