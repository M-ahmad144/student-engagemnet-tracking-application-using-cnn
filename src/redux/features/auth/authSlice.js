import { createSlice } from "@reduxjs/toolkit";

// Helper function to check if token has expired
const isTokenExpired = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  if (!expirationTime) return true;
  return new Date().getTime() > expirationTime;
};

// Check if there is valid user info (not expired)
const initialState = {
  userInfo:
    localStorage.getItem("userInfo") && !isTokenExpired()
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear(); // Clears both userInfo and expirationTime
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
