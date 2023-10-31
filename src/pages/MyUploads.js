import { Box, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/structure/Navbar";
import UpdateDeleteVideo from "../components/video (update,delete)/UpdateDeleteVideo";
import { selectUserState } from "../features/user/userSlice";
import { fetchOwnVideos } from "../features/video/videoApi";
import { idleState, loadingState } from "../features/video/videoSlice";

function MyUploads() {
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
  // user can see this only if he is logged in
  const { loggedinUser } = useSelector(selectUserState);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  if (!loggedinUser) {
    navigate("/random");
  }
  const [fetched, setFetched] = useState(false);


  const fetchVideos = async () => {
    dispatch(loadingState());
    await fetchOwnVideos()
      .then((response) => {
        if (response.data.length === 0) {
          showToast(
            "No videos found",
            "seems like you didn't uploaded any video yet,please upload videos",
            "warning"
          );
        }
        setVideos(response.data);
        setFetched(true);
      })
      .catch((error) => {
        showToast(
          error.response.data.message,
          "error occured while fetching your uploaded videos",
          "error"
        );
      })
      .finally(() => {
        dispatch(idleState());
      });
  };
  useEffect(() => {
    fetchVideos();
  }, []);
  return (
    <>
      <div className="updateVideosPage">
        <Navbar />
        {fetched && videos.length === 0 ? (
          <Box
            boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
            textAlign="center"
            m={5}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.200"
          >
            <Text>
              No videos found . Please upload videos to start your journey on
              most loved video sharing platform
            </Text>
          </Box>
        ) : (
          <>
            {videos.map((video) => (
              <UpdateDeleteVideo
                key={video._id}
                video={video}
                setVideos={setVideos}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default MyUploads;
