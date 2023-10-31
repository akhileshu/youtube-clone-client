import { Avatar, SkipNavLink, WrapItem, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { setCurrentVideoNChannel } from "../../features/video/videoSlice";
import {
  idleState,
  loadingState,
  selectUserState,
} from "../../features/user/userSlice";
import { SkeletonLoader } from "./SkletonLoader";

function Card({ video }) {
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
  const { status } = useSelector(selectUserState);
  const videoId = video._id;
  const userId = video.userId;
  const [channel, setChannel] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchChannel = async () => {
    dispatch(loadingState());

    try {
      const response = await axios.get(`/user/find/${userId}`);
      setChannel(response.data);
    } catch (error) {
      showToast(
        error.response.data.message,
        "error occured while loading channel details",
        "error"
      );
    } finally {
      dispatch(idleState());
    }
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  // if (loading) return <h1>loading ...</h1>;
  return (
    <SkeletonLoader>
      <div
        onClick={() => {
          dispatch(setCurrentVideoNChannel({ video, channel }));
          navigate(`/video`);
        }}
        className="card"
      >
        <img loading="lazy" src={video.imgUrl} alt="" />
        <div>
          <div className="channelPic">
            <Avatar loading="lazy" className="avatar" alt="" src={channel?.img} />
            {/* <Avatar
              // its is misbehaving
                className="avatar"
                borderRadius={"full"}
                name={channel.name}
                src={channel.img}
              /> */}
          </div>
          <div className="details">
            <div className="title">{video.title}</div>
            <div className="viewsDate">{`${video.views} Views . ${format(
              video.createAt
            )}`}</div>
          </div>
        </div>
      </div>
    </SkeletonLoader>
  );
}

export default Card;
