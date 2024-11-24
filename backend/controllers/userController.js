import Invite from "../models/Invite.js";
import CreatePost from "../models/postSchema.js";
import Notification from "../models/notification.js"; // Assuming Notification model is in the correct directory
import User from "../models/signupModels/User.js";
import bcrypt from "bcryptjs";

export const nearByEntities = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { coordinates } = user.location;
    const [longitude, latitude] = coordinates;
    const radius = 10000; // 10 kilometers

    const isVolunteer = user.type === "volunteer";
    let nearbyEntities;

    if (isVolunteer) {
      nearbyEntities = await User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius,
          },
        },
        type: "organization",
        _id: { $ne: userId },
      }).select("-password");
    } else {
      nearbyEntities = await User.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius,
          },
        },
        type: "volunteer",
        _id: { $ne: userId },
      }).select("-password");
    }

    if (nearbyEntities.length === 0) {
      return res.status(200).json({ message: "No nearby entities found" });
    }

    // Adding follow status for each nearby entity
    const entitiesWithFollowStatus = nearbyEntities.map((entity) => ({
      ...entity.toObject(),
      isFollowing: user.followers.includes(entity._id),
    }));

    return res.status(200).json(entitiesWithFollowStatus);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching nearby entities." });
  }
};

// Send or Cancel Invitation
export const sendOrCancelInvite = async (req, res) => {
  const { volunteerId } = req.body; // The volunteerId from the request body
  const { _id: organizationId } = req.user; // Get the organizationId from the authenticated user

  if (!volunteerId) {
    return res.status(400).json({ error: "volunteerId is required" });
  }

  try {
    // Find the volunteer by ID
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    // Find an existing invite from the organization to the volunteer
    const existingInvite = await Invite.findOne({
      userId: volunteerId,
      organization: organizationId,
    });
    // Log to verify the query result

    if (existingInvite) {
      // If the invite is "pending", cancel it
      if (existingInvite.status === "pending") {
        existingInvite.status = "canceled"; // Set status to "canceled"
        await existingInvite.save();
        return res
          .status(200)
          .json({ message: "Invitation canceled successfully" });
      } else {
        // If the invite is accepted or declined, send a new invitation
        existingInvite.status = "pending"; // Update the status to "pending"
        await existingInvite.save();
        return res
          .status(200)
          .json({ message: "Invitation sent successfully" });
      }
    } else {
      // If no invitation exists, create a new one and send it
      const newInvite = new Invite({
        userId: volunteerId,
        organization: organizationId,
        status: "pending", // Set the status to "pending"
      });

      await newInvite.save();
      return res.status(200).json({ message: "Invitation sent successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to process invitation" });
  }
};

export const edituserData = async (req, res) => {
  try {
    const {
      fullName,
      bio,
      email,
      location,
      currentPassword,
      newPassword,
      confirmPassword,
      profileImage, // Accept profileImage field
    } = req.body;

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage; // Save the Base64 string

    if (location) {
      if (
        location.type !== "Point" ||
        !Array.isArray(location.coordinates) ||
        location.coordinates.length !== 2
      ) {
        return res.status(400).json({
          message: "Location must be in the correct format",
        });
      }
      user.location = location;
    }

    // Handle password change logic
    if (currentPassword && newPassword && confirmPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
    }

    // Save the updated user data
    await user.save();

    // Return a success response
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        fullName: user.fullName,
        bio: user.bio,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage, // Return the updated profileImage
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createPost = async (req, res) => {
  const { message, visibility, images } = req.body;
  const userId = req.user._id; // Assuming `req.user` has the authenticated user ID

  // Check if `images` is an array, if it's not, set it to an empty array
  if (!Array.isArray(images)) {
    return res.status(400).json({ error: "Images should be an array." });
  }

  // Validate that the images are in the correct format (base64-encoded strings)
  for (const image of images) {
    if (typeof image !== "string" || !image.startsWith("data:image")) {
      return res.status(400).json({ error: "Invalid image format." });
    }
  }

  try {
    const newPost = new CreatePost({
      message,
      visibility,
      images, // Save the array of base64-encoded images
      createdAt: new Date().toISOString(),
      userId,
    });

    // Save the new post in the database
    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully!",
      post: newPost,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
};

export const allPosts = async (req, res) => {
  try {
    let posts = await CreatePost.find({ visibility: "public" })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId", // Populate the userId field
        select: "-password", // Exclude the password field from the user data
      });
    return res.status(200).json({
      message: "Posts fetched successfully!",
      posts, // Send the posts array
    });
  } catch (error) {
    // Handle errors (e.g., database connection issues)
    return res.status(500).json({
      error: "An error occurred while fetching posts.",
    });
  }
};

export const getFollowingAndFollowersPosts = async (req, res) => {
  const userId = req.user._id; // The logged-in user's ID (extracted from token or session)

  try {
    // Fetch the logged-in user from the database
    const user = await User.findById(userId).populate("following", "_id");

    // If the user is not found, send an error response
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Create an array of IDs to get posts from users the logged-in user is following
    const followingUserIds = user.following.map(
      (followedUser) => followedUser._id
    );

    // Add the current user's own ID to the list of IDs to fetch their own posts
    followingUserIds.push(userId);

    // Fetch posts from the users the logged-in user is following, including their own posts
    let posts = await CreatePost.find({
      userId: { $in: followingUserIds }, // Fetch posts from users in the followingUserIds array
    })
      .sort({ createdAt: -1 }) // Sort by the most recent posts first
      .populate({
        path: "userId", // Populate the userId field
        select: "-password", // Exclude the password field from the user data
      });

    // Send a success response with the fetched posts
    return res.status(200).json({
      message: "Posts fetched successfully!",
      posts, // Send the posts array
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while fetching posts.",
      details: error.message, // Send the error details for better debugging
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params; // Accessing the id from params
  // Logging the id to ensure it's correct

  try {
    // Find the post by ID and delete it
    const post = await CreatePost.findByIdAndDelete(id); // Use the correct `id` here

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post" });
  }
};

export const getMyPost = async (req, res) => {
  const userId = req.user._id; // The logged-in user's ID (extracted from token or session)

  try {
    // Fix the find query to properly query based on userId
    let posts = await CreatePost.find({ userId: userId }) // Correct query syntax
      .sort({ createdAt: -1 }); // Sorting by createdAt in descending order
    // .populate({
    //   path: "userId", // Populate the userId field
    //   select: "-password", // Exclude the password field from the user data
    // });

    return res.status(200).json({
      message: "Posts fetched successfully!",
      posts, // Send the posts array
    });
  } catch (error) {
    // Handle errors (e.g., database connection issues)
    return res.status(500).json({
      error: "An error occurred while fetching posts.",
    });
  }
};

export const getProfile = async (req, res) => {
  const { id } = req.params; // Get user ID from route parameters
  try {
    // Fetch user details based on the provided user ID
    let user = await User.findById(id); // Use findById to directly query by _id

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Fetch posts created by the user
    let posts = await CreatePost.find({ userId: id })
      // Fetch posts where userId matches the provided id
      .sort({ createdAt: -1 })
      .populate({
        path: "userId", // Populate the userId field
        select: "-password", // Exclude the password field from the user data
      });

    console.log("posts: ", posts);
    // Return user details and posts
    return res.status(200).json({
      user, // Send user details
      posts, // Send posts created by the user
    });
  } catch (error) {
    console.log("Error fetching profile data:", error);
    return res.status(500).json({
      error: "An error occurred while fetching the profile data.",
    });
  }
};

export const likeAndDislike = async (req, res) => {
  const { id } = req.params; // Get the postId from the request params
  const userId = req.user._id; // Get the user ID from the request (assumes user is authenticated)

  try {
    // Find the post by ID
    const post = await CreatePost.findById({ _id: id });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      // If user already liked the post, remove the like (unlike it)
      post.likes = post.likes.filter(
        (like) => like.toString() !== userId.toString()
      );
    } else if (post.dislikes.includes(userId)) {
      // If the user disliked the post, remove the dislike
      post.dislikes = post.dislikes.filter(
        (dislike) => dislike.toString() !== userId.toString()
      );
      // Then add the like
      post.likes.push(userId);
    } else {
      // If the user hasn't liked or disliked the post, add a like
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();

    // Populate the user details for likes and dislikes, excluding passwords
    const populatedPost = await CreatePost.findById(id)
      .populate({
        path: "likes", // Populate the 'likes' field (an array of user IDs)
        select: "-password", // Exclude the password field from user data
      })
      .populate({
        path: "dislikes", // Populate the 'dislikes' field (an array of user IDs)
        select: "-password", // Exclude the password field from user data
      });

    // Create a notification if the post was liked
    console.log("post.likes.includes(userId)", post.likes.includes(userId));
    if (!post.likes.includes(userId)) {
      console.log("not");
      const notification = new Notification({
        from: userId, // The user who liked the post
        to: post.user, // The user who posted the post
        type: "like", // Type of notification
      });

      // Save the notification
      await notification.save();
    }

    // Return success response with populated user details
    res.status(200).json({
      message: "Post liked successfully",
      likes: populatedPost.likes.length,
      dislikes: populatedPost.dislikes.length,
      likedBy: populatedPost.likes, // User details who liked the post
      dislikedBy: populatedPost.dislikes, // User details who disliked the post
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Backend route to add a comment

// Function to add a comment to a post
export const addComment = async (req, res) => {
  const { id } = req.params; // Get the post ID from the request parameters
  const { content } = req.body; // Get the comment content from the request body
  const userId = req.user._id; // Get the user ID from the request (assuming user is authenticated)

  try {
    // Find the post by ID
    const post = await CreatePost.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create the new comment
    const newComment = {
      userId,
      content,
      createdAt: new Date(),
    };

    // Add the comment to the post's comments array
    post.comments.push(newComment);

    // Save the updated post
    await post.save();

    // Return the updated post with the new comment
    res.status(201).json({
      message: "Comment added successfully",
      post: {
        _id: post._id,
        comments: post.comments,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to get comments for a post
export const getPostComments = async (req, res) => {
  const { id } = req.params; // Get the post ID from the URL parameters

  try {
    // Find the post and populate its comments with user details
    const post = await CreatePost.findById(id)
      .populate("userId", "fullName profileImage") // Populate user details for the post creator
      .populate("comments.userId", "fullName profileImage") // Populate user details for each comment
      .sort({ createdAt: -1 }); // Sort the posts by creation date, descending order (latest first)

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log("post", post);
    // Return the post with comments and populated user data
    res.status(200).json({
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
