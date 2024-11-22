import React, { useEffect, useState } from "react";
import defaultImage from "../../assets/images/temp/blankUser.png";
import CreatePost from "../../components/createPost/CreatePost";
import Post from "../../components/post/Post";
import SideBar from "../../components/sidebar/SideBar";

const HomePage = ({ userPosts, userData, setNav, nearbyEntities, setSelectedUser }) => {
  const [posts, setPosts] = useState([]);

  // Function to handle post creation
  const handlePostCreated = (newPost) => {
    // Optimistic update or fetch the posts again
    setPosts((prevPosts) => [newPost, ...prevPosts]); // This ensures the new post is displayed
  };

  // Function to handle post deletion (update state after delete)
  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  // Function to fetch posts of users you follow
  const fetchFollowingUsersPost = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/followingPost`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      console.log("API Response:", typeof data);

      if (response.ok) {
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error("Posts is not an array:", data.posts);
        }
      } else {
        console.error("Error from server:", data.error);
      }
    } catch (error) {
      console.error("An error occurred while fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchFollowingUsersPost();
  }, []);


  return (
    <div className="homePage-wrapper">
      <div className="content">
        <CreatePost userData={userData} onPostCreated={handlePostCreated} />
        <div className="homePage-post-wrapper">
          {posts?.map((post, index) => (
            <Post
              setSelectedUser={setSelectedUser}
              key={index}
              post={post}
              onPostDeleted={handlePostDeleted} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;



