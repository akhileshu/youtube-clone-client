import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteVideo, fetchOwnVideos, upload, updateVideo } from "./videoApi";

// we are creating a videoslice,state because
// when video uploads video ,render a list of all uploads for loggedin video so he can modify them and immediately update the list without need of reload
// currently loggedin user uploads are store with useState hook

const initialState = {

  searchedVideos:[],//search with term,string
  videoUploads: [], //store uploads of loggedin video
  currentVideo: null,
  currentChannel: null,
  status: "idle",
  error: null, //if rejected
  message: null, //if fullfilled
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    loadingState: (state) => {
      state.status = "loading";
    },
    idleState: (state) => {
      state.status = "idle";
    },
    updateVideoUploads: (state, action) => {
      state.videoUploads.push(action.payload);
    },
    updateVideoLike: (state, action) => {
      const { likes, dislikes } = state.currentVideo; // Create new arrays
      const loggedinUserId = action.payload;
      const alreadyLiked = likes.includes(loggedinUserId);
      const updatedLikes = alreadyLiked ? likes : [...likes, loggedinUserId]; // Create a new likes array
      const updatedDislikes = dislikes.filter((id) => id !== loggedinUserId); // Create a new dislikes array

      state.currentVideo = {
        ...state.currentVideo,
        likes: updatedLikes,
        dislikes: updatedDislikes,
      };
    },

    updateVideoDislike: (state, action) => {
      const { likes, dislikes } = state.currentVideo; // Create new arrays
      const loggedinUserId = action.payload;
      const alreadyDisliked = dislikes.includes(loggedinUserId);
      const updatedLikes = likes.filter((id) => id !== loggedinUserId); // Create a new likes array
      const updatedDislikes = alreadyDisliked
        ? dislikes
        : [...dislikes, loggedinUserId]; // Create a new likes array

      state.currentVideo = {
        ...state.currentVideo,
        likes: updatedLikes,
        dislikes: updatedDislikes,
      };
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
    setCurrentVideoNChannel: (state, action) => {
      const { channel, video } = action.payload;
      state.currentChannel = channel;
      state.currentVideo = video;
    },
    updateVideoViews: (state) => {
      const video = state.currentVideo;
      state.currentVideo = { ...video, views: video.views + 1 };
    },
    setSearchedVideos: (state, action) => {
      state.searchedVideos = action.payload;
    },
    
  },
});

export const {
  loadingState,
  setError,
  updateVideoUploads,
  updateVideoLike,
  updateVideoDislike,
  idleState,
  setCurrentVideoNChannel,
  updateVideoViews,
  setSearchedVideos,
 
} = videoSlice.actions;

export const selectVideoState = (state) => state.video;

export default videoSlice.reducer;
