const express = require("express");
const {
  upload,
  profileUpload,
  deleteImage,
  extractPublicId,
} = require("../config/cloudinary.js");
const { auth } = require("../middleware/auth.js");

const router = express.Router();

// Upload post image
router.post("/post-image", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    res.json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
});

// Upload profile image
router.post(
  "/profile-image",
  auth,
  profileUpload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      res.json({
        message: "Profile image uploaded successfully",
        imageUrl: req.file.path,
        publicId: req.file.filename,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error uploading profile image",
          error: error.message,
        });
    }
  }
);

// Delete image
router.delete("/image/:publicId", auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    const result = await deleteImage(decodedPublicId);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
});

// Upload multiple images for post content
router.post(
  "/post-images",
  auth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No image files provided" });
      }

      const uploadedImages = req.files.map((file) => ({
        imageUrl: file.path,
        publicId: file.filename,
      }));

      res.json({
        message: "Images uploaded successfully",
        images: uploadedImages,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error uploading images", error: error.message });
    }
  }
);

module.exports = router;
