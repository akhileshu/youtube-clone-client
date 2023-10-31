// login,signup,like,dislike,subscribe,unsubscribe

import axios from "axios";

// in request of signup,like,dislike,sub,unsub in response.data we get message property
export const upload = async (videoDetails) => {
  try {
    const response = await axios.post(`/video`, videoDetails);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateVideo = async (videoDetails, videoId) => {
  try {
    const response = await axios.put(`/video/${videoId}`, videoDetails);
    return response;
  } catch (error) {
    throw error;
  }
};
export const deleteVideo = async (videoId) => {
  try {
    const response = await axios.delete(`/video/${videoId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
// this will fetch all videos uploaded by currently loggedIn user
export const fetchOwnVideos = async () => {
  try {
    const response = await axios.get(`/video/own`);
    return response;
  } catch (error) {
    throw error;
  }
};

