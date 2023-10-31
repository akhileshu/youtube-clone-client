import React, { useEffect, useState } from "react";
import { Avatar, Box, Flex, Image, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { format } from "timeago.js";
import { setCurrentVideoNChannel } from "../../features/video/videoSlice";
import { SkeletonLoader } from "./SkletonLoader";
import { idleState, loadingState } from "../../features/user/userSlice";

function SearchedVideoCard({ video }) {
  const toast = useToast();
  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
    });
  };
  const { _id: videoId, userId, imgUrl, title, createdAt, views, desc } = video;
  const [channel, setChannel] = useState(null);
  let loading = false;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //
  const fetchChannel = async () => {
    dispatch(loadingState());

    try {
      const response = await axios.get(`/user/find/${userId}`);
      setChannel(response.data);
    } catch (error) {
      showToast(
        error.response.data.message,
        "error occured while loading channel details - searchedVideos",
        "error"
      );
      // alert(error.response.data.message);
    } finally {
      dispatch(idleState());
    }
  };

  useEffect(() => {
    fetchChannel();
  }, []);
  return (
    <SkeletonLoader>
      <div
        onClick={() => {
          dispatch(setCurrentVideoNChannel({ video, channel }));
          navigate(`/video`);
        }}
        className="SearchVideoCard"
      >
        <img loading="lazy" src={imgUrl} alt="" />
        <div className="right">
          <div className="title">{title}</div>
          <div className="viewsNdate">{`${views} views . ${format(
            createdAt
          )}`}</div>
          <div className="channel">
            <Avatar className="avatar" src={channel?.img} />{" "}
            <span className="name">{channel?.name}</span>
          </div>
          <div className="desc">{desc}</div>
        </div>
      </div>
    </SkeletonLoader>
  );
}

export default SearchedVideoCard;
