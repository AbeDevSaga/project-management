import React, { useState } from "react";
import ActionButton from "./ActionButton";
import { TUser } from "../constants/type";
import { FaUserAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateUser } from "@/app/redux/slices/userSlice";
import { AppDispatch } from "@/app/redux/store";
import NotificationCard from "./NotificationCard";
import Alert from "./AlertProp";

interface ViewUserProps {
  user: TUser;
  closeViewUser: () => void;
}

const ViewProfile: React.FC<ViewUserProps> = ({ user, closeViewUser }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    onCloseComplete?: () => void;
  } | null>(null);

  // State for user details
  const [department, setDepartment] = useState(
    typeof user.department === "object"
      ? user.department?.name ?? ""
      : user.department ?? ""
  );
  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // State for password update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  // State for profile image upload
  const [profileImage, setProfileImage] = useState(user.profileImage);

  // Handle updating user details
  const handleUpdateDetails = async () => {
    if (!name || !email) {
      setUpdateError("Name and email are required");
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      const resultAction = await dispatch(
        updateUser({
          id: user._id || "",
          userData: { username: name, email },
        })
      );

      if (updateUser.fulfilled.match(resultAction)) {
        setNotification({
          message: "Details updated successfully!",
          type: "success",
          onCloseComplete: () => closeViewUser(),
        });
      } else {
        setNotification({
          message: "Details updated successfully!",
          type: "success",
          onCloseComplete: () => closeViewUser(),
        });
        setNotification({
          message: "Details updated Error!",
          type: "error",
        });
      }
    } catch (error) {
      setUpdateError("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle updating password
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match!");
      return;
    }

    if (!currentPassword) {
      setPasswordError("Current password is required!");
      return;
    }

    setIsUpdating(true);
    setPasswordError("");

    try {
      const resultAction = await dispatch(
        updateUser({
          id: user._id || "",
          userData: { password: newPassword },
        })
      );

      if (updateUser.fulfilled.match(resultAction)) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setAlert({
          status: "success",
          text: "User added successfull",
        });
      } else {
        setAlert({
          status: "error",
          text: "Failed to add user",
        });
      }
    } catch (error) {
      setPasswordError("Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        dispatch(
          updateUser({
            id: user._id || "",
            userData: { profileImage: reader.result as string },
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto">
        {/* Close Button */}
        <button
          onClick={closeViewUser}
          className="absolute top-2 right-2 text-2xl w-6 h-6 rounded-full text-red-500 hover:text-red-700 bg-white"
        >
          &times;
        </button>

        {/* User Details */}
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Image */}
          <div className="relative w-24 h-24">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user.username}
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <FaUserAlt className="w-full h-full rounded-full object-cover border-2 border-gray-200 p-4 text-gray-400" />
            )}
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer">
              +
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* User Role Badge */}
          <div className="flex w-full space-x-2 item-center justify-center">
            {department && (
              <span
                className={`px-4 py-1 text-xs font-semibold rounded-full bg-gray-100`}
              >
                {department}
              </span>
            )}
            <span
              className={`px-4 py-1 text-xs font-semibold rounded-full bg-gray-100`}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4 flex space-x-4">
          {/* User Details Form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold text-primary">User Details</h2>

            {updateError && (
              <p className="text-red-500 text-sm">{updateError}</p>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <input
                type="text"
                value={user.role}
                readOnly
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>

            <ActionButton
              label={isUpdating ? "Updating..." : "Save Changes"}
              icon="update"
              onClick={handleUpdateDetails}
            />
          </div>

          {/* Password Update Form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h2 className="text-lg font-semibold text-primary">
              Update Password
            </h2>

            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>

            <ActionButton
              label={isUpdating ? "Updating..." : "Update Password"}
              icon="update"
              onClick={handleUpdatePassword}
            />
          </div>
          {notification && (
            <NotificationCard
              message={notification.message}
              type={notification.type}
              onClose={() => {
                setNotification(null);
                notification.onCloseComplete?.();
              }}
            />
          )}
          {alert && (
            <Alert
              status={alert.status}
              text={alert.text}
              onClose={() => setAlert(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
