import { Avatar, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UpdateAccountForm from "../components/mixed/UpdateAccountForm";
import Navbar from "../components/structure/Navbar";
import { selectUserState } from "../features/user/userSlice";
import {
  idleState,
  loadingState,
} from "../features/video/videoSlice";

function MyAccount() {
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
  const navigate = useNavigate();
  if (!loggedinUser) {
    navigate("/random");
  }
  let name, email, img, subscribers;
  const [videosLength, setVideosLength] = useState(0);
  if (loggedinUser) {
    ({ name, email, img, subscribers } = loggedinUser);
  }
  const dispatch = useDispatch();

  const getNoOfVideos = async () => {
    dispatch(loadingState());
    try {
      const response = await axios.get("/video/noOfVideos");
      setVideosLength(response.data);
    } catch (error) {
      showToast(error.response.data.message, "error occured while fetching video details", "error");
      // alert(error.response.data.message);
    } finally {
      dispatch(idleState());
    }
  };
  const videosLengthStmt = () => {
    if (videosLength > 1) return `${videosLength} Videos`;
    else if (videosLength === 1) return `${videosLength} Video`;
    else return "No Videos";
  };
  const subscribersLengthStmt = () => {
    if (subscribers > 1) return `${subscribers} Subscribers`;
    else if (subscribers === 1) return `${subscribers} Subscriber`;
    else return "No Subscribers";
  };
  useEffect(() => {
    getNoOfVideos();
  }, []);
  return (
    loggedinUser && (
      <>
        <Navbar />
        <div className="myAccount">
          <div className="myDetails">
            <img className="img" loading="lazy" src={img} alt="" />
            <div className="myInfo">
              <div className="name">{name}</div>
              <div className="email">
                @{name.split(" ").join()}1725 &nbsp;&nbsp;
                {subscribersLengthStmt()} &nbsp;&nbsp; {videosLengthStmt()}
              </div>
            </div>
          </div>
          <div className="btns">
            <UpdateAccountForm />
            <Button
              onClick={() => {
                navigate("/myUploads");
              }}
            >
              Manage videos
            </Button>
          </div>
        </div>
      </>
    )
  );
}

export default MyAccount;
