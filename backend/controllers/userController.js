import Invite from "../models/Invite.js";
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
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching nearby entities." });
  }
};

// Follow a user (an organization or volunteer)
export const followOrUnfollowOrganisation = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { userIdToFollow } = req.body; // The user ID to follow or unfollow
    const currentUserId = req.user._id; // The logged-in user

    // Find both users (current user and the user to be followed/unfollowed)
    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userIdToFollow);

    if (!currentUser || !userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already following the target user
    const isFollowing = currentUser.following.includes(userIdToFollow);

    if (isFollowing) {
      // Unfollow the user
      currentUser.following = currentUser.following.filter(
        (followingId) => !followingId.equals(userIdToFollow)
      );
      userToFollow.followers = userToFollow.followers.filter(
        (followerId) => !followerId.equals(currentUserId)
      );

      // Save changes
      await currentUser.save();
      await userToFollow.save();

      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      // Follow the user
      currentUser.following.push(userIdToFollow); // Add to current user's following
      userToFollow.followers.push(currentUserId); // Add to user's followers

      // Save changes
      await currentUser.save();
      await userToFollow.save();

      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while following or unfollowing the user",
    });
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
    console.log("Existing Invite:", existingInvite); // Log to verify the query result

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
    console.error("Error in sendOrCancelInvite:", error);
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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// routes.put("/edituserData", protectRoute, edituserData);
