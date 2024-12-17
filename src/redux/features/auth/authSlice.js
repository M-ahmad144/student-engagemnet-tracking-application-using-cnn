import Cookies from "js-cookie";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const authMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === setCredentials.type) {
    const userInfo = action.payload;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    Cookies.set("token", userInfo.token, {
      secure: true,
      sameSite: "strict",
      expires: 1,
    }); // 1 day
  } else if (action.type === logout.type) {
    localStorage.removeItem("userInfo");
    Cookies.remove("token");
  }
  return next(action);
};

export default authSlice.reducer;
