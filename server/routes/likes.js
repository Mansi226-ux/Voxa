 const express = require("express")
const Like = require("../models/Like.js")
const Post = require("../models/Post.js")
const { auth } = require("../middleware/auth.js")

const router = express.Router()

// Toggle like on a post
router.post("/toggle", auth, async (req, res) => {
  try {
    const { postId } = req.body
    const userId = req.user._id

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ postId, userId })

    if (existingLike) {
      // Unlike the post
      await Like.findByIdAndDelete(existingLike._id)
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } })

      res.json({
        message: "Post unliked successfully",
        liked: false,
      })
    } else {
      // Like the post
      const like = new Like({ postId, userId })
      await like.save()
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } })

      res.json({
        message: "Post liked successfully",
        liked: true,
      })
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Check if user liked a post
router.get("/check/:postId", auth, async (req, res) => {
  try {
    const like = await Like.findOne({
      postId: req.params.postId,
      userId: req.user._id,
    })

    res.json({ liked: !!like })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get likes for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.params.postId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })

    res.json(likes)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
