import React, { useState } from "react";
import {
    ChatIcon,
    ExploreIcon,
    HomeIcon,
    Logout,
    NotificationIcon,
    SettingsIcon,
} from "../../assets/images/svgExports";
import defaultImage from "../../assets/images/temp/blankUser.png";

const Navigation = ({ nav, setNav, userData }) => {
    // Function to handle the click event and set the active navigation item
    const handleNavClick = (nav) => {
        setNav(nav);
    };
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
        <div className="navigation-wrapper">
            <div className="logo">LOGO</div>
            <div className="navigate">
                <span
                    className={`nav ${nav === "home" ? "active" : ""}`}
                    onClick={() => handleNavClick("home")}
                >
                    <HomeIcon fill={nav === "home" ? "#ffffff" : "#292D32"} />
                    <span>HOME</span>
                </span>
                <span
                    className={`nav ${nav === "explore" ? "active" : ""}`}
                    onClick={() => handleNavClick("explore")}
                >
                    <ExploreIcon fill={nav === "explore" ? "#ffffff" : "#292D32"} />
                    <span>EXPLORE</span>
                </span>
                <span
                    className={`nav ${nav === "chat" ? "active" : ""}`}
                    onClick={() => handleNavClick("chat")}
                >
                    <ChatIcon fill={nav === "chat" ? "#ffffff" : "#292D32"} />
                    <span>CHAT</span>
                </span>
                <span
                    className={`nav ${nav === "notification" ? "active" : ""}`}
                    onClick={() => handleNavClick("notification")}
                >
                    <NotificationIcon
                        fill={nav === "notification" ? "#ffffff" : "#292D32"}
                    />
                    <span>NOTIFICATION</span>
                </span>
                <span
                    className={`nav ${nav === "profile" ? "active" : ""}`}
                    onClick={() => handleNavClick("profile")}
                >
                    <SettingsIcon fill={nav === "profile" ? "#ffffff" : "#292D32"} />
                    <span>SETTINGS</span>
                </span>
            </div>

            {/* <div className="userDetails">
        <div className="profileImage">
          <img src={userData.profileImage || defaultImage} alt="profile" />
        </div>
        <div className="userName">{userData.fullName}</div>
      </div> */}
            <button onClick={handleLogout}>
                <div className="logout">Logout</div>
                <div className="icon"><Logout /></div>
            </button>
        </div>
    );
};

export default Navigation;
