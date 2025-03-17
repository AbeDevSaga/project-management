"use client";
import React, { useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import Image from "next/image";
import { profile } from "../constants/userProfile";
import ViewProfile from "./ViewProfile";
import { TUser } from "../constants/type";
import { FaUserAlt } from "react-icons/fa";

interface UserCardProps {
  user: TUser | null; // Pass the logged-in user as a prop
}

function UserCard({ user }: UserCardProps) {
  // State for dropdown menu and ViewProfile modal
  const [showMenu, setShowMenu] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);

  // Toggle dropdown menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Handle View Profile click
  const handleViewProfile = () => {
    setShowViewProfile(true); // Open the ViewProfile modal
    setShowMenu(false); // Close the dropdown menu
  };

  // Close ViewProfile modal
  const closeViewProfile = () => {
    setShowViewProfile(false); // Close the ViewProfile modal
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 relative">
        {/* User Info */}
        <div className="text-right">
          <p className="text-titleFg">
            {user?.username?.split(" ")[0] || profile.name.split(" ")[0]}
          </p>
          <p className="text-sm">{user?.role || profile.role}</p>
        </div>

        {/* Profile Image (Persist from constants if user.profileImage is not available) */}
        <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-gray-300">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt="User Profile"
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            < FaUserAlt  size={30}/>
          )}
        </div>

        {/* Dropdown Icon */}
        <div className="cursor-pointer text-gray-600 hover:text-gray-800">
          {showMenu ? (
            <GoTriangleUp className="w-5 h-5" onClick={toggleMenu} />
          ) : (
            <GoTriangleDown className="w-5 h-5" onClick={toggleMenu} />
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
          <p
            className="px-1 hover:text-primary cursor-pointer"
            onClick={handleViewProfile}
          >
            View Profile
          </p>
        </div>
      )}
      {/* ViewProfile Modal */}
      {showViewProfile && user && (
        <ViewProfile
          user={{
            ...user,
          }}
          closeViewUser={closeViewProfile}
        />
      )}
    </div>
  );
}

export default UserCard;
