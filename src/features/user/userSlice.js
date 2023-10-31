import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedinUser: null,
  status: "idle",
  error: null, //if rejected
  message: null, //if fullfilled
};

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
