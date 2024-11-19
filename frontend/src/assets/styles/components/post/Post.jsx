import React from "react";

const Post = ({ post }) => {
  return (
    <div className="post">
      <div className="post-header">
        <h3>{post.visibility === "public" ? "Public" : "Private"} Post</h3>
        <p>{post.createdAt}</p>
      </div>
      <div className="post-body">
        <p>{post.message}</p>
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
