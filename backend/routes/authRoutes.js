import express from "express";
import { login, signup } from "../controllers/authControllers.js";

let routes = express.Router();

// POST /auth/signup route
routes.post("/signup", signup);
routes.post("/login", login);

export default routes;
