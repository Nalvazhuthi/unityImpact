import React, { useEffect, useState } from 'react';
import defaultImage from '../../assets/images/temp/blankUser.png'
const HomePage = ({ userData }) => {
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

    useEffect(() => {
        fetchNearbyEntities();
    }, []);

    return (
        <div className='homePage-wrapper'>
            <div className="leftSideWrapper">
                <div className="userDetails flex">
                    <div className="userImage">
                        <img src={userData.profileImage} alt="" />
                    </div>
                    <div className="userDetail flex">
                        <div className="userFullName">{userData.fullName}</div>
                        <div className="userEmail">{userData.email}</div>
                    </div>
                    <div className="userType">{userData.type}</div>
                    <button>My Profile</button>
                </div>

                <div className="nearByUserDetails flex">
                    {/* Here you can map over the nearbyEntities and display them */}
                    <h1>Near by {userData.type == "volunteer" ? "Organization" : "Volunteers"}</h1>
                    {nearbyEntities.map(entity => (
                        <div className="entitiers-wrapper">
                            <div className="image-wrapper">
                                <img src={entity.profileImage || defaultImage} alt="" />
                            </div>
                            <div key={entity.id} className="entity">
                                <div className='userName'>{entity.fullName}</div>
                                <div className='userEmail'>{entity.bio}</div>
                            </div>
                            <button>{userData.type == "volunteer" ? "Follow" : "Invite"}</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="content"></div>
        </div>
    );
}

export default HomePage;



