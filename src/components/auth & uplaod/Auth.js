import React, { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Switch,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  idleState,
  loadingState,
  selectUserState,
  setError,
  updateLoggedinUser,
} from "../../features/user/userSlice";
// firebase
import { login, signup } from "../../features/user/userApi";
import { uploadFile } from "../../utils/fileUplaod";

function Auth({ children }) {
  const { status, error } = useSelector(selectUserState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loginDetails, setLoginDetails] = useState({});
  const [registerDetails, setRegisterDetails] = useState({});
  //
  const [check, setCheck] = useState(false); //for switch btn
  const dispatch = useDispatch();
  //
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [picUploadPerc, setPicUploadPerc] = useState(0);
  //
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

  // Define a function to update the state
  const updateImgPerc = (value) => {
    setPicUploadPerc(value);
  };

  const updateUrlInRegisterDetails = (link, fieldName) => {
    setRegisterDetails((prev) => {
      return { ...prev, [fieldName]: link };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(URL.createObjectURL(file));
      uploadFile(file, "img", updateImgPerc, updateUrlInRegisterDetails);
    }
  };
  //

  // currently one bug :when login namefield is updated same value is updated in register name field
  const handleLogin = async (e) => {
    //later we can show toast on different events
    e.preventDefault();
    dispatch(loadingState());

    await login(loginDetails)
      .then((response) => {
        showToast("login successful", undefined, "success");
        setLoginDetails({})
        dispatch(updateLoggedinUser(response.data));
        onClose();
      })
      .catch((error) => {
        showToast(error.response.data.message, undefined, "error");

        dispatch(setError(error.response.data.message));
      })
      .finally(() => {
        dispatch(idleState());
      });
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(loadingState());
    await signup(registerDetails)
      .then((response) => {
        setRegisterDetails({})
        onClose();
        // if we dont close and begin login it gives error user not found
        showToast(
          response.data.message,
          "now you can proceed to login!",
          "success"
        );
      })
      .catch((error) => {
        showToast(error.response.data.message, undefined, "error");
        dispatch(setError(error.response.data.message));
      })
      .finally(() => {
        dispatch(idleState());
      });
  };
  const handleLoginInputs = (e) => {
    setLoginDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleRegisterInputs = (e) => {
    setRegisterDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  //
  const uploadedStmt = `Picture uploaded Successfully`;
  const uploadingStmt = `Uploading ${picUploadPerc}%`;

  // password hide and show
  // currently both login and signup using this same state 
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <>
      {/* i will handle all icons at last */}
      <Button onClick={onOpen}>{children}</Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader>Modal Title</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            {/* horizontally centered - mx="auto" */}
            {/* below is our switch for login/signup */}
            <FormControl
              w="50%"
              mx="auto"
              className="authSwitch"
              display="flex"
              alignItems="center"
            >
              <FormLabel htmlFor="auth" mb="0">
                Login
              </FormLabel>
              <Switch
                isChecked={check}
                onChange={() => setCheck(!check)}
                id="auth"
                mr={"3"}
              />
              <FormLabel htmlFor="auth" mb="0">
                Signup
              </FormLabel>
            </FormControl>
            {/* login box */}
            {!check ? (
              <Box p={4}>
                <Heading as="h2" size="lg" mb={4}>
                  Login
                </Heading>
                <form onSubmit={handleLogin}>
                  <Box mb={4}>
                    <label htmlFor="userName">Username</label>

                    <Input
                      value={loginDetails.name}
                      onChange={handleLoginInputs}
                      required
                      name="name"
                      id="userName"
                      type="text"
                    />
                  </Box>
                  <Box mb={4}>
                    <label htmlFor="password">Password</label>
                    <InputGroup size="md">
                      <Input
                        value={loginDetails.password}
                        onChange={handleLoginInputs}
                        required
                        name="password"
                        id="password"
                        type={show ? "text" : "password"}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                  <Button
                    isLoading={status === "loading"}
                    loadingText="Submitting"
                    type="submit"
                    colorScheme="teal"
                  >
                    Login
                  </Button>
                </form>
              </Box>
            ) : (
              <Box p={4}>
                {/* {register box} */}
                <Heading as="h2" size="lg" mb={4}>
                  Register
                </Heading>
                <form onSubmit={handleRegister}>
                  <Box mb={4}>
                    <label htmlFor="userName_R">Username</label>
                    <Input
                      value={registerDetails.name}
                      onChange={handleRegisterInputs}
                      required
                      name="name"
                      id="userName_R"
                      type="text"
                    />
                  </Box>
                  <Box mb={4}>
                    <label htmlFor="email_R">Email</label>
                    <Input
                      value={registerDetails.email}
                      onChange={handleRegisterInputs}
                      required
                      name="email"
                      id="email_R"
                      type="email"
                    />
                  </Box>
                  <Box mb={4}>
                    <label htmlFor="password_R">Password</label>
                    <InputGroup size="md">
                      <Input
                        value={registerDetails.password}
                        onChange={handleRegisterInputs}
                        required
                        name="password"
                        id="password_R"
                        type={show ? "text" : "password"}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                  {picUploadPerc >= 1 && picUploadPerc <= 99
                    ? // Your JSX content to render when picUploadPerc is between 1 and 99
                      uploadingStmt
                    : picUploadPerc === 100
                    ? uploadedStmt
                    : null}

                  <div className="picUpload" display="flex" alignItems="center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      display="none"
                      id="file-upload"
                    />
                    <label className="pic" htmlFor="file-upload">
                      <Avatar size="lg" src={selectedFile} />
                      <span className="fileName">{fileName}</span>
                    </label>
                  </div>
                  <Button
                    isLoading={status === "loading"}
                    loadingText="Submitting"
                    isDisabled={picUploadPerc >= 1 && picUploadPerc <= 99}
                    mt={"1"}
                    type="submit"
                    colorScheme="teal"
                  >
                    Register
                  </Button>
                </form>
              </Box>
            )}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Auth;
