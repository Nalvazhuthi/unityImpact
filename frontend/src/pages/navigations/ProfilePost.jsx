import React from "react";
import { formatDistanceToNow, format } from "date-fns"; // Import date-fns functions
import defaultImage from "../../assets/images/temp/blankUser.png";
import Post from "../../components/post/Post";

const ProfilePost = ({ userPosts, setNav }) => {
  // Check if userPosts is an array and userPosts.user is defined before accessing properties
  if (!userPosts || !userPosts.user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div className="ProfilePost">
      {/* <div className="profile-wrapper"> */}
        <div className="profile-container">
          <div className="profile-header flex">
            <div className="img-container">
              {/* Show the uploaded image if available, otherwise display a placeholder */}
              <img
                src={userPosts.user.profileImage || defaultImage} // Use optional chaining for safety
                alt="Profile"
                className="profile-image"
              />
            </div>
            <div className="details flex">
              <div className="name">{userPosts.user.fullName}</div>{" "}
              {/* Displaying full name */}
              <div className="email">{userPosts.user.email}</div>{" "}
              {/* Displaying email */}
            </div>
          </div>

          <div className="bio-container flex">
            <h3 className="bio-title">Bio:</h3>
            <p className="bio">
              {userPosts.user.bio || "This user has not written a bio yet."}
            </p>{" "}
            {/* Display bio or default text */}
          </div>

          <div className="location-container flex">
            <p className="location">
              Location: Latitude:{" "}
              {userPosts.user.location
                ? userPosts.user.location.coordinates[1]
                : "N/A"}
              , Longitude:{" "}
              {userPosts.user.location
                ? userPosts.user.location.coordinates[0]
                : "N/A"}
            </p>{" "}
            {/* Displaying location if available */}
          </div>
        </div>

        <div className="posts-wrapper">
          <h2>Your Posts</h2>
          <div className="posts">
            {userPosts.posts.length > 0 ? (
              userPosts.posts.map((post) => {
                return <Post setNav={setNav} key={post._id} post={post} />; // Add return statement here
              })
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};

export default ProfilePost;
