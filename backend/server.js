import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config(); // to use .env

let app = express();
let port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json()); // This ensures we can read JSON from the request body
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5100", // Allow requests from frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // You can specify the allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // You can specify the allowed headers
    credentials: true, // Allow cookies to be sent with requests
  })
);
// Mount the auth routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/notification", notificationRoutes);

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});
