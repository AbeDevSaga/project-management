import { StaticImageData } from "next/image";
import React, { useState } from "react";
import ActionButton from "./ActionButton";

interface User {
  name: string;
  email: string;
  phone: string;
  image?: StaticImageData;
  role: string;
  password: string;
  date: string;
}

interface ViewUserProps {
  user: User;
  closeViewUser: () => void;
}

const ViewProfile: React.FC<ViewUserProps> = ({ user, closeViewUser }) => {
  // State for user details
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  // State for password update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle updating user details
  const handleUpdateDetails = () => {
    console.log("Updating Details...");
    console.log("New Name:", name);
    console.log("New Email:", email);
    // Add logic to update user details
  };

  // Handle updating password
  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Updating Password...");
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
    // Add logic to update password
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeViewUser}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* User Details */}
        <div className="flex flex-col items-center space-y-4">
          {/* User Image */}
          <img
            src={user.image?.src}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          {/* User Date and Role */}
          <div className="flex items-center space-x-3">
            <p className="px-4 py-2 text-white text-sm font-semibold rounded-full bg-primary">
              {user.date}
            </p>
            <span className={`px-6 py-2 text-sm font-semibold rounded-full`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* User Details Section */}
        <div className="mt-6 space-y-4 mx-auto p-6 border rounded-lg">
          <h2 className="text-primary">User Details</h2>
          {/* Floating Label Input for Name */}
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              placeholder="Name"
            />
          </div>

          {/* Floating Label Input for Email */}
          <div className="relative mt-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              placeholder="Email"
            />
          </div>

          <ActionButton
            label="Save Changes"
            icon="update"
            onClick={handleUpdateDetails}
          />
        </div>

        {/* Update Password Section */}
        <div className="mt-6 space-y-4 mx-auto p-6 border rounded-lg">
          <h2 className="text-primary">Update Password</h2>
          {/* Floating Label Input for Current Password */}
          <div className="relative">
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              placeholder="Current Password"
            />
          </div>

          {/* Floating Label Input for New Password */}
          <div className="relative mt-4">
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              placeholder="New Password"
            />
          </div>

          {/* Floating Label Input for Confirm Password */}
          <div className="relative mt-4">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              placeholder="Confirm Password"
            />
          </div>

          <ActionButton
            label="Save Changes"
            icon="update"
            onClick={handleUpdatePassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
