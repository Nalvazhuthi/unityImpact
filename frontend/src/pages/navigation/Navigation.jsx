import React, { useState } from 'react';
import { ChatIcon, ExploreIcon, HomeIcon, NotificationIcon, SettingsIcon } from '../../assets/images/svgExports';
import defaultImage from '../../assets/images/temp/blankUser.png'

const Navigation = ({ nav, setNav, userData }) => {

    // Function to handle the click event and set the active navigation item
    const handleNavClick = (nav) => {
        setNav(nav);
    };

    return (
        <div className='navigation-wrapper'>
            <div className="logo">
                LOGO
            </div>
            <div className="navigate">
                <span
                    className={`nav ${nav === 'home' ? 'active' : ''}`}
                    onClick={() => handleNavClick('home')}>
                    <HomeIcon /><span>HOME</span>
                </span>
                <span
                    className={`nav ${nav === 'explore' ? 'active' : ''}`}
                    onClick={() => handleNavClick('explore')}>
                    <ExploreIcon /><span>EXPLORE</span>
                </span>
                <span
                    className={`nav ${nav === 'chat' ? 'active' : ''}`}
                    onClick={() => handleNavClick('chat')}>
                    <ChatIcon /><span>CHAT</span>
                </span>
                <span
                    className={`nav ${nav === 'notification' ? 'active' : ''}`}
                    onClick={() => handleNavClick('notification')}>
                    <NotificationIcon /><span>NOTIFICATION</span>
                </span>
                <span
                    className={`nav ${nav === 'profile' ? 'active' : ''}`}
                    onClick={() => handleNavClick('profile')}>
                    <SettingsIcon /><span>SETTINGS</span>
                </span>
            </div>

            <div className="userDetails">
                <div className="profileImage">
                    <img src={userData.profileImage || defaultImage} alt="profile" />
                </div>
                <div className="userName">{userData.fullName}</div>
            </div>

        </div>
    );
}

export default Navigation;


