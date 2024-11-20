import mongoose from "mongoose";

// Post schema
const postSchema = new mongoose.Schema({
  message: String,
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  images: [String], // Array of base64-encoded images
  createdAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
});

const CreatePost = mongoose.model("Post", postSchema);

export default CreatePost;
