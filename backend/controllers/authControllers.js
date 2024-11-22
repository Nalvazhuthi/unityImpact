import bcrypt from "bcrypt";
import User from "../models/signupModels/User.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie .js";

export let signup = async (req, res) => {
  const { fullName, email, password, type, location } = req.body;

  // Validate email format
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Check if email or full name already exists in the database
  const existingEmail = await User.findOne({ email });
  const existingFullName = await User.findOne({ fullName });

  if (existingEmail) {
    return res.status(400).json({ error: "Email is already registered" });
  }

  if (existingFullName) {
    return res.status(400).json({ error: "Full name is already in use" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    type,
    location: {
      type: "Point", // GeoJSON type
      coordinates: [location.longitude, location.latitude], // [longitude, latitude]
    },
  });

  try {
    // Save new user to the database
    await newUser.save();
    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

export let login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email is provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "No mail id found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "incorrect password" });
    }

    // Send the token in the response
    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later" });
  }
};

export let logout = async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // Send a successful logout message
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ error: "Logout error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
