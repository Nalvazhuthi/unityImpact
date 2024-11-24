import express from "express";
import multer from "multer"; // Import multer
import { protectRoute } from "../middleWare/protectRoute.js";
import {
  addComment,
  allPosts,
  createPost,
  deletePost,
  edituserData,
  getFollowingAndFollowersPosts,
  getMyPost,
  getPostComments,
  getProfile,
  likeAndDislike,
  nearByEntities,
} from "../controllers/userController.js";

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    cb(null, uploadDir); // Specify the folder where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Create unique file name
  },
});

// Set up file size and type limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Allowed image types
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

let routes = express.Router();

routes.get("/nearMe", protectRoute, nearByEntities);
routes.put(
  "/edituserData",
  upload.single("avatar"),
  protectRoute,
  edituserData
);
routes.post("/createPost", upload.single("avatar"), protectRoute, createPost); // Now `upload` is defined
routes.get("/allPosts", protectRoute, allPosts);
routes.get("/followingPost", protectRoute, getFollowingAndFollowersPosts);
routes.delete("/delete/:id", protectRoute, deletePost);
routes.get("/myPosts", protectRoute, getMyPost);
routes.get("/profile/:id", protectRoute, getProfile);
routes.get("/likeDisLike/:id", protectRoute, likeAndDislike);

routes.get("/comment/:id", protectRoute, getPostComments); // Correct route for fetching comments
routes.post("/comment/:id", protectRoute, addComment); // Route for adding comments

export default routes;
