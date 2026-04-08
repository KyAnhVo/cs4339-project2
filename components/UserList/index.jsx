import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import PersonIcon from "@mui/icons-material/Person";

import "./styles.css";
import api from "../../lib/api";

function UserItem({ user }) {
  // a list item that displays user name with buttons to their photos and profile

  return (
    <ListItem>
      {/* name */}
      <ListItemText
        primary={user.first_name + " " + user.last_name}
        sx={{ flexGrow: 1 }}
      />

      {/* images */}
      <ListItemButton
        sx={{ flexGrow: 0 }}
        component={Link}
        to={`/users/${user._id}/photos`}
      >
        <ListItemIcon>
          <ImageIcon />
        </ListItemIcon>
      </ListItemButton>

      {/* profile */}
      <ListItemButton
        sx={{ flexGrow: 0 }}
        component={Link}
        to={`/users/${user._id}`}
      >
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
      </ListItemButton>
    </ListItem>
  );
}

function UserList() {
  // fetch from GET /user/list, display their names and links in a list

  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/user/list")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  }, []);

  return (
    <div>
      <Typography variant="h2" sx={{ flexGrow: 1, textAlign: "center" }}>
        Users
      </Typography>
      <Divider />
      <Divider />
      <List component="nav">
        {users.map((user) => (
          <>
            <UserItem user={user} />
            <Divider />
          </>
        ))}
      </List>
    </div>
  );
}

export default UserList;
