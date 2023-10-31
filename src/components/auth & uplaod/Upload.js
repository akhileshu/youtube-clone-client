import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useDispatch, useSelector } from "react-redux";
import { upload } from "../../features/video/videoApi";
import {
  idleState,
  loadingState,
  selectVideoState,
  setError,
  updateVideoUploads,
} from "../../features/video/videoSlice";
import { uploadFile } from "../../utils/fileUplaod";

function Upload() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, message, status, videoUploads } =
    useSelector(selectVideoState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  //
  const [videoDetails, setVideoDetais] = useState({});
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  //

  const [imgPerc, setImgPerc] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);

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
    setImgPerc(value);
  };
  const updateVideoPerc = (value) => {
    setVideoPerc(value);
  };
  const updateUrlInVideoDetails = (link, fieldName) => {
    setVideoDetais((prev) => {
      return { ...prev, [fieldName]: link };
    });
  };

  const handleInputs = (e) => {
    setVideoDetais((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

    // console.log(videoDetails);
  };
  const handleTags = (e) => {
    // console.log(e.target.value.split(","));
    setVideoDetais((prev) => {
      return { ...prev, tags: e.target.value.split(",") };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loadingState());

    await upload(videoDetails)
      .then((response) => {
        onClose();
        showToast(
          response.data.message,
          "video uploaded successfully",
          "success"
        );

        dispatch(updateVideoUploads(response.data));
      })
      .catch((error) => {
        showToast(
          error.response.data.message,
          "unable to upload video",
          "error"
        );

        dispatch(setError(error.response.data.message));
      })
      .finally(() => {
        dispatch(idleState());
      });
  };

  useEffect(() => {
    img && uploadFile(img, "imgUrl", updateImgPerc, updateUrlInVideoDetails);
  }, [img]);
  useEffect(() => {
    video &&
      uploadFile(video, "videoUrl", updateVideoPerc, updateUrlInVideoDetails);
  }, [video]);

  const imgUploadedStmt = `Image uploaded Successfully`;
  const imgUploadingStmt = `Uploading ${imgPerc}%`;
  const videoUploadedStmt = `File uploaded Successfully`;
  const videoUploadingStmt = `Uploading ${videoPerc}%`;

  return (
    <>
      {/* i will handle all icons at last */}
      {/* redirect to login if not loggedin  */}

      <Button onClick={onOpen}>{<VideoCallIcon />} Upload</Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload a Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="red.400">* All fields are required</Text>
            <Text>Upload button activates after filling all details</Text>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel htmlFor="videoInput">Video:</FormLabel>
                  <Text>
                    {videoPerc >= 1 && videoPerc <= 99
                      ? // Your JSX content to render when videoPerc is between 1 and 99
                        videoUploadingStmt
                      : videoPerc === 100
                      ? videoUploadedStmt
                      : null}
                  </Text>
                  <Input
                    required
                    onChange={(e) => setVideo(e.target.files[0])}
                    type="file"
                    id="videoInput"
                    name="videoInput"
                    accept="video/*"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="titleInput">Title:</FormLabel>
                  <Input
                    required
                    onChange={handleInputs}
                    type="text"
                    id="titleInput"
                    name="title"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="descInput">Description:</FormLabel>
                  <Textarea
                    required
                    onChange={handleInputs}
                    id="descInput"
                    name="desc"
                    cols="40"
                    rows="6"
                  />
                  <FormControl>
                    <FormLabel htmlFor="imageInput">Image:</FormLabel>
                    <Text>
                      {imgPerc >= 1 && imgPerc <= 99
                        ? // Your JSX content to render when imgPerc is between 1 and 99
                          imgUploadingStmt
                        : imgPerc === 100
                        ? imgUploadedStmt
                        : null}
                    </Text>
                    <Input
                      required
                      onChange={(e) => {
                        setImg(e.target.files[0]);
                      }}
                      type="file"
                      id="imageInput"
                      name="imageInput"
                      accept="image/*"
                    />
                  </FormControl>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="tagsInput">Tags:</FormLabel>
                  <Input
                    required
                    onChange={handleTags}
                    id="tagsInput"
                    name="tags"
                    placeholder="Separate tags by comma ( , )"
                  />
                </FormControl>

                <ModalFooter>
                  <Button
                    isLoading={status === "loading"}
                    loadingText="Submitting"
                    isDisabled={
                      !videoDetails?.imgUrl ||
                      !videoDetails?.videoUrl ||
                      (imgPerc >= 1 && imgPerc <= 99) ||
                      (videoPerc >= 1 && videoPerc <= 99)
                    }
                    // below method is bit slow ,causing error so above one
                    // isDisabled={
                    // (imgPerc >= 1 && imgPerc <= 99) ||
                    // (videoPerc >= 1 && videoPerc <= 99)
                    // }
                    type="submit"
                    colorScheme="blue"
                    mr={3}
                  >
                    Upload
                  </Button>
                </ModalFooter>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Upload;
