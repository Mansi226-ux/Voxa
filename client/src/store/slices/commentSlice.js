import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

// Async thunks
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (commentData, { rejectWithValue }) => {
    try {
      const response = await api.post("/comments", commentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  comments: [],
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.createLoading = false;
        state.comments.unshift(action.payload.comment);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // Update Comment
      .addCase(updateComment.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.comments.findIndex(
          (comment) => comment._id === action.payload.comment._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload.comment;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearComments, clearError } = commentSlice.actions;
export default commentSlice.reducer;
