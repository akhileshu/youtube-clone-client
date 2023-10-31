import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  HStack,
  Tag,
  TagLabel,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
//
import SendIcon from "@mui/icons-material/Send";

// outline
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
// solid
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { format } from "timeago.js";
import {
  dislikeVideo,
  likeVideo,
  subscribeChannel,
  unsubscribeChannel,
} from "../../features/user/userApi";
import {
  idleState,
  loadingState,
  selectUserState,
  updateChannelSub,
  updateChannelUnsub,
} from "../../features/user/userSlice";
import {
  selectVideoState,
  updateVideoDislike,
  updateVideoLike,
  updateVideoViews,
} from "../../features/video/videoSlice";
import SingleComment from "../commentReleted/SingleComment";

function VideoPlayer() {
  let loading = false;
  const { currentChannel: channel, currentVideo: video } =
    useSelector(selectVideoState);
  const { loggedinUser } = useSelector(selectUserState);
  const dispatch = useDispatch();
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
  const { name, img, subscribers, _id: channelId } = channel;

  let subscribedUsers, loggedinUserId;
  if (loggedinUser) {
    // destructure only if not null
    ({ subscribedUsers, _id: loggedinUserId } = loggedinUser);
  }
  // subscribers - no of subs for this channel
  // subscribedUsers - [] to what channels the createor is subscribed
  // logic- if in my subscribedUsers[] ,the channelid is present means i subscribed it

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState([]);
  // console.log({subscribedUsers,subscribers,loggedinUserId,channelId,likes,dislikes})
  // like,dislike,sub,unsub
  const noOfLikes = likes.length;
  const liked = likes.includes(loggedinUserId);
  const disliked = dislikes.includes(loggedinUserId);
  const subscribed = subscribedUsers?.includes(channelId); //in case of not loggedin

  // console.log({ noOfLikes, liked, disliked, subscribed });
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

  //
  function extractFirst20Words() {
    // Split the text into words
    const words = desc.split(" ");

    // Slice the first 20 words and join them back into a sentence
    const first20Words = words.slice(0, 20).join(" ");

    return first20Words;
  }
  function extractAfter20Words() {
    // Split the text into words
    const words = desc.split(" ");

    // Slice the first 20 words and join them back into a sentence
    const after20Words = words.slice(20).join(" ");

    return after20Words;
  }

  // fetch ,comments
  const fetchComments = async () => {
    loading = true;
    try {
      const response = await axios.get(`/comment/${videoId}`);
      setComments(response.data);
    } catch (error) {
      showToast(
        error.response.data.message,
        "error while loading comments on this video",
        "error"
      );
    } finally {
      loading = false;
    }
  };
  // i am facing some problem due to persestincy of state ,so update state very carefully

  // call in videoslice
  const handleLike = async () => {
    // not logged in
    if (!loggedinUser) {
      showToast(
        "Please login !",
        `you cant like videos because you are not logged in `,
        "warning"
      );
      return;
    }
    dispatch(loadingState());
    await likeVideo(videoId)
      .then(() => {
        dispatch(updateVideoLike(loggedinUserId));
      })
      .catch((error) => {
        showToast(
          error.response.data.message,
          `error while you liked the video`,
          "error"
        );
      })
      .finally(() => {
        dispatch(idleState());
      });
  };
  const handleDislike = async () => {
    if (!loggedinUser) {
      showToast(
        "Please login !",
        `you cant dislike this video because you are not logged in `,
        "warning"
      );
      return;
    }
    dispatch(loadingState());
    await dislikeVideo(videoId)
      .then(() => {
        dispatch(updateVideoDislike(loggedinUserId));
      })
      .catch((error) => {
        showToast(
          error.response.data.message,
          `error while you disliked the video`,
          "error"
        );
      })
      .finally(() => {
        dispatch(idleState());
      });
  };
  // call in userslice
  const handleSubUnsub = async () => {
    if (!loggedinUser) {
      showToast(
        "Please login !",
        `you can't subscribe this channel because you are not logged in `,
        "warning"
      );
      return;
    }
    if (subscribed) {
      await unsubscribeChannel(userId)
        .then(() => {
          dispatch(updateChannelUnsub(channelId));
        })
        .catch((error) => {
          showToast(
            error.response.data.message,
            `error while you unsubscribed the channel`,
            "error"
          );
        })
        .finally(() => {
          dispatch(idleState());
        });
    } else {
      await subscribeChannel(userId)
        .then(() => {
          dispatch(updateChannelSub(channelId));
        })
        .catch((error) => {
          showToast(
            error.response.data.message,
            `error while you subscribed the channel`,
            "error"
          );
        })
        .finally(() => {
          dispatch(idleState());
        });
    }
  };

  const handleAddComment = async () => {
    if (!loggedinUser) {
      showToast(
        "Please login !",
        `you can't comment on this videos because you are not logged in `,
        "warning"
      );
      return;
    }
    dispatch(loadingState());
    await axios
      .post("/comment", { videoId, desc: newComment })
      .then((response) => {
        setNewComment("");
        showToast("comment added successfully", undefined, "success");
        setComments((prev) => [response.data, ...prev]);
      })
      .catch((error) => {
        showToast(
          error.response.data.message,
          `error while you commented on this video`,
          "error"
        );
      })
      .finally(() => {
        dispatch(idleState());
      });
  };
  const addView = async () => {
    dispatch(loadingState());
    try {
      await axios.put(`/video/view/${videoId}`);
      dispatch(updateVideoViews());
    } catch (error) {
      showToast(
        error.response.data.message,
        "error occured while adding view",
        "error"
      );
      // alert(error.response.data.message);
    } finally {
      dispatch(idleState());
    }
  };

  useEffect(() => {
    fetchComments();
    addView();
  }, [videoId]);
  // if (loading) return <h1>loading ...</h1>;
  return (
    <>
      <div className="video">
        <video
          autoPlay
          loading="lazy" //defers loading until its in user's viewport ,improves efficeicy
          controls
          className="videoBox"
          src={videoUrl}
        ></video>

        <div className="title">{title}</div>

        <HStack className="channelStrip" spacing={4}>
          {/* logic if [unsub - text,bg - black,white] ,like,dislike - icon is filled  */}
          {/* currently above style is droped ofr sub/unsub */}
          <Avatar src={img} alt="" />

          <div className="nameNsubs">
            <div className="channelName">{name}</div>
            <div className="subs">
              {subscribers} {subscribers === 1 ? "subscriber" : "subscribers"}
            </div>
          </div>
          <Tag
            size={"lg"}
            borderRadius="full"
            variant="solid"
            colorScheme="gray"
          >
            <TagLabel>
              <span onClick={handleLike}>
                {liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
              </span>{" "}
              {noOfLikes} |{" "}
              <span onClick={handleDislike}>
                {disliked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
              </span>
            </TagLabel>
          </Tag>
          <Tag
            size={"lg"}
            borderRadius="full"
            variant="solid"
            colorScheme="gray"
          >
            <TagLabel onClick={handleSubUnsub} className="subUnsub">
              {subscribed ? "unsubscribe" : "subscribe"}
            </TagLabel>
          </Tag>
        </HStack>
        {/* this will have logo,name,subs,sub/unsub,like,dislike */}

        <div className="more details">
          {/* upload date,desc,tags */}
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    <p className="viewsNdate">
                      {views} views {format(createdAt)}
                    </p>
                    <p>{extractFirst20Words()}</p>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{extractAfter20Words()}</AccordionPanel>
            </AccordionItem>
          </Accordion>
        </div>

        {/* now about all comments and add my comment */}
        <div className="commentsWrapper">
          <div className="addComment singleComment">
            <Avatar src={loggedinUser?.img} alt="" />
            <div className="details commentInput">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a Comment"
                cols="100"
                rows="2"
              ></textarea>
              {newComment && (
                <Button onClick={handleAddComment}>
                  <SendIcon />
                </Button>
              )}
            </div>
          </div>
          {comments.map((comment) => {
            return (
              <SingleComment
                setComments={setComments}
                key={comment._id}
                comment={comment}
                channelId={channelId}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;
