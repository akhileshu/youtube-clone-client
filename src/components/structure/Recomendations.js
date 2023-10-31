import React, { useEffect, useState } from "react";
import RecomendationCard from "../videoCards/RecomendationCard";
import { useDispatch, useSelector } from "react-redux";
import { idleState, loadingState, selectVideoState } from "../../features/video/videoSlice";
import axios from "axios";
import { Box, GridItem, Text, useToast } from "@chakra-ui/react";
import { SkeletonLoader } from "../videoCards/SkletonLoader";

function Recomendations() {
  const [videos, setVideos] = useState([]);
  const { currentVideo } = useSelector(selectVideoState);
const dispatch=useDispatch()
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

  const fetchVideos = async () => {
    dispatch(loadingState())
    try {
      const commaSeparatedString = currentVideo?.tags.join(",");
      const query = `?tags=${commaSeparatedString}`;
      const response = await axios.get(`/video/tags/${query}`);
      //filter out the currentvideo form videos[]
      setVideos(response.data.filter((v) => v._id !== currentVideo._id));
    } catch (error) {
      showToast(
        error.response.data.message,
        "error while fetching recomended videos",
        "error"
      );
    }finally{
      dispatch(idleState())
    }
  };
  useEffect(() => {
    fetchVideos();
  }, [currentVideo._id]);

  return (
    <div className="recomendations">
      {videos.map((video) => {
        return <RecomendationCard key={video._id} video={video} />;
      })}
      {videos.length === 0 && (
        <GridItem colSpan={4}>
          <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
            <Text fontSize="lg" fontWeight="bold">
              No recommendations right now
            </Text>
            <Text fontSize="sm">
              But stay tuned, we're building something amazing!
            </Text>
          </Box>
        </GridItem>
      )}
    </div>
  );
}

export default Recomendations;
