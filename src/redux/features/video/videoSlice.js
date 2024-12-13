// features/video/videoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const videoSlice = createSlice({
  name: "video",
  initialState: {
    videoName: null,
    videoDetails: null, // Additional details if needed
  },
  reducers: {
    setVideoData: (state, action) => {
      state.videoName = action.payload.videoName;
      state.videoDetails = action.payload.videoDetails;
    },
    clearVideoData: (state) => {
      state.videoName = null;
      state.videoDetails = null;
    },
  },
});

export const { setVideoData, clearVideoData } = videoSlice.actions;

export default videoSlice.reducer;
