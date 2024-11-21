import mongoose from "mongoose";

// Comment schema: represents a comment on a post
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  content: {
    type: String,
    required: true, // Ensure the comment has content
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp for when the comment is created
  },
});

// Post schema
const postSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true, // Ensure each post has a message
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public", // Default visibility is public
  },
  images: [String], // Array of base64-encoded images
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for post creation
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Array of user IDs who liked the post
    },
  ],
  dislikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Array of user IDs who disliked the post
    },
  ],
  comments: [commentSchema], // Array of comments (using the comment schema)
});

const CreatePost = mongoose.model("Post", postSchema);

export default CreatePost;
