import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedinUser: null,
  status: "idle",
  error: null, //if rejected
  message: null, //if fullfilled
};

/*
export const loginAsync = createAsyncThunk(
  "user/login",
  async (details, { rejectWithValue }) => {
    try {
      const response = await login(details);
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
export const signupAsync = createAsyncThunk(
  "user/signup",
  async (details, { rejectWithValue }) => {
    try {
      const response = await signup(details);
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);

export const likeVideoAsync = createAsyncThunk(
  "user/likeVideo",
  async (details, { rejectWithValue }) => {
    try {
      const response = await likeVideo(details);
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);
export const dislikeVideoAsync = createAsyncThunk(
  "user/dislikeVideo",
  async (details, { rejectWithValue }) => {
    try {
      const response = await dislikeVideo(details);
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);
export const subscribeChannelAsync = createAsyncThunk(
  "user/subscribeChannel",
  async (details, { rejectWithValue }) => {
    try {
      const response = await subscribeChannel(details);
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);
export const unsubscribeChannelAsync = createAsyncThunk(
  "user/unsubscribeChannel",
  async (details, { rejectWithValue }) => {
    try {
      const response = await unsubscribeChannel(details);
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong while login"
      );
    }
  }
);
*/

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateLoggedinUser: (state, action) => {
      state.loggedinUser = action.payload;
    },
    loadingState: (state) => {
      state.status = "loading";
    },

    updateChannelSub: (state, action) => {
      let { subscribedUsers } = state.loggedinUser;
      const channelId = action.payload;
      if (!subscribedUsers.includes(channelId)) {
        subscribedUsers.push(channelId);
        state.loggedinUser = { ...state.loggedinUser, subscribedUsers };
      }
    },
    updateChannelUnsub: (state, action) => {
      let { subscribedUsers } = state.loggedinUser;
      const channelId = action.payload;
      const updatedSubscribedUsers = subscribedUsers.filter(
        (id) => id !== channelId
      );

      state.loggedinUser = {
        ...state.loggedinUser,
        subscribedUsers: updatedSubscribedUsers,
      };
    },
    idleState: (state) => {
      state.status = "idle";
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },

  /*
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.loggedinUser = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // signup
      .addCase(signupAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload;
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // like
      .addCase(likeVideoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(likeVideoAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload;
      })
      .addCase(likeVideoAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // dislike
      .addCase(dislikeVideoAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(dislikeVideoAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload;
      })
      .addCase(dislikeVideoAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // subscribe
      .addCase(subscribeChannelAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(subscribeChannelAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload;
      })
      .addCase(subscribeChannelAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // unsubscribe
      .addCase(unsubscribeChannelAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(unsubscribeChannelAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.message = action.payload;
      })
      .addCase(unsubscribeChannelAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
  */
});

export const {
  updateChannelSub,
  updateChannelUnsub,
  updateLoggedinUser,
  loadingState,
  idleState,
  setError,
} = userSlice.actions;

export const selectUserState = (state) => state.user;

export default userSlice.reducer;
