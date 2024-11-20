import Invite from "../models/Invite.js";
import CreatePost from "../models/postSchema.js";
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

// routes.put("/edituserData", protectRoute, edituserData);
export const createPost = async (req, res) => {
  const { message, visibility, images } = req.body;
  const userId = req.user._id; // Assuming `req.user` has the authenticated user ID

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
    let posts = await CreatePost.find().sort({ createdAt: -1 }).populate({
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
      .sort({ createdAt: -1 }) // Sorting by createdAt in descending order
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
