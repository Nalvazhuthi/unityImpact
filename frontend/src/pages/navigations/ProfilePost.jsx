import React, { useEffect, useState } from "react";
import { formatDistanceToNow, format } from "date-fns"; // Import date-fns functions
import SideBar from "../../components/sidebar/SideBar";

const ProfilePost = ({ userData, setNav, nearbyEntities }) => {
  const [userPosts, setUserPosts] = useState([]);

  // Function to fetch user posts
  const fetchUserPosts = async () => {
    try {
      const response = await fetch("http://localhost:4100/user/myPosts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials if needed (cookies or token)
      });

      if (response.ok) {
        const data = await response.json();
        setUserPosts(data.posts); // Assuming your response contains a 'posts' array
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Fetch posts when the component mounts
  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div className="ProfilePost">
      <SideBar
        setNav={setNav}
        userData={userData}
        nearbyEntities={nearbyEntities}
      />
      <div className="profile-wrapper">
        <h2>Your Posts</h2>
        {userPosts.length > 0 ? (
          userPosts.map((post) => {
            // Date handling for each post
            const createdAtDate = new Date(post.createdAt);
            let timeDistance = formatDistanceToNow(createdAtDate);

            // Adjust formatting to remove "about" and display "Just now" for 1 minute
            timeDistance = timeDistance.replace(/^about /, "");
            const formattedCreatedAt =
              timeDistance === "1 minute" ? "Just now" : timeDistance + " ago";

            const fullDate =
              createdAtDate.getFullYear() !== new Date().getFullYear()
                ? format(createdAtDate, "MMM d, yyyy")
                : formattedCreatedAt;

            return (
              <div key={post._id} className="post">
                {/* Render Post Data */}
                <div className="post-header">
                  <h3>Message: {post.message}</h3>
                  <p>Visibility: {post.visibility}</p>
                  <p>Created At: {fullDate}</p>
                </div>
                <div className="post-body">
                  {post.images.length > 0 ? (
                    <div className="images">
                      {/* Render post images */}
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post Image ${index}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <p>No images for this post.</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePost;
