 const express = require("express")
const Comment = require("../models/Comment.js")
const { auth } = require("../middleware/auth.js")

const router = express.Router()

// Get comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
      parentComment: null,
    })
      .populate("userId", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "name avatar",
        },
      })
      .sort({ createdAt: -1 })

    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create comment
router.post("/", auth, async (req, res) => {
  try {
    const { postId, content, parentComment } = req.body

    const comment = new Comment({
      postId,
      userId: req.user._id,
      content,
      parentComment: parentComment || null,
    })

    await comment.save()
    await comment.populate("userId", "name avatar")

    // If it's a reply, add to parent's replies array
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, { $push: { replies: comment._id } })
    }

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update comment
router.put("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Check if user is the author
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this comment" })
    }

    comment.content = req.body.content || comment.content
    await comment.save()
    await comment.populate("userId", "name avatar")

    res.json({
      message: "Comment updated successfully",
      comment,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete comment
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Check if user is the author or admin
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this comment" })
    }

    // Delete replies if any
    await Comment.deleteMany({ parentComment: comment._id })

    // Remove from parent's replies array if it's a reply
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, { $pull: { replies: comment._id } })
    }

    await Comment.findByIdAndDelete(req.params.id)

    res.json({ message: "Comment deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
