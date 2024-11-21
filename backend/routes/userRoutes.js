import express from "express";
import { protectRoute } from "../middleWare/protectRoute.js";
import {
  addComment,
  allPosts,
  createPost,
  deletePost,
  edituserData,
  getFollowingAndFollowersPosts,
  getMyPost,
  getProfile,
  likeAndDislike,
  nearByEntities,
} from "../controllers/userController.js";

let routes = express.Router();

routes.get("/nearMe", protectRoute, nearByEntities);
routes.put("/edituserData", protectRoute, edituserData);
routes.post("/createPost", protectRoute, createPost);
routes.get("/allPosts", protectRoute, allPosts);
routes.get("/followingPost", protectRoute, getFollowingAndFollowersPosts);
routes.delete("/delete/:id", protectRoute, deletePost);
routes.get("/myPosts", protectRoute, getMyPost);
routes.get("/profile/:id", protectRoute, getProfile);
routes.get("/likeDisLike/:id", protectRoute, likeAndDislike);
routes.get("/comment/:id", protectRoute, addComment);
routes.post("/comment/:id", protectRoute, addComment);

export default routes;
