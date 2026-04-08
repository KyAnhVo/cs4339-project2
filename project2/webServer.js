import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Used when you implement the TODO handlers below.
// eslint-disable-next-line no-unused-vars
import User from "./schema/user.js";
// eslint-disable-next-line no-unused-vars
import Photo from "./schema/photo.js";
import { FirstPage } from "@mui/icons-material";

const app = express();

// define these in env and import in this file
const port = process.env.PORT || 3001;
const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb+srv://lenob0dy:101@LeNob0dY@project2.43uwkqm.mongodb.net/?appName=Project2";

// Enable CORS for frontend running on a different port
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongoUrl);

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:"),
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /user/list
 * Returns the list of users.
 */
app.get("/user/list", async (req, res) => {
  try {
    // TODO:
    // 1. Fetch all users from MongoDB.
    const users = await User.find();
    // 2. Return only the fields required by the frontend.

    const userList = users.map((user) => ({
      _id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
    }));

    return res.json(userList);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * GET /user/:id
 * Returns the details of one user.
 */
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send("Invalid user id");
    }

    // TODO:
    // 1. Find the user by id.
    // 2. If the user does not exist, return 404.
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // 3. Return only the fields required by the frontend.
    return res.json({
      _id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      occupation: user.occupation,
      location: user.location,
      description: user.description,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

/**
 * GET /photosOfUser/:id
 * Returns all photos of the given user.
 */
app.get("/photosOfUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).send("Invalid user id");
    }

    // TODO:
    // 1. Find all photos whose user_id matches userId.
    const photos = await Photo.find({ user_id: userId });

    // 2. Fetch all users from MongoDB.
    const users = await User.find();

    // 3. Build a lookup structure from user _id to user object.
    const userLookup = new Map(
      users.map((user) => [
        user._id.toString(),
        {
          _id: user.id.toString(),
          first_name: user.first_name,
          last_name: user.last_name,
        },
      ]),
    );

    // 4. For each photo, construct the response expected by the frontend.
    const photoResponses = photos.map((photo) => {
      return {
        _id: photo.id.toString(),
        file_name: photo.file_name,
        date_time: photo.date_time,
        user_id: photo.user_id.toString(),

        // 5. For each comment, include the corresponding user object in comment.user.
        comments: photo.comments.map((comment) => {
          return {
            _id: comment.id,
            date_time: comment.date_time,
            comment: comment.comment,
            photo_id: photo.id.toString(),
            user: userLookup.get(comment.user_id.toString()),
          };
        }),
      };
    });

    // 6. Return the resulting array.
    return res.json(photoResponses);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
