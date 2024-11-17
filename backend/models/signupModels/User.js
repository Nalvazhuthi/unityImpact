import mongoose from "mongoose";

// User schema
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, required: true }, // 'volunteer' or 'organization'
  location: {
    type: { type: String, enum: ["Point"], required: true }, // type of the GeoJSON object
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of followers (User references)
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of followers (User references)
});

// Create a 2dsphere index on the location field for geospatial queries
UserSchema.index({ location: "2dsphere" });

export default mongoose.model("User", UserSchema);
