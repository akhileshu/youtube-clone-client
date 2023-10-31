import { Image, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import UpdateVideoForm from "./UpdateVideoForm";
import DeleteVideoAlert from "./DeleteVideoAlert";
import { SkeletonLoader } from "../videoCards/SkletonLoader";
import { setCurrentVideoNChannel } from "../../features/video/videoSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { idleState, loadingState } from "../../features/user/userSlice";
import axios from "axios";

function UpdateDeleteVideo({ video, setVideos }) {
  // currently this card is not taking time to load and show skleton
  // its a type of card
  const {
    _id: videoId,
    userId,
    title,
    desc,
    imgUrl,
    videoUrl,
    views,
    tags,
    likes,
    dislikes,
    createdAt,
  } = video;
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [channel, setChannel] = useState(null);

  const handleImageClick = () => {
    dispatch(setCurrentVideoNChannel({ video, channel }));
    navigate(`/video`);
  };
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
  return (
    <SkeletonLoader>
      
        <div className="UpdateVideoCardBox">
          <div className="imgContainer">
            <Image
              onClick={handleImageClick}
              className="img"
              objectFit="cover"
              height="100%"
              src={imgUrl}
              alt="Thumbnail"
              borderRadius="lg"
            />
            <div className="icons">
              <UpdateVideoForm video={video} setVideos={setVideos} />

              <DeleteVideoAlert video={video} setVideos={setVideos} />
            </div>
          </div>
          <div className="details">
            <Text fontSize={"large"} className="title">
              {title}
            </Text>
            <Text className="desc">{desc}</Text>
            <Text className="viewsDate" color="gray" fontSize="small">
              {`${views} views . ${format(createdAt)}`}
            </Text>
          </div>
        </div>
      
    </SkeletonLoader>
  );
}

export default UpdateDeleteVideo;
