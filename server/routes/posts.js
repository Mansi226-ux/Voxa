 const express = require("express")
const Post = require("../models/Post.js")
const Comment = require("../models/Comment.js")
const Like = require("../models/Like.js")
const { auth } = require("../middleware/auth.js")
const cloudinary = require("../config/cloudinary.js")

const router = express.Router()

// Get all posts with pagination and filters
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const { search, category, tag, author } = req.query

    const query = { status: "published" }

    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category
    }

    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] }
    }

    // Filter by author
    if (author) {
      query.authorId = author
    }

    const posts = await Post.find(query)
      .populate("authorId", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Post.countDocuments(query)

    // Get comments and likes count for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ postId: post._id })
        const likesCount = await Like.countDocuments({ postId: post._id })

        return {
          ...post.toObject(),
          commentsCount,
          likesCount,
        }
      }),
    )

    res.json({
      posts: postsWithCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("authorId", "name avatar bio")

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Increment views
    post.views += 1
    await post.save()

    // Get comments and likes count
    const commentsCount = await Comment.countDocuments({ postId: post._id })
    const likesCount = await Like.countDocuments({ postId: post._id })

    res.json({
      ...post.toObject(),
      commentsCount,
      likesCount,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create new post
router.post("/new", auth, async (req, res) => {
  
  
  try {
    const { title, content, tags, category, featuredImage } = req.body ??req.query

    const post = new Post({
      title,
      content,
      authorId: req.user._id,
      tags: tags || [],
      category: category || "General",
      featuredImage: featuredImage || "",
    })

    await post.save()
    await post.populate("authorId", "name avatar")

    res.status(201).json({
      message: "Post created successfully",
      post,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update post
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author
    if (post.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post" })
    }

    const { title, content, tags, category, featuredImage } = req.body

    post.title = title || post.title
    post.content = content || post.content
    post.tags = tags || post.tags
    post.category = category || post.category
    post.featuredImage = featuredImage || post.featuredImage

    await post.save()
    await post.populate("authorId", "name avatar")

    res.json({
      message: "Post updated successfully",
      post,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user is the author or admin
    if (post.authorId.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" })
    }

    // Delete associated comments and likes
    await Comment.deleteMany({ postId: post._id })
    await Like.deleteMany({ postId: post._id })

    await Post.findByIdAndDelete(req.params.id)

    res.json({ message: "Post deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user's posts
router.get("/user/:userId", async (req, res) => {
  try {
    const posts = await Post.find({
      authorId: req.params.userId,
      status: "published",
    })
      .populate("authorId", "name avatar")
      .sort({ createdAt: -1 })

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await Comment.countDocuments({ postId: post._id })
        const likesCount = await Like.countDocuments({ postId: post._id })

        return {
          ...post.toObject(),
          commentsCount,
          likesCount,
        }
      }),
    )

    res.json(postsWithCounts)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
