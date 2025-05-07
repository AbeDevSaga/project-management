import React, { useState } from "react";
import { TDepartment } from "../../constants/type";
import { FaUsers, FaUserTie, FaGraduationCap } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";

interface DepartmentCardProps {
  department: TDepartment;
  onCardClick?: () => void;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onCardClick,
}) => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const handleViewDetails = () => {
    if (onCardClick) {
      onCardClick();
    } else {
      router.push(`/departments/${department._id}`);
    }
  };

  const handleEdit = () => {
    console.log("Edit department:", department._id);
    setShowActions(false);
  };

  const handleManageUsers = () => {
    console.log("Manage users for department:", department._id);
    setShowActions(false);
  };

  const handleDelete = () => {
    console.log("Delete department:", department._id);
    setShowActions(false);
  };

  return (
    <div className="bg-white relative rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full min-h-[300px]">
      {/* Three-dot menu button */}
      <div className="absolute top-2 right-2">
        <BsThreeDotsVertical
          onClick={() => setShowActions(!showActions)}
          className="text-gray-600 cursor-pointer hover:text-gray-800"
        />
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md z-10 w-40">
          <button
            onClick={handleEdit}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-blue-500"
          >
            Edit
          </button>
          <button
            onClick={handleManageUsers}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-green-500 border-t border-gray-100"
          >
            Manage Users
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-red-500 border-t border-gray-100"
          >
            Delete
          </button>
        </div>
      )}

      {/* Department Content */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200 shadow-sm">
          <FaUserTie className="w-6 h-6 text-gray-500" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">{department.name}</h2>
          {department.head && (
            <p className="text-sm text-gray-500">
              Head:{" "}
              {typeof department.head === "object"
                ? department.head.username
                : "Loading..."}
            </p>
          )}
        </div>
      </div>

      <div className="flex space-x-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <FaUserTie className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              {department.advisors?.length || 0}
            </span>
            <span className="text-sm text-gray-500">Advisors</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-full">
            <FaGraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              {department.students?.length || 0}
            </span>
            <span className="text-sm text-gray-500">Students</span>
          </div>
        </div>
      </div>

      {/* View Button */}
      <div className="mt-auto">
        <button
          className="w-full py-2 px-4 text-blue-600 rounded-md hover:text-blue-700 transition-colors duration-300 flex items-center justify-center gap-2"
          onClick={handleViewDetails}
        >
          View Department
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
