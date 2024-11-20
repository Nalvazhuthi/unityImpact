import React, { useEffect, useState } from "react";
import SideBar from "../components/sidebar/SideBar";
import RequestsSideBar from "../components/sidebar/RequestsSideBar";
import { useNavigate } from "react-router-dom";
import Profile from "./navigations/Profile";
import defaultUser from '..//assets/images/temp/blankUser.png';
import Navigation from "./navigation/Navigation";
import HomePage from "./navigations/HomePage";
import Explore from "./navigations/Explore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nav, setNav] = useState("home");
  const [nearbyEntities, setNearbyEntities] = useState([]);

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
        console.error("Error fetching user data:", error);
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
        } else {
          console.error("Failed to fetch nearby entities");
        }
      } catch (error) {
        console.error("Error fetching nearby entities:", error);
      }
    };

    fetchNearbyEntities();
  }, []); // Empty dependency array ensures this runs only once on mount

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
        {nav === "home" && <HomePage userData={userData} nearbyEntities={nearbyEntities} />}
        {nav === "profile" && <Profile userData={userData} nearbyEntities={nearbyEntities} />}
        {nav === "explore" && <Explore userData={userData} nearbyEntities={nearbyEntities} />}
      </div>
    </div>
  );
};

export default Dashboard;
