import express from "express";
import {
  getMe,
  login,
  logout,
  signup,
} from "../controllers/authControllers.js";
import { protectRoute } from "../middleWare/protectRoute.js";

let routes = express.Router();

// POST /auth/signup route
routes.post("/signup", signup);
routes.post("/login", login);
routes.post("/logout", logout);
routes.get("/me", protectRoute, getMe);

export default routes;
