import React, { useEffect, useState } from "react";
import SideBar from "../components/sidebar/SideBar";
import Post from "../assets/styles/components/post/Post";
import RequestsSideBar from "../components/sidebar/RequestsSideBar";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Profile from "./navigations/Profile";
import defaultUser from '..//assets/images/temp/blankUser.png'
import Navigation from "./navigation/Navigation";
import HomePage from "./navigations/HomePage";

const Dashboard = ({ }) => {
  const navigate = useNavigate(); // Initialize navigate hook

  const [userData, setUserData] = useState(null); // Store the user data
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const [nav, setNav] = useState("home")
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:4100/auth/me", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        });

        const data = await res.json();

        if (!res.ok) {
          // If the response is not OK, throw an error
          throw new Error(data.error || "Failed to fetch user data");
        }
        const updatedData = {
          ...data,
          profileImage: data.profileImage || defaultUser, // Use the default image if not set
        };

        console.log('Fetched user data: ', updatedData);
        setUserData(updatedData); // Update the state with the user data

      } catch (error) {
        navigate("/");
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false); // Stop loading state when the request is done
      }
    };

    fetchUserData();
    // Call the function to fetch user data when component mounts
  }, []);

  // Handle loading state and conditionally render the app
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* <SideBar userData={userData} setNav={setNav} nav={nav} /> */}
      <Navigation nav={nav} setNav={setNav} userData={userData} />
      {/* <Post /> */}
      <div className="navigations-result">

        {nav === "home" && <HomePage userData={userData} />}
        {nav === "profile" && <Profile userData={userData} />}
      </div>
      {/* </div> */}
    </div>
  );
};

export default Dashboard;

// when app start if auth/me is fetch open directly dashborad else open auth
