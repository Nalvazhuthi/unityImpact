import React, { useState } from "react";
import toast from "react-hot-toast"; // Import toast for notifications
import { EditIconDefault } from "../../assets/images/svgExports";

const Settings = ({ userData }) => {
  const { fullName, email, bio, location, profileImage } = userData;

  const [isEditing, setIsEditing] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for showing the popup

  const [editedData, setEditedData] = useState({
    fullName,
    email,
    bio,
    location,
    profileImage,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleEditClick = () => setIsEditing(!isEditing);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
        setEditedData((prevData) => ({
          ...prevData,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const updatedLocation = editedData.location
        ? {
            type: "Point",
            coordinates: editedData.location.coordinates || [0, 0],
          }
        : null;

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/edituserData`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...editedData,
            location: updatedLocation,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/changepassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully");
        setChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to change password");
      console.error(error);
    }
  };

  return (
    <div className="settings-container">
      {/* Profile Picture Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageFile || profileImage || "default-image-path"}
              alt="Profile"
              className="popup-image"
            />
          </div>
        </div>
      )}

      <div className="profile-section">
        <div className="image-container">
          <img
            src={imageFile || profileImage || "default-image-path"}
            alt="Profile"
            className="profile-image"
            onClick={() => setShowPopup(true)} // Open popup on click
          />
          {isEditing && (
            <label htmlFor="file-upload" className="edit-image-label">
              <EditIconDefault />
              <input
                type="file"
                id="file-upload"
                onChange={handleImageChange}
                accept="image/*"
                className="file-input"
              />
            </label>
          )}
        </div>
        <div className="details">
          {isEditing ? (
            <input
              type="text"
              value={editedData.fullName}
              onChange={(e) =>
                setEditedData({ ...editedData, fullName: e.target.value })
              }
              className="input-field"
            />
          ) : (
            <h2>{editedData.fullName}</h2>
          )}
          {isEditing ? (
            <input
              type="email"
              value={editedData.email}
              onChange={(e) =>
                setEditedData({ ...editedData, email: e.target.value })
              }
              className="input-field"
            />
          ) : (
            <p>{editedData.email}</p>
          )}
        </div>
      </div>
      <div className="password-section">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {passwordError && <p className="error">{passwordError}</p>}
        <button onClick={handleChangePassword}>Update Password</button>
      </div>
      <div className="actions">
        {isEditing ? (
          <button onClick={handleSaveChanges}>Save Changes</button>
        ) : (
          <button onClick={handleEditClick}>Edit Profile</button>
        )}
        <button className="logout">Log Out</button>
      </div>
    </div>
  );
};

export default Settings;
