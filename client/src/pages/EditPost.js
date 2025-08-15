import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  updatePost,
  clearCurrentPost,
} from "../store/slices/postSlice.js";
import ImageUpload from "../components/ImageUpload.js";
import RichTextEditor from "../components/RichTextEditor.js";

const EditPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    tags: "",
    featuredImage: "",
  });
  const [loading, setLoading] = useState(false);

  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const categories = [
    "General",
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Health",
    "Business",
    "Education",
    "Entertainment",
    "Sports",
  ];

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    }

    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, postId]);

  useEffect(() => {
    if (currentPost) {
     
      if (currentPost.authorId._id !== user?.id) {
        navigate("/dashboard");
        return;
      }

      setFormData({
        title: currentPost.title || "",
        content: currentPost.content || "",
        category: currentPost.category || "General",
        tags: currentPost.tags ? currentPost.tags.join(", ") : "",
        featuredImage: currentPost.featuredImage || "",
      });
    }
  }, [currentPost, user, navigate]);

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

      const result = await dispatch(updatePost({ postId, postData }));

      if (result.type === "posts/updatePost/fulfilled") {
        navigate(`/post/${postId}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentPost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-600 mt-2">Update your post content</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your post title..."
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Category and Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="react, javascript, web development"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Write your post content here..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-16">
              <button
                type="button"
                onClick={() => navigate(`/post/${postId}`)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.content}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                {loading ? "Updating..." : "Update Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
