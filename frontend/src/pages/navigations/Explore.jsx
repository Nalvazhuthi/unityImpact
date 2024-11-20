import React, { useEffect, useState } from 'react';
import SideBar from '../../components/sidebar/SideBar';
import Post from '../../components/post/Post';

const Explore = ({ nearbyEntities, userData }) => {
    let [allPosts, setAllPosts] = useState([]);

    const handleFetchpost = async () => {
        try {
            const response = await fetch("http://localhost:4100/user/allPosts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Ensure cookies are sent with the request
            });

            const data = await response.json();

            if (response.ok) {
                setAllPosts(data.posts);
            } else {
                console.error(data.error); // "Logout error"
            }
        } catch (error) {
            console.error("An error occurred while fetching posts:", error);
        }
    };

    useEffect(() => {
        handleFetchpost();
    }, []);

    return (
        <div className="explore-wrapper">
            <SideBar userData={userData} nearbyEntities={nearbyEntities} />
            <div className="explorePosts-wrapper">
                {allPosts.map((post) => (
                    <Post key={post._id} post={post} />  // Added the return and key prop
                ))}
            </div>
        </div>
    );
};

export default Explore;
