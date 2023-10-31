// A mock function to mimic making an async request for data
// login,signup,like,dislike,subscribe,unsubscribe

import axios from "axios";

// in request of signup,like,dislike,sub,unsub in response.data we get message property
export const login = async (details) => {
  try {
    const response = await axios.post(`/auth/signin`, details);
    return response;
  } catch (error) {
    throw error;
  }
};
export const logout = async () => {
  try {
    const response = await axios.get(`/auth/logout`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const signup = async (details) => {
  try {
    const response = await axios.post(`/auth/signup`, details);
    return response;
  } catch (error) {
    throw error;
  }
};
export const likeVideo = async (videoId) => {
  try {
    const response = await axios.put(`/user/like/${videoId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const dislikeVideo = async (videoId) => {
  try {
    const response = await axios.put(`/user/dislike/${videoId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const subscribeChannel = async (channelId) => {
  // remainder:channelId and userId both are same
  try {
    const response = await axios.put(`/user/sub/${channelId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const unsubscribeChannel = async (channelId) => {
  try {
    const response = await axios.put(`/user/unsub/${channelId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const updateUserDetails = async (data,userId) => {
  try {
    const response = await axios.put(`/user/${userId}`,data);
    return response;
  } catch (error) {
    throw error;
  }
};
