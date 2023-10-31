import {
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
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { idleState, loadingState } from "../../features/video/videoSlice";
import { updateVideo } from "../../features/video/videoApi";

function UpdateVideoForm({ video, setVideos }) {
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
  // currently not enabling the update of video and thumbnail/image
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const [videoDetails, setVideoDetais] = useState({title,desc,tags});
  const dispatch = useDispatch();
  const handleInputs = (e) => {
    setVideoDetais((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });

    // console.log(videoDetails);
  };
  const handleTags = (e) => {
    setVideoDetais((prev) => {
      return { ...prev, tags: e.target.value.split(",") };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(videoDetails);
    dispatch(loadingState());
    try {
      const response = await updateVideo({
        ...videoDetails,
        tags: JSON.stringify(videoDetails.tags),
      },videoId);
      showToast(response.data.message,"video updated successfully","success")
      const updatedVideo = response.data;
      setVideos((prev) => {
        return prev.map((video) =>
          video._id === updatedVideo._id ? updatedVideo : video
        );
      });
      // also show a toast
      onClose();
    } catch (error) {
      showToast(error.response.data.message, "error occured while updating video", "error");
    } finally {
      dispatch(idleState());
    }
  };
  return (
    <>
      <Tooltip label="Edit Video">
        <EditIcon className="icon" onClick={onOpen} />
      </Tooltip>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>update Video details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={3}>
              <label>title</label>
              <Input
                name="title"
                onChange={handleInputs}
                value={videoDetails.title}
                variant="filled"
                placeholder="title"
              />
              <label>description</label>
              <Textarea
                name="desc"
                value={videoDetails.desc}
                rows={"5"}
                variant="filled"
                placeholder="description"
                onChange={handleInputs}
              />
              <label>Tags</label>
              <Input
                name="tags"
                onChange={handleTags}
                value={videoDetails.tags.join(",")}
                variant="filled"
                placeholder="seperate tags by , (comma)"
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue" mr={3}>
              update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateVideoForm;
