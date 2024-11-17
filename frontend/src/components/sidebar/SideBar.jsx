import React, { useState, useEffect } from "react";
import defaultUser from "../../assets/images/temp/blankUser.png";

const SideBar = ({ userData }) => {
  const [nearbyEntities, setNearbyEntities] = useState([]); // Stores nearby entities (organizations/volunteers)

  // Fetch nearby entities based on user type
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
        setNearbyEntities(data); // Update the nearbyEntities state
      } else {
        console.error("Failed to fetch nearby entities");
      }
    } catch (error) {
      console.error("Error fetching nearby entities:", error);
    }
  };

  // Fetch nearby entities when the component mounts
  useEffect(() => {
    fetchNearbyEntities();
  }, []); // Empty dependency array ensures this runs once on component mount

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4100/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // "Logout successful"
        localStorage.removeItem("token");
        window.location.href = "/"; // Redirect to login page
      } else {
        console.error(data.error); // "Logout error"
      }
    } catch (error) {
      console.error("An error occurred while logging out:", error);
    }
  };

  return (
    <div className="sideBar-container flex-sb">
      <div className="userDetails">
        <div className="details">
          <div className="fullName">{userData.fullName}</div>
          <div className="email">{userData.email}</div>
          <div className="type">{userData.type}</div>
        </div>
      </div>

      <div className="navigations">
        <nav>Feeds</nav>
        <nav>Explore</nav>
      </div>

      <div className="nearByRelatedOrganisation">
        <h3>
          {userData.type === "volunteer"
            ? "Nearby Organizations"
            : "Nearby Volunteers"}
        </h3>
        {nearbyEntities.length > 0 ? (
          <div className="entity-info-wrapper">
            {nearbyEntities.map((entity) => (
              <div className="entity-info" key={entity._id}>
                <img
                  src={entity.profileImage || defaultUser}
                  alt={entity.fullName}
                  className="entity-image"
                />
                <div className="entity-details">
                  <div className="entity-name">{entity.fullName}</div>
                  <div className="entity-email">{entity.email}</div>
                  <div className="entity-location">{entity.address}</div>
                </div>

                <button className="invite-btn">
                  {userData.type === "volunteer" ? "Follow" : "Invite"}
                </button>

                {/* Removed the invitation buttons */}
              </div>
            ))}
          </div>
        ) : (
          <p>No nearby entities found.</p>
        )}
      </div>

      <div className="logout" onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
};

export default SideBar;
