import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  // You'll need to install jsonwebtoken (npm install jsonwebtoken)
import User from "../models/signupModels/User.js";

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
    location,
  });

  try {
    // Save new user to the database
    await newUser.save();
    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Server error, please try again later" });
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
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const payload = { userId: user._id, email: user.email, type: user.type };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // 1 hour expiration

    // Send the token in the response
    return res.status(200).json({
      message: "Login successful",
      token: token,  // Send the JWT token to the client
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error, please try again later" });
  }
};
