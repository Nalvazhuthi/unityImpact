import React, { useEffect, useState } from "react";
import { Emoji } from "../../assets/images/svgExports";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react"; // Corrected import
import { useUser } from "../../store/UserProvider";

const CreatePost = ({ onPostCreated }) => {
  const { userData } = useUser();  // Access the global user data

  const [visibility, setVisibility] = useState("public");
  const [uploadedAssets, setUploadedAssets] = useState({
    images: [],
    videos: [],
  });
  const [message, setMessage] = useState("");
  const [emojiPopupVisible, setEmojiPopupVisible] = useState(false); // State to control emoji picker visibility

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Append selected emoji to the message
    // setEmojiPopupVisible(false); // Hide the emoji picker after selecting an emoji
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleAssetUpload = async (event, assetType) => {
    const files = event.target.files;
    const newAssets = [];

    for (let file of files) {
      if (assetType === "images" && file.type.startsWith("image")) {
        const base64Image = await convertToBase64(file);
        newAssets.push(base64Image);
      } else if (assetType === "videos" && file.type.startsWith("video")) {
        newAssets.push(URL.createObjectURL(file));
      }
    }

    setUploadedAssets((prevAssets) => ({
      ...prevAssets,
      [assetType]: [...prevAssets[assetType], ...newAssets],
    }));
  };

  const handleAssetRemove = (assetType, assetUrl) => {
    setUploadedAssets((prevAssets) => ({
      ...prevAssets,
      [assetType]: prevAssets[assetType].filter((url) => url !== assetUrl),
    }));
  };

  // Handle the "Post" button click
  const handlePostSubmit = async () => {
    if (
      message.trim() === "" &&
      uploadedAssets.images.length === 0 &&
      uploadedAssets.videos.length === 0
    ) {
      alert("Your post cannot be empty. Please add some content.");
      return;
    }

    const post = {
      message,
      visibility,
      images: uploadedAssets.images,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/createPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensures cookies are sent
        body: JSON.stringify(post),
      });

      console.log("response", response);
      const data = await response.json();

      if (response.ok) {
        toast.success("Post created successfully");
        onPostCreated(data.post); // Pass the created post back to the parent component
        setMessage("");
        setUploadedAssets({ images: [], videos: [] }); // Clear form after posting
      } else {
        console.error("Error from server:", data.error || "Unknown error");
        alert(data.error || "An error occurred while creating the post.");
      }
    } catch (error) {
      console.error("An error occurred while creating the post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  const isPostDisabled =
    message.trim() === "" &&
    uploadedAssets.images.length === 0 &&
    uploadedAssets.videos.length === 0;



  useEffect(() => {
    // Function to close the emoji popup when clicking outside
    const handleClickOutside = (event) => {
      // Check if the click target is outside the elements with the specified class names
      const emojiPopup = document.querySelector('.emoji');
      const button = document.querySelector('.emoji-popup');

      if (
        emojiPopup && !emojiPopup.contains(event.target) &&
        button && !button.contains(event.target)
      ) {
        setEmojiPopupVisible(false);  // Close the popup if clicked outside
      }
    };

    // Add event listener to handle clicks outside the popup
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener when component is unmounted or re-rendered
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);



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
          <div
            className="emoji"
            onClick={() => setEmojiPopupVisible(!emojiPopupVisible)}
          >
            <Emoji />
          </div>

          {/* Emoji picker popup */}
          {emojiPopupVisible && (
            <div className="emoji-popup">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>

      <div className="create-post-content">
        <div className="create-post-content-wrapper">
          <div className="create-post-content flex-sb">
            <button
              className="create-post-image-container"
              onClick={() =>
                document.getElementById("image-upload-input").click()
              }
            >
              Image
            </button>
            <button
              className="create-post-video-container"
              onClick={() =>
                document.getElementById("video-upload-input").click()
              }
            >
              Video
            </button>
          </div>

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

        {(uploadedAssets.images.length > 0 ||
          uploadedAssets.videos.length > 0) && (
            <div className="uploadedAssetPreview">
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

      <button onClick={handlePostSubmit} disabled={isPostDisabled}>
        Post
      </button>
    </div>
  );
};

export default CreatePost;
