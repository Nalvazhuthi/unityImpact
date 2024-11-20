import mongoose from "mongoose";

// User schema
const UserSchema = new mongoose.Schema({
  profileImage: { type: String, default: "" }, // Default to empty string for profileImage
  fullName: { type: String, required: true },
  bio: { type: String, default: "This user has not written a bio yet." }, // Default bio text
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ["volunteer", "organization"], 
    default: "volunteer" // Default to "volunteer" if not specified
  },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" }, // Default type is "Point"
    coordinates: { type: [Number], required: true, default: [0, 0] }, // Default to [0, 0] (coordinates for the origin point)
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], // Default to empty array for followers
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], // Default to empty array for following
});

// Create a 2dsphere index on the location field for geospatial queries
UserSchema.index({ location: "2dsphere" });

export default mongoose.model("User", UserSchema);


// create a API which fech loged user following and followes and login in users post 