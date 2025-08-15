"use client";

import { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
//import uploadService from "../services/uploadService.js";

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your content here...",
}) => {
  const quillRef = useRef(null);

  // Custom image handler for the editor
  // const imageHandler = () => {
  //   const input = document.createElement("input");
  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.click();

  //   input.onchange = async () => {
  //     const file = input.files[0];
  //     if (file) {
  //       try {
  //         // Validate file
  //         uploadService.validateImageFile(file);

  //         // Show loading state
  //         const quill = quillRef.current.getEditor();
  //         const range = quill.getSelection(true);
  //         quill.insertText(range.index, "Uploading image...", "user");

  //         // Upload image
  //         const result = await uploadService.uploadPostImage(file);

  //         // Remove loading text and insert image
  //         quill.deleteText(range.index, "Uploading image...".length);
  //         quill.insertEmbed(range.index, "image", result.imageUrl);
  //         quill.setSelection(range.index + 1);
  //       } catch (error) {
  //         alert(error.message);
  //         // Remove loading text if upload failed
  //         const quill = quillRef.current.getEditor();
  //         const range = quill.getSelection();
  //         if (range) {
  //           quill.deleteText(range.index, "Uploading image...".length);
  //         }
  //       }
  //     }
  //   };
  // };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["blockquote", "code-block"],
        ["clean"],
      ],
      // handlers: {
      //   image: imageHandler,
      // },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ];

  return (
    <div className=" ">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="h-64"
      />
    </div>
  );
};

export default RichTextEditor;
