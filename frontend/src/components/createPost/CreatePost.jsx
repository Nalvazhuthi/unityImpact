import React, { useState } from "react";

const CreatePost = ({ userData, onPostCreated }) => {
  // State to handle the dropdown value (visibility)
  const [visibility, setVisibility] = useState("public");

  // State to store uploaded assets (images, videos, etc.)
  const [uploadedAssets, setUploadedAssets] = useState({
    images: [],
    videos: [],
  });

  // State to store the text message of the post
  const [message, setMessage] = useState("");

  // Handle dropdown change for visibility
  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  // Handle text input change (message)
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Handle file input change (multiple image or video uploads)
  const handleAssetUpload = (event, assetType) => {
    const files = event.target.files; // Get all selected files
    const newAssets = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    ); // Create object URLs for each file

    setUploadedAssets((prevAssets) => {
      return {
        ...prevAssets,
        [assetType]: [...prevAssets[assetType], ...newAssets],
      };
    });
  };

  // Handle asset removal (image or video)
  const handleAssetRemove = (assetType, assetUrl) => {
    setUploadedAssets((prevAssets) => ({
      ...prevAssets,
      [assetType]: prevAssets[assetType].filter((url) => url !== assetUrl),
    }));
  };

  // Handle the "Post" button click
  const handlePostSubmit = () => {
    const post = {
      message,
      visibility,
      images: uploadedAssets.images,
      videos: uploadedAssets.videos,
      createdAt: new Date().toISOString(),
    };

    // Pass the post data to the parent component (Post component)
    onPostCreated(post);

    // Clear form after posting (optional)
    setMessage("");
    setUploadedAssets({ images: [], videos: [] });
  };

  return (
    <div className="createPost-wrapper">
      <div className="createPost-header">
        <div className="img-container">
          <img src={userData.profileImage} alt="User" />
        </div>
        <div className="message">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={message}
            onChange={handleMessageChange}
          />
          <div className="emoji">Emoji</div>
        </div>
      </div>

      <div className="create-post-content">
        <div className="create-post-content-wrapper">
          <div className="create-post-content flex-sb">
            {/* Image Upload Section */}
            <div
              className="create-post-image-container"
              onClick={() =>
                document.getElementById("image-upload-input").click()
              }
            >
              Upload Image
            </div>

            {/* Video Upload Section */}
            <div
              className="create-post-video-container"
              onClick={() =>
                document.getElementById("video-upload-input").click()
              }
            >
              Upload Video
            </div>

            {/* Poll Upload Section (if needed) */}
            {/* <div className="create-post-poll-container">Create Poll</div> */}
          </div>

          {/* Hidden File Inputs */}
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            onChange={(event) => handleAssetUpload(event, "images")}
            className="image-upload-input"
            multiple
            style={{ display: "none" }}
          />
          <input
            id="video-upload-input"
            type="file"
            accept="video/*"
            onChange={(event) => handleAssetUpload(event, "videos")}
            className="video-upload-input"
            multiple
            style={{ display: "none" }}
          />

          {/* Dropdown for Post Visibility selection */}
          <div className="post-visibility-selector">
            <select
              id="visibility-dropdown"
              className="visibility-dropdown"
              value={visibility}
              onChange={handleVisibilityChange}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        {/* Asset Previews (Images and Videos) */}
        {console.log("uploadedAssets", uploadedAssets)}
        {(uploadedAssets.images.length > 0 ||
          uploadedAssets.videos.length > 0) && (
          <div className="uploadedAssetPreview">
            {/* Image Previews */}
            {uploadedAssets.images.length > 0 && (
              <div className="image-preview-container">
                {uploadedAssets.images.map((imageUrl, index) => (
                  <div key={index} className="image-preview-item">
                    <img
                      src={imageUrl}
                      alt={`Uploaded Image ${index + 1}`}
                      className="image-preview"
                    />
                    <button
                      className="remove-image-btn"
                      onClick={() => handleAssetRemove("images", imageUrl)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Video Previews */}
            {uploadedAssets.videos.length > 0 && (
              <div className="video-preview-container">
                {uploadedAssets.videos.map((videoUrl, index) => (
                  <div key={index} className="video-preview-item">
                    <video src={videoUrl} controls className="video-preview" />
                    <button
                      className="remove-video-btn"
                      onClick={() => handleAssetRemove("videos", videoUrl)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <button onClick={handlePostSubmit}>Post</button>
    </div>
  );
};

export default CreatePost;
