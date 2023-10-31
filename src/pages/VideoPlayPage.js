import React from "react";
import Navbar from "../components/structure/Navbar";
import Recomendations from "../components/structure/Recomendations";
import VideoPlayer from "../components/structure/VideoPlayer";

function VideoPlayPage() {
  return (
    <>
      <Navbar />
      <div className="videoPlayerWrapper">
        <VideoPlayer />
        <Recomendations />
      </div>
    </>
  );
}

export default VideoPlayPage;
