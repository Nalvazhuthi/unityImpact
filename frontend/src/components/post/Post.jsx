import React from "react";
import { formatDistanceToNow, format } from "date-fns";
import defaultImage from "../../assets/images/temp/blankUser.png";
import toast from "react-hot-toast";

const Post = ({ post, onPostDeleted }) => {

  const createdAtDate = new Date(post.createdAt);
  let timeDistance = formatDistanceToNow(createdAtDate);

  timeDistance = timeDistance.replace(/^about /, '');
  const formattedCreatedAt = timeDistance === "1 minute" ? "Just now" : timeDistance + " ago";

  const fullDate = createdAtDate.getFullYear() !== new Date().getFullYear()
    ? format(createdAtDate, 'MMM d, yyyy')
    : formattedCreatedAt;

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:4100/user/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": ``, // If you're using JWT auth
        },
        credentials: "include", // Ensure cookies are included if using sessions
      });

      const data = await response.json();

      if (response.ok) {

        // Call the parent callback function to update the state
        onPostDeleted(postId);
        toast.success("Post deleted successfully")

      } else {

      }
    } catch (error) {

    }
  };

  return (
    <div className="post-wrapper">
      <div className="post-header">
        <div className="post-header-wrapper flex-sb">
          <div className="img-container">
            <img src={post.userId.profileImage || defaultImage} alt="" />
          </div>
          <div className="userDeails">
            <p>{post.userId.fullName}</p>
            <p>{fullDate}</p>
          </div>
        </div>

        <div className="delete" onClick={() => deletePost(post._id)}>
          Delete
        </div>
      </div>
      <div className="post-body">
        <p className="message">{post.message}</p>
        <div className="post-images">
          {post.images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Post Image ${index + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
