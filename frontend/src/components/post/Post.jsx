import React, { useState, useEffect } from "react";
import { formatDistanceToNow, format } from "date-fns";
import defaultImage from "../../assets/images/temp/blankUser.png";
import toast from "react-hot-toast";
import { useUser } from "../../store/UserProvider";
import { Comment, Delete, Like, Send } from "../../assets/images/svgExports";

const Post = ({ post, setNav, setSelectedUser, onPostDeleted }) => {
  const { userData } = useUser(); // Access the global user data

  let [deleteConfimation, setDeleteConfimation] = useState(false);
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(""); // State to track new comment input
  const [commentCount, setCommentCount] = useState(post.comments.length); // State to track comment count
  const [showComments, setShowComments] = useState(false); // State to track visibility of comments
  const createdAtDate = new Date(post.createdAt);
  let timeDistance = formatDistanceToNow(createdAtDate);

  timeDistance = timeDistance.replace(/^about /, "");
  const formattedCreatedAt =
    timeDistance === "1 minute" ? "Just now" : timeDistance + " ago";

  const fullDate =
    createdAtDate.getFullYear() !== new Date().getFullYear()
      ? format(createdAtDate, "MMM d, yyyy")
      : formattedCreatedAt;

  const deletePost = async (postId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/delete/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies are included if using sessions
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Call the parent callback function to update the state
        onPostDeleted(postId);
        toast.success("Post deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete post");
      }
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  // State to track the number of likes
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [liked, setLiked] = useState(post.likes.includes(userData._id)); // Track if the current user has liked the post

  const likeDislike = async (id) => {
    try {
      // Optimistic update: immediately update the UI
      setLiked(!liked); // Toggle liked state
      setLikesCount(liked ? likesCount - 1 : likesCount + 1); // Update the like count

      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/likeDisLike/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Server responded successfully, keep the optimistic update
        toast.success("Post liked successfully");
      } else {
        // If the server fails, revert the UI update
        setLiked(liked);
        setLikesCount(liked ? likesCount + 1 : likesCount - 1);
        toast.error(result.message || "Failed to update like");
      }
    } catch (error) {
      // If an error occurs, revert the UI update
      setLiked(liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
      toast.error("Error while liking the post");
    }
  };

  // Fetch comments when the post is rendered or updated
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/comment/${post._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to fetch comments");
        return;
      }

      setComments(data.post.comments);
      setCommentCount(data.post.comments.length); // Update the comment count
    } catch (error) {
      toast.error("Error fetching comments");
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/comment/${post._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
          credentials: "include",
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        // Add the new comment to the state, including the full user details.
        const updatedComment = data.post.comments[0]; // Newly added comment
        setComments([updatedComment, ...comments]); // Add to the top of the comment list
        setNewComment(""); // Clear the input field
        setCommentCount(commentCount + 1); // Increment the comment count
        toast.success("Comment added successfully");
      } else {
        toast.error(data.message || "Failed to add comment");
      }
    } catch (error) {
      toast.error("Error adding comment");
    }
    fetchComments()
  };
  

  return (
    <div className="post-wrapper">
      <div className="post-header">
        <div className="post-header-wrapper flex-sb">
          <div
            className="img-container"
            onClick={() => {
              setSelectedUser(post.userId?._id); // Ensure post.userId exists
              setNav("profilePost");
            }}
          >
            <img
              src={post.userId?.profileImage || defaultImage} // Use defaultImage if profileImage is missing
              alt={post.userId?.fullName || "User"} // Use default text if fullName is missing
            />
          </div>
          <div className="userDeails">
            <p>{post.userId?.fullName || "Unknown User"}</p>{" "}
            {/* Fallback text */}
            <p>{fullDate}</p>
          </div>
        </div>

        {userData._id === post.userId._id && (
          <div className="delete" onClick={() => setDeleteConfimation(true)}>
            <Delete />
          </div>
        )}

        {deleteConfimation && (
          <div className="confimationPopUp-wrapper">
            <div className="confimationPopUp">
              Are you sure want to delete the post
              <div className="buttonContainer">
                <button onClick={() => setDeleteConfimation(false)}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deletePost(post._id);
                    setDeleteConfimation(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="post-body">
        <p className="message">{post.message}</p>
        <div className="post-images">
          {post.images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Post Image ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className="likeComment-wrapper">
        <div
          className={`like ${liked && "active"}`}
          onClick={() => likeDislike(post._id)}
        >
          {/* Correct the fill color logic based on the liked state */}
          <Like fill={liked ? "red" : "black"} />{" "}
          {likesCount > 0 && `(${likesCount})`}
        </div>
        <div
          onClick={() => {
            setShowComments(!showComments);
            if (!showComments) {
              fetchComments(); // Fetch comments if showing them
            }
          }}
        >
          <Comment /> ({commentCount})
        </div>
      </div>
      {/* sowcomments */}
      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="add-comment">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <div className="send" onClick={() => addComment(post._id)}>
              <Send />
            </div>
          </div>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-user">
                  <div className="img-container">
                    <img
                      src={comment.userId.profileImage || defaultImage}
                      alt=""
                    />
                  </div>
                  <div className="userDetails">
                    <p>{comment.userId.fullName}</p>
                    <p className="comment-time">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </p>
                  </div>
                </div>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;

// when user post a comment the posted user profile image and image not showing immediatly only when user refresh the page only it updaating solve that issue after user refresh the user name and imapge updated 

