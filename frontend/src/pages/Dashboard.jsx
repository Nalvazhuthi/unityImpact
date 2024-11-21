import React, { useEffect, useState } from "react";
import SideBar from "../components/sidebar/SideBar";
import RequestsSideBar from "../components/sidebar/RequestsSideBar";
import { useNavigate } from "react-router-dom";
import Profile from "./navigations/Profile";
import defaultUser from "..//assets/images/temp/blankUser.png";
import Navigation from "./navigation/Navigation";
import HomePage from "./navigations/HomePage";
import Explore from "./navigations/Explore";
import ProfilePost from "./navigations/ProfilePost";
import { useUser } from "../store/UserProvider";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [nav, setNav] = useState("home");
  const [nearbyEntities, setNearbyEntities] = useState([]);
  const [selecteduser, setSelectedUser] = useState("");
  const [userPosts, setUserPosts] = useState([]); // Ensure it's initialized as an empty array
  const { userData, setUserData } = useUser();  // Access the global user data

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:4100/auth/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }
        const updatedData = {
          ...data,
          profileImage: data.profileImage || defaultUser,
        };

        setUserData(updatedData);
      } catch (error) {
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch nearby entities based on user type
  useEffect(() => {
    const fetchNearbyEntities = async () => {
      try {
        const res = await fetch("http://localhost:4100/user/nearMe", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setNearbyEntities(data);
        }
      } catch (error) {

      }
    };

    fetchNearbyEntities();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Function to fetch user posts
  const fetchSelectedUserPosts = async () => {
    if (!selecteduser) return; // Prevent API call if no user is selected

    try {
      const response = await fetch(`http://localhost:4100/user/profile/${selecteduser}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials if needed (cookies or token)
      });

      if (response.ok) {
        const data = await response.json();
        setUserPosts(data); // Assuming your response contains a 'posts' array
      }
    } catch (error) {

    }
  };

  useEffect(() => {
    // Log selected user before fetching posts
    fetchSelectedUserPosts();

  }, [selecteduser]); // Re-fetch posts whenever selecteduser changes

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navigation nav={nav} setNav={setNav} userData={userData} />
      <div className="navigations-result">
        <SideBar
          setNav={setNav}
          userData={userData}
          nearbyEntities={nearbyEntities}
          setSelectedUser={setSelectedUser}
          userPosts={userPosts}
        />
        {nav === "home" && (
          <HomePage
            userPosts={userPosts}
            setNav={setNav}
            userData={userData}
            nearbyEntities={nearbyEntities}
            setSelectedUser={setSelectedUser}
          />
        )}

        {nav === "profilePost" && (
          <ProfilePost
            setNav={setNav}
            userPosts={userPosts}
          />
        )}
        {nav === "profile" && <Profile userData={userData} nearbyEntities={nearbyEntities} />}
        {nav === "explore" && <Explore userData={userData} nearbyEntities={nearbyEntities} />}
      </div>
    </div>
  );
};

export default Dashboard;



