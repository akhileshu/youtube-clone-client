/*

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteVideo, fetchOwnVideos, upload, updateVideo } from "./videoApi";

// we are creating a videoslice,state because
// when video uploads video ,render a list of all uploads for loggedin video so he can modify them and immediately update the list without need of reload

const initialState = {
  videoUploads: [], //store uploads of loggedin video
  status: "idle",
  error: null, //if rejected
  message: null, //if fullfilled
};

export const uploadAsync = createAsyncThunk(
  "video/upload",
  async (details, { rejectWithValue }) => {
    try {
      const response = await upload(details);
      return response.data;
    } catch (error) {
      // dont throw error ,return it
      //  provides a default error message in case the message property is not found in the error object.
      // rejectWithValue() is necessary because we want to return the errormessage
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);
export const updateVideoAsync = createAsyncThunk(
  "video/updateVideo",
  async (details, { rejectWithValue }) => {
    try {
      const response = await updateVideo(details);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);
export const fetchOwnVideosAsync = createAsyncThunk(
  "video/fetchOwnVideos",
  // (parameter) _: void
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchOwnVideos();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);

export const deleteVideoAsync = createAsyncThunk(
  "video/deleteVideo",
  async (details, { rejectWithValue }) => {
    try {
      const response = await deleteVideo(details);
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);

export const videoSlice = createSlice({
  name: "video",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    loadingState: (state) => {
      state.status = "loading";
      
    },
    idleState: (state) => {
      state.status = "idle";
      
    },
    videoUploaded: (state, action) => {
      state.videoUploads = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      // uploadAsync
      .addCase(uploadAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.videoUploads.unshift(action.payload);
      })
      .addCase(uploadAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // updateVideoAsync
      .addCase(updateVideoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVideoAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.videoUploads.map((video, index) => {
          return video._id === action.payload._id ? action.payload : video;
        });
      })
      .addCase(updateVideoAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // fetchOwnVideosAsync
      .addCase(fetchOwnVideosAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOwnVideosAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.videoUploads = action.payload;
      })
      .addCase(fetchOwnVideosAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // deleteVideoAsync
      .addCase(deleteVideoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteVideoAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.message = action.payload;
      })
      .addCase(deleteVideoAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const { loadingState, setError, videoUploaded, idleState } = videoSlice.actions;

export const selectVideoState = (state) => state.video;

export default videoSlice.reducer;

*/
