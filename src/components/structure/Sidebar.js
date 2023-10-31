"use client";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation, useParams } from "react-router-dom";

import {
  Avatar,
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import React from "react";

import YouTubeIcon from "@mui/icons-material/YouTube";

import { ChevronDownIcon } from "@chakra-ui/icons";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { FiHome, FiMenu, FiTrendingUp } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectUserState } from "../../features/user/userSlice";
import Auth from "../auth & uplaod/Auth";
import Upload from "../auth & uplaod/Upload";
import LogoutAlert from "../auth & uplaod/LogoutAlert";
const LinkItems = [
  { name: "Home", icon: FiHome, to: "/" },
  { name: "Trending", icon: FiTrendingUp, to: "/trend" },
  { name: "subscriptions", icon: SubscriptionsIcon, to: "/sub" },
];

export default function Sidebar({ handleLogout }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  //

  return (
    <>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Drawer
      
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerContent overflowX={"scroll"} pb={"1rem"}>
          <SidebarContent
            handleLogout={handleLogout}
            onClose={onClose}
          ></SidebarContent>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const SidebarContent = ({ onClose, handleLogout, children, ...rest }) => {
  const { loggedinUser } = useSelector(selectUserState);

  return (
    <Box className="sidebar">
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          <div className="logo">
            <YouTubeIcon className="icon" />
            <span>YouTube</span>
          </div>
        </Text>

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {/*  */}
      {LinkItems.map((item, ind) => {
        const { name, icon, to } = item;
        return (
          <Link onClick={onClose} to={to}>
            {/* here to means where will it take you to ex /,/sub,/trend */}
            <NavItem to={to} icon={icon}>
              {name}
            </NavItem>
          </Link>
        );
      })}

      <Box className="lowerLinks" display={{ base: "flex", md: "none" }}>
        {loggedinUser ? (
          <div className="upload">
            <Upload />
          </div>
        ) : (
          <div className="login">
            <Auth>
              <VideoCallIcon /> Upload
            </Auth>
          </div>
        )}
        {/* below menu for profile */}
        {loggedinUser ? (
          <div className="profile">
            <Menu>
              <MenuButton className="userMenuBtn">
                <div className="user">
                  <Avatar
                    size={"sm"}
                    src={loggedinUser.img} //also shows a default pic
                  />{" "}
                  {/* <img className="userImg" src={loggedinUser.img} alt="" />{" "} */}
                  <span className="tag">
                    Profile <ChevronDownIcon />
                  </span>
                </div>
              </MenuButton>
              <MenuList>
                <Link to={"/myAccount"}>
                  <MenuItem>My Account</MenuItem>
                </Link>
                <Link to={"/myUploads"}>
                  <MenuItem>My Uploads</MenuItem>
                </Link>
                <MenuItem>
                  <LogoutAlert handleLogout={handleLogout}>Logout</LogoutAlert>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        ) : (
          <div className="login">
            <Auth>
              <PersonIcon />
              Profile
            </Auth>
          </div>
        )}
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, to, children, ...rest }) => {
  const currentPath = useLocation().pathname.split("/")[1];
  // console.log(useLocation().pathname.split("/")[1]);
  // useLocation().pathname this will give use the full url we can extract the part which is same as "to" property of LinkItems[]

  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        className={to === `/${currentPath}` ? "bgBlack" : null}
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        {children}
      </Flex>
    </Box>
  );
};
