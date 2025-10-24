import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchUserProfile = createAsyncThunk(
  "users/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const followUser = createAsyncThunk(
  "users/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/users/follow/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/search/${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  searchResults: [],
  loading: false,
  error: null,
  followLoading: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Follow User
      .addCase(followUser.pending, (state) => {
        state.followLoading = true;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followLoading = false;
        // Update the selected user's follower status if it's the same user
        if (state.selectedUser) {
          state.selectedUser.isFollowing = action.payload.isFollowing;
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followLoading = false;
        state.error = action.payload;
      })
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedUser, clearSearchResults, clearError } =
  userSlice.actions;
export default userSlice.reducer;
