import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config(); // to use .env

let app = express();
let port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json()); // This ensures we can read JSON from the request body
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your React frontend
    credentials: true, // Enable sending cookies and authentication headers
  })
);
// Mount the auth routes
app.use("/auth", authRoutes);

// Start the server
app.listen(port, () => {
  connectDB();
  console.log(`Server running on port ${port}`);
});
