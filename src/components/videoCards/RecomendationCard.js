import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { setCurrentVideoNChannel } from "../../features/video/videoSlice";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { SkeletonLoader } from "./SkletonLoader";
import { idleState, loadingState } from "../../features/user/userSlice";

function RecomendationCard({ video }) {
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { imgUrl, views, title, desc, userId, createdAt } = video;
  const [channel, setChannel] = useState(null);
  let loading = false;
  const fetchChannel = async () => {
dispatch(loadingState())

    try {
      const response = await axios.get(`/user/find/${userId}`);
      setChannel(response.data);
    } catch (error) {
      // alert(error.response.data.message);
      showToast(
        error.response.data.message,
        "error occured while loading channel details - recommendation",
        "error"
      );
    } finally {
      dispatch(idleState())
    }
  };

  useEffect(() => {
    fetchChannel();
  }, []);
  return (
    <SkeletonLoader>
      <>
        <div
          onClick={() => {
            dispatch(setCurrentVideoNChannel({ video, channel }));
            navigate(`/video`);
          }}
          className="recomendationCard"
        >
          <img loading="lazy" src={imgUrl} alt="" />
          <div>
            <div className="details">
              <div className="title">{title}</div>
              <div className="channelName">{channel?.name}</div>
              <div className="viewsDate">{`${views} views . ${format(
                createdAt
              )}`}</div>
            </div>
          </div>
        </div>
      </>
    </SkeletonLoader>
  );
}

export default RecomendationCard;
