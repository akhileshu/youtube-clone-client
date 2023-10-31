import { Skeleton, SkeletonText } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { selectUserState } from "../../features/user/userSlice";
import { selectVideoState } from "../../features/video/videoSlice";

export const SkeletonLoader = ({ children }) => {
  const { status: userStatus } = useSelector(selectUserState);
  const { status: videoStatus } = useSelector(selectVideoState);
  const isLoaded = userStatus === "idle" && videoStatus === "idle";
  return (
    // i am using styles of mainfeed card with classname "card"
    isLoaded ? (
      children
    ) : (
      <div className="card">
        <Skeleton isLoaded={isLoaded} height="150px" width="97%" />

        <div className="btm">
          <Skeleton
            isLoaded={isLoaded}
            height="50px"
            width="50px"
            borderRadius="full"
          />
          <SkeletonText
            ml={"1rem"}
            isLoaded={isLoaded}
            width={"80%"}
            mt="2"
            noOfLines={2}
            spacing="4"
            skeletonHeight="2"
          />
        </div>
      </div>
    )
  );
};
