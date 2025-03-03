"use client";

import { TUsers } from "@/app/constants/type";
import { FaEye, FaTrash } from "react-icons/fa";


type UserActionsProps = {
  user: TUsers;
  onView: (user: TUsers) => void; // Callback for view action
  onDelete: (user: TUsers) => void; // Callback for delete action
};

export const UserActions = ({ user, onView, onDelete }: UserActionsProps) => {
  return (
    <div className="flex space-x-6">
      {/* View Button */}
      <button
        onClick={() => onView(user)} // Trigger the onView callback
        className="text-gray-500 hover:text-blue-700"
      >
        <FaEye className="w-5 h-5" />
      </button>
      {/* Delete Button */}
      <button
        onClick={() => onDelete(user)} // Trigger the onDelete callback
        className="text-red-500 hover:text-red-700"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
};