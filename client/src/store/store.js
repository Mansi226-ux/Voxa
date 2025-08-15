import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import postReducer from "./slices/postSlice.js";
import userReducer from "./slices/userSlice.js";
import commentReducer from "./slices/commentSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    users: userReducer,
    comments: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
