import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  idleState,
  loadingState,
  selectUserState,
  updateLoggedinUser,
} from "../../features/user/userSlice";
import { uploadFile } from "../../utils/fileUplaod";
import axios from "axios";
import { updateUserDetails } from "../../features/user/userApi";

function UpdateAccountForm() {
  // it will update account details,name,email,pic
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [picUploadPerc, setPicUploadPerc] = useState(0);
  const { loggedinUser, status } = useSelector(selectUserState);
  const [fileName, setFileName] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  if (!loggedinUser) {
    navigate("/random");
  }
  let name, email, img;

  if (loggedinUser) {
    ({ name, email, img } = loggedinUser);
  }
  const [accountDetails, setAccountDetails] = useState({ name, email, img });
  const [selectedFile, setSelectedFile] = useState(img);

  // Define a function to update the state
  const updateImgPerc = (value) => {
    setPicUploadPerc(value);
  };

  const updateUrlInAccountDetails = (link, fieldName) => {
    setAccountDetails((prev) => {
      return { ...prev, [fieldName]: link };
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(URL.createObjectURL(file));
      uploadFile(file, "img", updateImgPerc, updateUrlInAccountDetails);
    }
  };
  //
  const [fileUploaded, setfileUploaded] = useState(false);

  const uploadedStmt = `Picture uploaded Successfully`;
  const uploadingStmt = `Uploading ${picUploadPerc}%`;
  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    dispatch(loadingState());
    try {
      const response = await updateUserDetails(
        accountDetails,
        loggedinUser._id
      );
      showToast(response.data.message, "account details updated ", "success");
      // show toast
      setfileUploaded(true);
      onClose();
      dispatch(updateLoggedinUser(response.data));
    } catch (error) {
      showToast(
        error.response.data.message,
        "error occured while updating account details",
        "error"
      );
    } finally {
      dispatch(idleState());
    }
  };
  const handleInputs = (e) => {
    setAccountDetails((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    accountDetails && (
      <>
        <Button className="updateAccBtn" onClick={onOpen}>
          Customize channel
        </Button>

        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>update your account details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleUpdateAccount}>
                <Stack spacing={3}>
                  <label>userName</label>
                  <Input
                    value={accountDetails.name}
                    onChange={handleInputs}
                    name="name"
                    variant="filled"
                    placeholder="userName"
                  />
                  <label>email</label>
                  <Input
                    value={accountDetails.email}
                    onChange={handleInputs}
                    type="email"
                    name="email"
                    variant="filled"
                    placeholder="Email"
                  />
                  {!fileUploaded && (
                    <div>
                      {picUploadPerc >= 1 && picUploadPerc <= 99
                        ? // Your JSX content to render when picUploadPerc is between 1 and 99
                          uploadingStmt
                        : picUploadPerc === 100
                        ? uploadedStmt
                        : null}
                    </div>
                  )}

                  {(img === selectedFile || fileUploaded) && (
                    // img is form db and selected file is initially === img but changes as user updates picture
                    // once file is uploded and submited , then again show guide about pic upload
                    <label>click on below icon to update profile Picture</label>
                  )}
                  <div className="picUpload" display="flex" alignItems="center">
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setPicUploadPerc(1);
                        handleFileChange(e);
                      }}
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
                    Update Details
                  </Button>
                </Stack>
              </form>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  );
}

export default UpdateAccountForm;
