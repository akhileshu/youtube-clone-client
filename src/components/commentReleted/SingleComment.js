import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import { selectUserState } from "../../features/user/userSlice";
import CollapseBtn from "./CollapseBtn";

function SingleComment({ comment, channelId, setComments }) {
  const [commenter, setCommenter] = useState(null);
  const { userId, videoId, desc, createdAt } = comment;
  const { loggedinUser } = useSelector(selectUserState);
  let loggedInUserId;
  // conditional destructuring
  if (loggedinUser) {
    ({ _id: loggedInUserId } = loggedinUser);
  }
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

  let loading = false;
  const findCommentor = async () => {
    loading = true;

    try {
      const response = await axios.get(`/user/find/${userId}`);
      setCommenter(response.data);
    } catch (error) {
      showToast(
        error.response.data.message,
        "error while loading comment user details",
        "error"
      );
    } finally {
      loading = false;
    }
  };
  useEffect(() => {
    findCommentor();
  }, []);

  const handleCommentDelete = async () => {
    loading = true;
    try {
      await axios.delete(`/comment/${comment._id}`);
      showToast("comment deleted", undefined, "success");
      setComments((allComments) => {
        return allComments.filter((c) => c._id !== comment._id);
      });
    } catch (error) {
      // alert(error.response.data.message);
    } finally {
      loading = false;
    }
  };
  // for alert box
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  return (
    commenter && (
      <div className="singleComment">
        <Avatar src={commenter.img} alt="" />
        <div className="details">
          <div className="userNdate">
            <span className="user">@{commenter.name} </span>
            <span className="date">{format(createdAt)}</span>
          </div>
          <div className="comment">
            <CollapseBtn text={desc} />
          </div>
        </div>

        {(channelId === loggedInUserId || commenter._id === loggedInUserId) && (
          <div className="commentDeleteBtn">
            {/*  logic says if loggedin user is uploader or commentor */}
            <Button onClick={onOpen}>
              <DeleteIcon />
            </Button>
            {/* alert box to confirm */}
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Comment
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        onClose();
                        handleCommentDelete();
                      }}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </div>
        )}
      </div>
    )
  );
}

export default SingleComment;
