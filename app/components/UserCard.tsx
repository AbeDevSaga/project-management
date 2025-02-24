"use client";
import React, { useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import Image from "next/image";
import { profile } from "../constants/userProfile";
import ViewProfile from "./ViewProfile";

function UserCard() {
  const [showMenu, setShowMenu] = useState(false);
  const [showViewProfile, setShowViewProfile] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleViewProfile = () => {
    setShowViewProfile(true); // Open the ViewUser modal
    setShowMenu(false); // Close the dropdown menu
  };

  const closeViewProfile = () => {
    setShowViewProfile(false); // Close the ViewUser modal
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 relative">
        {/* User Info */}
        <div className="text-right">
          <p className="text-titleFg">{profile.name.split(" ")[0]}</p>
          <p className="text-sm ">{profile.role}</p>
        </div>

        <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-gray-300">
          <Image
            src={profile.image}
            alt="User Profile"
            className="object-cover"
          />
        </div>

        {/* Dropdown Icon */}
        <div className="cursor-pointer text-gray-600 hover:text-gray-800">
          {showMenu ? (
            <GoTriangleUp className="w-5 h-5" onClick={toggleMenu} />
          ) : (
            <GoTriangleDown className="w-5 h-5" onClick={toggleMenu} />
          )}
        </div>

        {/* Dropdown Menu */}
      </div>
      {showMenu && (
        <div className="absolute top-12 left-0 bg-white border rounded-lg shadow-lg p-2 z-10">
          <ul className="space-y-2">
            <li
              className="px-4 hover:text-primary cursor-pointer"
              onClick={handleViewProfile}
            >
              View Profile
            </li>
          </ul>
        </div>
      )}
      {/* ViewUser Modal */}
      {showViewProfile && (
        <ViewProfile user={profile} closeViewUser={closeViewProfile} />
      )}
    </div>
  );
}

export default UserCard;
