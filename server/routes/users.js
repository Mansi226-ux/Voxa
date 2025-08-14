 const express = require("express")
const User = require("../models/User.js")
const Post = require("../models/Post.js")
const { auth } = require("../middleware/auth.js")
//const cloudinary = require("../config/cloudinary.js")

const router = express.Router()

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name avatar")
      .populate("following", "name avatar")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({
      authorId: user._id,
      status: "published",
    })

    res.json({
      ...user.toObject(),
      postsCount,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body

    const user = await User.findById(req.user._id)

    user.name = name || user.name
    user.bio = bio || user.bio
    user.avatar = avatar || user.avatar

    await user.save()

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Follow/Unfollow user
router.post("/follow/:id", auth, async (req, res) => {
  try {
    const targetUserId = req.params.id
    const currentUserId = req.user._id

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const targetUser = await User.findById(targetUserId)
    const currentUser = await User.findById(currentUserId)

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const isFollowing = currentUser.following.includes(targetUserId)

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId)
      targetUser.followers.pull(currentUserId)
    } else {
      // Follow
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
    }

    await currentUser.save()
    await targetUser.save()

    res.json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      isFollowing: !isFollowing,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Search users
router.get("/search/:query", async (req, res) => {
  try {
    const query = req.params.query
    const users = await User.find({
      $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
    })
      .select("-password")
      .limit(10)

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all users (for admin)
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

module.exports = router
