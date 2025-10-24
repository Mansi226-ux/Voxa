import api from "./api.js";

class UploadService {
  // Upload post image
  async uploadPostImage(file) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/post-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  }

  // Upload profile image
  async uploadProfileImage(file) {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post("/upload/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload profile image"
      );
    }
  }

  // Upload multiple images for post content
  async uploadPostImages(files) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await api.post("/upload/post-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload images"
      );
    }
  }

  // Delete image
  async deleteImage(publicId) {
    try {
      const encodedPublicId = encodeURIComponent(publicId);
      const response = await api.delete(`/upload/image/${encodedPublicId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete image"
      );
    }
  }

  // Validate image file
  validateImageFile(file, maxSizeMB = 5) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload JPEG, PNG, GIF, or WebP images."
      );
    }

    if (file.size > maxSizeBytes) {
      throw new Error(
        `File size too large. Please upload images smaller than ${maxSizeMB}MB.`
      );
    }

    return true;
  }

  // Extract public ID from Cloudinary URL
  extractPublicId(url) {
    if (!url) return null;

    try {
      // Handle Cloudinary URLs
      if (url.includes("cloudinary.com")) {
        const parts = url.split("/");
        const uploadIndex = parts.findIndex((part) => part === "upload");
        if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
          const pathParts = parts.slice(uploadIndex + 2);
          const fullPath = pathParts.join("/");

          return fullPath.replace(/\.[^/.]+$/, "");
        }
      }

      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      const publicId = filename.split(".")[0];
      return `voxa-blog/${publicId}`;
    } catch (error) {
      console.error("Error extracting public ID:", error);
      return null;
    }
  }

  // Get optimized image URL
  getOptimizedImageUrl(url, options = {}) {
    if (!url || !url.includes("cloudinary.com")) return url;

    const {
      width = "auto",
      height = "auto",
      crop = "fill",
      quality = "auto",
      format = "auto",
    } = options;

    try {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
      }
    } catch (error) {
      console.error("Error optimizing image URL:", error);
    }

    return url;
  }
}

export default new UploadService();
