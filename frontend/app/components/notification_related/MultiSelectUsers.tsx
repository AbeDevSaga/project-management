"use client";
import React, { useState } from "react";
import { FiUser, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface MultiSelectUsersProps {
  selectedUsers: string[];
  onChange: (users: string[]) => void;
}

const MultiSelectUsers: React.FC<MultiSelectUsersProps> = ({ 
  selectedUsers, 
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const users = useSelector((state: RootState) => state.user.users);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onChange(selectedUsers.filter(id => id !== userId));
    } else {
      onChange([...selectedUsers, userId]);
    }
  };

  const removeUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedUsers.filter(id => id !== userId));
  };

  return (
    <div className="relative">
      <div
        className="w-full p-2 border border-gray-300 rounded-md cursor-pointer flex flex-wrap gap-2 min-h-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedUsers.length === 0 ? (
          <span className="text-gray-400 flex items-center">
            <FiUser className="mr-2" />
            Select recipients
          </span>
        ) : (
          selectedUsers.map(userId => {
            const user = users.find(u => u._id === userId);
            return user ? (
              <span
                key={userId}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center"
              >
                {user.username}
                <button
                  type="button"
                  onClick={(e) => removeUser(userId, e)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <FiX size={14} />
                </button>
              </span>
            ) : null;
          })
        )}
        <div className="ml-auto flex items-center">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full p-1 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-2 text-gray-500">No users found</div>
            ) : (
              filteredUsers.map(user => (
                <div
                  key={user._id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                    selectedUsers.includes(user._id || "") ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleUser(user._id || "")}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id || "")}
                    readOnly
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectUsers;