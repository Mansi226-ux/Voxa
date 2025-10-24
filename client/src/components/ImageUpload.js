"use client";

import { useState, useRef } from "react";
import uploadService from "../services/uploadService.js";

const ImageUpload = ({
  onImageUpload,
  currentImage,
  type = "post",
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    try {
      uploadService.validateImageFile(file);

      setUploading(true);

      let result;
      if (type === "profile") {
        result = await uploadService.uploadProfileImage(file);
      } else {
        result = await uploadService.uploadPostImage(file);
      }

      onImageUpload(result.imageUrl, result.publicId);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = async () => {
    if (currentImage && onImageUpload) {
      try {
        const publicId = uploadService.extractPublicId(currentImage);
        if (publicId) {
          await uploadService.deleteImage(publicId);
        }
        onImageUpload("", "");
      } catch (error) {
        console.error("Error removing image:", error);

        onImageUpload("", "");
      }
    }
  };

  const isProfileType = type === "profile";

  return (
    <div className={`relative ${className}`}>
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage || "/placeholder.svg"}
            alt="Uploaded"
            className={`w-full object-cover ${
              isProfileType
                ? "h-32 w-32 rounded-full border-4 border-white shadow-lg"
                : "h-48 rounded-lg"
            }`}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300 z-10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className={`border-3 border-dashed rounded-lg p-6 text-center cursor-pointer transition duration-300 ${
            isProfileType
              ? "h-32 w-32 rounded-full flex flex-col items-center justify-center p-2"
              : ""
          } ${
            dragOver
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-gray-400 bg-slate-100"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
              <p
                className={`text-sm text-gray-600 ${
                  isProfileType ? "text-xs" : ""
                }`}
              >
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className={`text-gray-400 mb-2 ${
                  isProfileType ? "w-6 h-6" : "w-12 h-12 mb-4"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p
                className={`text-gray-600 mb-1 ${
                  isProfileType ? "text-xs" : "text-sm mb-2"
                }`}
              >
                {isProfileType ? "Upload photo" : "Upload featured image"}
              </p>
              {!isProfileType && (
                <>
                  <p className="text-xs text-gray-500">
                    Drag and drop or click to select
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPEG, PNG, GIF, WebP (max 5MB)
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
