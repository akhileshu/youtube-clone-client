import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import { useDispatch } from "react-redux";

import NotFoundPage from "./components/mixed/NotFoundPage";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import MyUploads from "./pages/MyUploads";
import SearchedVideos from "./pages/SearchedVideos";
import Auth from "./components/auth & uplaod/Auth";
import VideoPlayPage from "./pages/VideoPlayPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home type="random" />,
    },
    {
      path: "/sub",
      element: <Home type="sub" />,
    },
    {
      path: "/trend",
      element: <Home type="trend" />,
    },

    {
      path: "/auth",
      element: <Auth />,
    },

    {
      path: "/myUploads",
      element: <MyUploads />,
    },
    {
      path: "/myAccount",
      element: <MyAccount />,
    },
    {
      path: "/video",
      element: <VideoPlayPage />,
    },
    {
      path: "/search/:searchTerm",
      element: <SearchedVideos />,
    },
    {
      path: "/*",
      element: <NotFoundPage />,
    },
  ]);
  const dispatch = useDispatch();
  // const navigate = useNavigate();


  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
