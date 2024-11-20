import React from "react";
import defaultImage from "../../assets/images/temp/blankUser.png";

const SideBar = ({ setNav, userData, nearbyEntities }) => {
  return (
    <div className="leftSideWrapper">
      <div className="userDetails flex">
        <div className="userImage">
          <img src={userData.profileImage} alt="User Profile" />
        </div>
        <div className="userDetail flex">
          <div className="userFullName">{userData.fullName}</div>
          <div className="userEmail">{userData.email}</div>
        </div>
        <div className="userType">{userData.type}</div>
        <button onClick={() => setNav("profilePost")}>My Profile</button>
      </div>

      <div className="nearByUserDetails flex">
        <h1>
          Near by{" "}
          {userData.type === "volunteer" ? "Organization" : "Volunteers"}
        </h1>

        {/* Check if nearbyEntities has items */}
        {nearbyEntities && nearbyEntities.length > 0 ? (
          nearbyEntities.map((entity) => (
            <div key={entity.id} className="entitiers-wrapper">
              <div className="image-wrapper">
                <img
                  src={entity.profileImage || defaultImage}
                  alt={entity.fullName}
                />
              </div>
              <div className="entity">
                <div className="userName">{entity.fullName}</div>
                <div className="userEmail">{entity.bio}</div>
              </div>
              <button>
                {userData.type === "volunteer" ? "Follow" : "Invite"}
              </button>
            </div>
          ))
        ) : (
          <p>No nearby entries</p>
        )}
      </div>
    </div>
  );
};

export default SideBar;
