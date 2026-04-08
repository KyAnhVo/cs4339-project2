import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import {
  Typography,
  ImageList,
  ImageListItem,
  ListItem,
  ListItemText,
  ButtonBase,
  Paper,
  Divider,
  Box,
} from "@mui/material";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import api from "../../lib/api";
import { List } from "@mui/material";

function UserPhoto({ photo }) {
  // display, on each row, a photo and on the right, its comments if available.
  // the css maxwidth/minwidth are a bit arbitrary, set to 35% each to keep the layout balanced.

  return (
    <>
      <ListItem width="100%" alignItems="flex-start">
        <Box
          sx={{
            maxWidth: "35%",
            minWidth: "35%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={`../../images/${photo.file_name}`}
            style={{
              maxWidth: "100%",
              objectFit: "contain",
              borderWidth: "50%",
            }}
            loading="lazy"
          />
        </Box>
        <Box
          sx={{
            width: "50%",
            padding: "10px",
            maxHeight: "100%",
            overflowY: "scroll",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {photo.comments ? "Comments" : ""}
          </Typography>
          <List>
            {(photo.comments || []).map((comment) => (
              <>
                <Divider />
                <ListItem key={`photo-${photo._id}-comment-${comment._id}`}>
                  <ListItemText
                    primary={
                      <Link to={`/users/${comment.user._id}`}>
                        {comment.user.first_name + " " + comment.user.last_name}
                      </Link>
                    }
                    secondary={comment.comment}
                  />
                </ListItem>
              </>
            ))}
          </List>
        </Box>
      </ListItem>
      <Divider />
    </>
  );
}

function UserPhotos() {
  // fetch from GET /photosOfUser/:userId, display each photo with its comments if available

  const params = useParams();
  const [photos, setPhotos] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/photosOfUser/${params.userId}`)
      .then((response) => {
        setPhotos(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  }, [params]);

  return (
    <Box sx={{ maxHeight: "100%", overflowY: "auto", width: "100%" }}>
      <List sx={{ width: "100%" }}>
        {photos.map((photo) => (
          <UserPhoto key={`photo-${photo._id}`} photo={photo} />
        ))}
      </List>
    </Box>
  );
}

UserPhotos.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default UserPhotos;
