import express from "express";
import { protectRoute } from "../middleWare/protectRoute.js";
import {
  followOrUnfollowOrganisation,
  nearByEntities,
  sendOrCancelInvite,
} from "../controllers/userController.js";

let routes = express.Router();

routes.get("/nearMe", protectRoute, nearByEntities);
routes.post(
  "/followOrUnfollowUser",
  protectRoute,
  followOrUnfollowOrganisation
);

routes.post("/sendOrCancelInvite", protectRoute, sendOrCancelInvite);

export default routes;
