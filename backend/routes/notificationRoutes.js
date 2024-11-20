


import express from "express";
import { protectRoute } from "../middleWare/protectRoute.js";
import {
  deleteNotifications,
  getNotification,
} from "../controllers/notificationController.js";

let routes = express.Router();

routes.get("/", protectRoute, getNotification);
routes.delete("/", protectRoute, deleteNotifications);

export default routes;
