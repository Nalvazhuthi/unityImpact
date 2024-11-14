import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
dotenv.config(); // to use .env

let app = express();
let port = process.env.PORT;

// app.use("/auth", authRoutes);

app.listen(port, () => {
  connectDB();
});
