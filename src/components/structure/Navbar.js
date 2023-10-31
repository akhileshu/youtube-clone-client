"use client";
import {
  Avatar,
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  idleState,
  loadingState,
  selectUserState,
  setError,
  updateLoggedinUser,
} from "../../features/user/userSlice";
import {
  selectVideoState,
  setSearchedVideos,
  idleState as videoIdleState,
  loadingState as videoLoadingState,
} from "../../features/video/videoSlice";
import SearchInputMobile from "../mixed/SearchInputMobile";
import Sidebar from "./Sidebar";

import Auth from "../auth & uplaod/Auth";
import Upload from "../auth & uplaod/Upload";

import axios from "axios";
import { useEffect, useState } from "react";
import { logout } from "../../features/user/userApi";
import LogoutAlert from "../auth & uplaod/LogoutAlert";

// const Links = ["Dashboard", "Projects", "Team"];

const NavLink = ({ children }) => {
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function Navbar({ children, searchTerm: sTerm }) {
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
  // maybe we can get searchterm
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loggedinUser } = useSelector(selectUserState);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (sTerm) setSearchTerm(sTerm);
  }, []);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(loadingState());
    try {
      logout()
        .then((response) => {
          dispatch(idleState());
          showToast(response.data.message, undefined, "success");
          return dispatch(updateLoggedinUser(null));
        })
        .catch((error) => {
          dispatch(idleState());
          showToast(
            error.response.data.message,
            "error occured while logout",
            "error"
          );
          dispatch(setError(error.response.data.message));
        });
    } catch (error) {
      // generally it wont run
      dispatch(idleState());
      // alert("something went wrong ", error.message);
      dispatch(setError(error.message));
    }
  };

  const hadlevideosSearch = async (e) => {
    e.preventDefault();
    // console.log(searchTerm);
    dispatch(videoLoadingState());
    const query = `?q=${searchTerm}`;
    try {
      const response = await axios.get(`/video/search/${query}`);
      dispatch(setSearchedVideos(response.data));
      if (response.data.length === 0) {
        showToast("No Results", "found no results with this search", "warning");
      } else {
        showToast(
          "search successful",
          `found ${response.data.length} video(s)`,
          "success"
        );
      }
      navigate(`/search/${searchTerm}`);
    } catch (error) {
      showToast(
        error.response.data.message,
        "error while loading searched Videos",
        "error"
      );
    } finally {
      dispatch(videoIdleState());
    }
  };

  return (
    <>
      <Box
        className="navbar"
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
      >
        <div className="navContent">
          <div className="left">
            <Sidebar handleLogout={handleLogout}></Sidebar>
            <div className="logo">
              <YouTubeIcon className="icon" />
              <span>YouTube</span>
            </div>
          </div>

          <div className="middle">
            {/* show only on big  screen */}
            <InputGroup display={{ base: "none", md: "flex" }} size="md">
              <form onSubmit={hadlevideosSearch}>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  pr="4.5rem"
                  placeholder="Search Videos"
                />
                <InputRightElement width="4.5rem">
                  <Button
                    isDisabled={!searchTerm}
                    type="submit"
                    h="1.75rem"
                    size="sm"
                  >
                    go
                  </Button>
                </InputRightElement>
              </form>
            </InputGroup>
          </div>
          <Box display={{ base: "none", md: "flex" }} className="right">
            {/* show only on big  screen */}
            {loggedinUser ? (
              <Upload />
            ) : (
              <Auth>
                <VideoCallIcon /> Upload
              </Auth>
            )}

            {loggedinUser ? (
              <>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={loggedinUser.img} //also shows a default pic
                    />
                  </MenuButton>
                  <MenuList>
                    <Link to={"/myAccount"}>
                      <MenuItem>My Account</MenuItem>
                    </Link>
                    <Link to={"/myUploads"}>
                      <MenuItem>My Uploads</MenuItem>
                    </Link>
                    <MenuItem>
                      <LogoutAlert handleLogout={handleLogout}>
                        Logout
                      </LogoutAlert>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Auth>Login</Auth>
              </>
            )}
          </Box>
          <Box
            alignItems={"center"}
            display={{ base: "flex", md: "none" }}
            className="right"
          >
            {/* show only on small screen */}
            {/* <SearchIcon/> */}
            <SearchInputMobile
              hadlevideosSearch={hadlevideosSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Box>
        </div>
      </Box>
    </>
  );
}
