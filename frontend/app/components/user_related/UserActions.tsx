"use client";
import { TUser } from "@/app/constants/type";
import { RootState } from "@/app/redux/store";
import { FaEye, FaTrash, FaUserSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
type UserActionsProps = {
  user: TUser;
  onView: (user: TUser) => void; // Callback for view action
  onDelete: (user: TUser) => void; // Callback for delete action
};

export const UserActions = ({ user, onView, onDelete }: UserActionsProps) => {
  const systemUser = useSelector((state: RootState) => state.auth.user);
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
      {systemUser?.role === "admin" && (
        <button
          onClick={() => onDelete(user)} // Trigger the onDelete callback
          className="text-red-500 hover:text-red-700"
        >
          <FaUserSlash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
