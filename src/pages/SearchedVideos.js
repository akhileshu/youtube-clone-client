import React from "react";
import { useSelector } from "react-redux";
import { selectVideoState } from "../features/video/videoSlice";
import { useParams } from "react-router-dom";
import SearchedVideoCard from "../components/videoCards/SearchedVideoCard";
import Navbar from "../components/structure/Navbar";
import { Box, Text } from "@chakra-ui/react";

function SearchedVideos() {
  let { searchedVideos: videos } = useSelector(selectVideoState);
  const { searchTerm } = useParams();

  return (
    <>
      <div className="searchedVideosPage">
        <Navbar searchTerm={searchTerm} />
        {videos.length === 0 ? (
          <Box
            boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
            textAlign="center"
            p={4}
            m={5}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.200"
          >
            <Text>
              No videos found. Please upload videos to continue or try a
              different search term.
            </Text>
          </Box>
        ) : (
          videos.map((video) => (
            <SearchedVideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </>
  );
}

export default SearchedVideos;
