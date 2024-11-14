import mongoose from "mongoose";

// Create User Schema
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: {
    type: String,
    enum: ["volunteer", "organization", "beneficiary"],
    required: true,
  },
  location: { type: String, required: true },
});

// Exporting User model using ES module syntax
export default mongoose.model("User", UserSchema);
