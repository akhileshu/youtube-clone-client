import { Box, Heading, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  idleState,
  loadingState,
  selectUserState,
  updateLoggedinUser,
} from "../../features/user/userSlice";
import Card from "../videoCards/Card";
import Auth from "../auth & uplaod/Auth";
import NoVideosMessage from "../mixed/NoVideosMessage";
import { SkeletonLoader } from "../videoCards/SkletonLoader";
import NotFoundPage from "../mixed/NotFoundPage";

function MainFeed({ type }) {
  const { loggedinUser, status, error } = useSelector(selectUserState);
  const dispatch = useDispatch();

  const [videos, setVideos] = useState([]);
  const [fetched, setFetched] = useState(false);

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
    // here we should set loading state for videos state but both user and vidoe have same name ,so insted i am doing for userstate
    dispatch(loadingState());
    try {
      const response = await axios.get(`/video/${type}`);
      setFetched(true);
      setVideos(response.data);
    } catch (error) {
      // useful when not logged in for subscriptions videos
      showToast(error.response.data.message, `cant fetch videos`, "error");
    } finally {
      dispatch(idleState());
    }
  };

  const checkUser = async () => {
    dispatch(loadingState());
    await axios
      .get("/auth/check")
      .then((response) => {
        // below toast is running multiple times so avoid now ,we will use redux so that we can show it once per session
        // showToast(
        //   "Welcome back!",
        //   `${response.data.name} , enjoy the best youtube ever!`,
        //   "success"
        // );
        dispatch(updateLoggedinUser(response.data));
      })
      .catch((error) => {
        dispatch(updateLoggedinUser(null));
        // setError-not authenticated
        // showToast(
        //   "Let's Know each other",
        //   `Login and unlock the world of entertainment`,
        //   "info"
        // );
        // dispatch(setError(error.response.data.message));
      })
      .finally(() => {
        dispatch(idleState());
      });
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    // !(type === "sub" && !loggedinUser) &&
    fetchVideos();
  }, [type]);

  if (type === "sub" && !loggedinUser) {
    return (
      <Box
        textAlign="center"
        bg="gray.100"
        p={4}
        borderRadius="md"
        boxShadow="md"
      >
        <Heading as="h1" size="lg" mb={2}>
          You are not logged in
        </Heading>
        <Auth>Login / Signup</Auth>
      </Box>
    );
  }

  // if (loading) return <h1>loading ...</h1>;
  return (
    <div className="mainFeed">
      {fetched && videos.length === 0 ? (
        <NoVideosMessage />
      ) : (
        <>
          {videos.map((video) => {
            return <Card key={video._id} video={video} />;
          })}
        </>
      )}
    </div>
  );
}

export default MainFeed;
