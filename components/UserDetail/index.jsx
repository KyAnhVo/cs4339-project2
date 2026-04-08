import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from "prop-types";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import "./styles.css";
import { useParams, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../lib/api";
import {} from "@mui/material";

function UserDetail() {
  // get id from param, use id to fetch user detail, display almost all their details (maybe not id just because)

  const { userId } = useParams();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get(`/user/${userId}`)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  }, [userId]);
  return (
    <>
      <Typography variant="h2">
        {user.first_name + " " + user.last_name}
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary={"Location"} secondary={user.location} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={"Description"} secondary={user.description} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary={"Occupation"} secondary={user.occupation} />
        </ListItem>
      </List>
    </>
  );
}

export default UserDetail;
