import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactDOM from "react-dom/client";
import { useState, useEffect } from "react";

import {
  Grid,
  Typography,
  Paper,
  ImageList,
  ImageListItem,
  Box,
} from "@mui/material";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useParams,
} from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import api from "./lib/api";

function Home() {
  // get all photos from all users
  // then display them in an ImageList. Lowkey looks nice.
  // ALSO, this is very, very slow but project barely has any users.

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/user/list")
      .then((res) => {
        const users = res.data;
        const photoRequests = users.map((user) =>
          api.get(`/photosOfUser/${user._id}`),
        );
        return Promise.all(photoRequests);
      })
      .then((responses) => {
        const allPhotos = responses.flatMap((res) => res.data);
        setImages(allPhotos);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ maxHeight: "100%", overflowY: "auto", width: "100%" }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((image) => (
          <ImageListItem>
            <img src={`./images/${image.file_name}`} sx={{ maxWidth: "33%" }} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

function UserDetailRoute() {
  const { userId } = useParams();
  // eslint-disable-next-line no-console
  console.log("UserDetailRoute: userId is:", userId);
  return <UserDetail userId={userId} />;
}

function UserPhotosRoute() {
  const { userId } = useParams();
  return <UserPhotos userId={userId} />;
}

function Root() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Outlet />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

function UserLayout() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },

      { path: "users", element: <UserList /> },

      {
        path: "users/:userId",
        element: <UserLayout />,
        children: [
          { index: true, element: <UserDetailRoute /> },
          {
            path: "photos",
            element: <UserPhotosRoute />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<RouterProvider router={router} />);
