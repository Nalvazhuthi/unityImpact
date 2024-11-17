import jwt from "jsonwebtoken";

// Function to generate a token and set it as a cookie
export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  // Set the token in an HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Makes the cookie inaccessible to JavaScript, preventing XSS attacks
    secure: process.env.NODE_ENV === "production", // Ensures cookies are sent over HTTPS in production
    sameSite: "Strict", // Prevents cross-site request forgery (CSRF) attacks
  });
};
