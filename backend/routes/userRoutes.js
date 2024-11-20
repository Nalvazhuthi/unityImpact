import express from "express";
import { protectRoute } from "../middleWare/protectRoute.js";
import {
  allPosts,
  createPost,
  deletePost,
  edituserData,
  getFollowingAndFollowersPosts,
  nearByEntities,
} from "../controllers/userController.js";

let routes = express.Router();

routes.get("/nearMe", protectRoute, nearByEntities);
routes.put("/edituserData", protectRoute, edituserData);
routes.post("/createPost", protectRoute, createPost);
routes.get("/allPosts", protectRoute, allPosts);
routes.get("/followingPost", protectRoute, getFollowingAndFollowersPosts);
routes.delete("/delete/:id", protectRoute, deletePost);

export default routes;
