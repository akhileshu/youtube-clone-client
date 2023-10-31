import React from "react";
import MainFeed from "../components/structure/MainFeed";
import Navbar from "../components/structure/Navbar";

function Home({type}) {
  return (
    <>
      <Navbar>
      </Navbar>
      
      <MainFeed type={type} />
    </>
  );
}

export default Home;
