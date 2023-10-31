import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { idleState, loadingState } from "../../features/video/videoSlice";
import { useDispatch } from "react-redux";
import { deleteVideo } from "../../features/video/videoApi";

function DeleteVideoAlert({video,setVideos}) {
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const{_id:idToDelete}=video
  const cancelRef = React.useRef();
  const dispatch=useDispatch()
 const handleDelete = async (e) => {
   e.preventDefault();
  
   dispatch(loadingState());
   try {
     const response = await deleteVideo(idToDelete);
     //show toast response.data.message
     showToast(response.data.message,undefined,"success")
     setVideos((prev) => {
       return prev.filter((video) => video._id !== idToDelete);
     });
     // also show a toast
     onClose();
   } catch (error) {
    //  alert(error.response.data.message);
    showToast(error.response.data.message,"error occured while deleting comment","error");
   } finally {
     dispatch(idleState());
   }
 };
  return (
    <>
      <Tooltip label="Delete Video">
        <DeleteIcon className="icon" onClick={onOpen} />
      </Tooltip>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Delete Video?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to delete video - {video.title} .
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button onClick={handleDelete} colorScheme="red" ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DeleteVideoAlert;
