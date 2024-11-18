import React, { useState } from 'react';
import toast from 'react-hot-toast';  // Import toast for notifications
import { EditIconDefault } from '../../assets/images/svgExports';

const Profile = ({ userData }) => {
    const { fullName, email, bio, location, profileImage } = userData;

    // State to toggle between view and edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    // State for editable profile data
    const [editedData, setEditedData] = useState({
        fullName,
        email,
        bio,
        location,
        profileImage,  // Include profileImage field
    });

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [imageFile, setImageFile] = useState(null);  // State for holding the selected image

    // Handler to toggle edit mode
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    // Handler for profile image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result);  // Store the Base64 string in state
                setEditedData((prevData) => ({
                    ...prevData,
                    profileImage: reader.result,  // Update the profileImage field in editedData
                }));
            };
            reader.readAsDataURL(file);  // Convert the image to Base64
        }
    };

    // Handle profile update
    const handleSaveChanges = async () => {
        try {
            const updatedLocation = editedData.location ? {
                type: "Point",
                coordinates: editedData.location.coordinates || [0, 0],
            } : null;

            const response = await fetch('http://localhost:4100/user/edituserData', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...editedData,
                    location: updatedLocation,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
            } else {
                toast.error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        }
    };

    // Other handlers (password change, etc.) ...

    return (
        <div className="profile-container">
            <div className="profile-header flex">
                <div className="image-container">
                    {/* Show the uploaded image if available */}
                    {imageFile || profileImage ? (
                        <img
                            src={imageFile || profileImage}
                            alt="Profile"
                            className="profile-image"
                        />
                    ) : (
                        <p>No image available</p> // Default text if no image
                    )}

                    {/* Show the "Edit Profile" button only when in editing mode */}
                    {isEditing && (
                        <div className="edit-image-button">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="profile-image-input"
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="edit-button">
                                <EditIconDefault />
                                {/* edit */}
                            </label>
                        </div>
                    )}
                </div>
                <div className="details flex">
                    {isEditing ? (
                        <input
                            type="text"
                            name="fullName"
                            value={editedData.fullName}
                            onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                            className="name-input"
                        />
                    ) : (
                        <h2 className="name">{editedData.fullName}</h2>
                    )}
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={editedData.email}
                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                            className="email-input"
                        />
                    ) : (
                        <p className="email">{editedData.email}</p>
                    )}
                </div>
            </div>

            <div className="bio-container flex">
                <h3 className="bio-title">Bio:</h3>
                {isEditing ? (
                    <textarea
                        name="bio"
                        value={editedData.bio}
                        onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                        className="bio-input"
                    />
                ) : (
                    <p className="bio">{editedData.bio}</p>
                )}
            </div>

            <div className="location-container flex">
                {isEditing ? (
                    <div className="location-inputs">
                        <input
                            type="number"
                            name="longitude"
                            value={editedData.location ? editedData.location.coordinates[0] : ''}
                            onChange={(e) => {
                                const newCoordinates = [
                                    e.target.value,
                                    editedData.location?.coordinates[1] || '',
                                ];
                                setEditedData((prevData) => ({
                                    ...prevData,
                                    location: { ...prevData.location, coordinates: newCoordinates },
                                }));
                            }}
                            placeholder="Longitude"
                        />
                        <input
                            type="number"
                            name="latitude"
                            value={editedData.location ? editedData.location.coordinates[1] : ''}
                            onChange={(e) => {
                                const newCoordinates = [
                                    editedData.location?.coordinates[0] || '',
                                    e.target.value,
                                ];
                                setEditedData((prevData) => ({
                                    ...prevData,
                                    location: { ...prevData.location, coordinates: newCoordinates },
                                }));
                            }}
                            placeholder="Latitude"
                        />
                    </div>
                ) : (
                    <p className="location">
                        Location: Latitude: {editedData.location ? editedData.location.coordinates[1] : 'N/A'},
                        Longitude: {editedData.location ? editedData.location.coordinates[0] : 'N/A'}
                    </p>
                )}
            </div>

            <div className="changePassword" onClick={() => setChangePassword(true)}>
                Change Password
            </div>

            {/* Change Password Form */}
            {changePassword && (
                <div className="password-change-form">
                    {/* Password fields and buttons */}
                </div>
            )}

            {/* Profile action buttons */}
            <div className="profile-actions">
                {isEditing ? (
                    <button onClick={handleSaveChanges}>Save Changes</button>
                ) : (
                    <button onClick={handleEditClick}>Edit Profile</button>
                )}
                <button>Log Out</button>
            </div>
        </div>
    );
};

export default Profile;
