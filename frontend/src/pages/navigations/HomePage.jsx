import React, { useEffect, useState } from "react";
import defaultImage from "../../assets/images/temp/blankUser.png";
import CreatePost from "../../components/createPost/CreatePost";
import Post from "../../components/post/Post";
import SideBar from "../../components/sidebar/SideBar";

const HomePage = ({ userData, setNav, nearbyEntities }) => {
  const [posts, setPosts] = useState([]);

  // Function to handle post creation
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Function to handle post deletion (update state after delete)
  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  // Function to fetch posts of users you follow
  const fetchFollowingUsersPost = async () => {
    try {
      const response = await fetch("http://localhost:4100/user/followingPost", {
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
      <SideBar
        setNav={setNav}
        userData={userData}
        nearbyEntities={nearbyEntities}
      />

      <div className="content">
        <CreatePost userData={userData} onPostCreated={handlePostCreated} />
        <div className="homePage-post-wrapper">
          {posts?.map((post, index) => (
            <Post key={index} post={post} onPostDeleted={handlePostDeleted} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
