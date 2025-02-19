"use client";
import React, { useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import Image from "next/image";
import { profile } from "../constants/userProfile";

function UserCard() {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
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
        <GoTriangleDown className="w-5 h-5" onClick={toggleMenu} />
      </div>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute mt-[120px] bg-white border rounded-lg shadow-lg p-2">
          <ul className="space-y-2">
            <li className="px-6 bg-red-500 hover:bg-gray-100">View Profile</li>
            <li className="px-6 bg-red-500 hover:bg-gray-100">Swith Super Amdin</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserCard;
