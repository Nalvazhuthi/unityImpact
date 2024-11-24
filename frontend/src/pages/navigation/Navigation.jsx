import React, { useState } from "react";
import {
    ChatIcon,
    ExploreIcon,
    Hamburger,
    HomeIcon,
    Logout,
    NotificationIcon,
    SettingsIcon,
} from "../../assets/images/svgExports";
import defaultImage from "../../assets/images/temp/blankUser.png";

const Navigation = ({ nav, setNav, userData, sideBarOpen, setSideBarOpen }) => {
    const [openNav, setOpenNav] = useState(false)
    // Function to handle the click event and set the active navigation item
    const handleNavClick = (nav) => {
        setNav(nav);
    };
    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
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
            <div className="sideBarOpen" onClick={() => setSideBarOpen(!sideBarOpen)}>Sidebar</div>
            <div className="logo">LOGO</div>
            <div className={`navigate ${openNav ? "navOpen" : "navClose"}`}>
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
                    className={`nav ${nav === "settings" ? "active" : ""}`}
                    onClick={() => handleNavClick("settings")}
                >
                    <SettingsIcon fill={nav === "settings" ? "#ffffff" : "#292D32"} />
                    <span>SETTINGS</span>
                </span>
                <span
                    className={`logout nav ${nav === "logout" ? "active" : ""}`}
                    onClick={() => {
                        setNav("logout");
                        handleLogout(); // Correctly calling the function here
                    }}
                >
                    <Logout fill={nav === "logout" ? "#ffffff" : "#292D32"} />
                    <span>Logout</span>
                </span>
            </div>

            <button onClick={handleLogout}>
                <div className="logout">Logout</div>
                <div className="icon"><Logout fill={"#ffffff"} /></div>
            </button>
            <div className="hamburger" onClick={() => setOpenNav(!openNav)}><Hamburger /></div>

        </div>
    );
};

export default Navigation;



