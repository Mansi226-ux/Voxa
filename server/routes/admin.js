const express = require("express");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const Comment = require("../models/Comment.js");
const Like = require("../models/Like.js");
const { adminAuth } = require("../middleware/auth.js");

const router = express.Router();

// Get dashboard statistics
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Like.countDocuments();

    // Get recent activity
    const recentPosts = await Post.find()
      .populate("authorId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalPosts,
        totalComments,
        totalLikes,
      },
      recentActivity: {
        recentPosts,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all users with pagination
router.get("/users", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all posts with pagination
router.get("/posts", adminAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("authorId", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user likes
router.get("/user-likes/:userId", adminAuth, async (req, res) => {
  try {
    const likes = await Like.find({ userId: req.params.userId })
      .populate({
        path: "postId",
        select: "title authorId",
        populate: {
          path: "authorId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user followers and following
router.get("/user-followers/:userId", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("followers", "name email avatar")
      .populate("following", "name email avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Don't allow admin to delete themselves
    if (userId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    // Delete user's posts, comments, and likes
    await Post.deleteMany({ authorId: userId });
    await Comment.deleteMany({ userId: userId });
    await Like.deleteMany({ userId: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete post
router.delete("/posts/:id", adminAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    // Delete associated comments and likes
    await Comment.deleteMany({ postId: postId });
    await Like.deleteMany({ postId: postId });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user role
router.put("/users/:id/role", adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!["User", "Admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
