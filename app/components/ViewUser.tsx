import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  image?: string; // Optional image URL
}

interface ViewUserProps {
  user: User;
  closeViewUser: () => void;
}

const ViewUser: React.FC<ViewUserProps> = ({ user, closeViewUser }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg shadow-lg py-6 w-full max-w-md">
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
            src={user.image }
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          {/* User Name */}
          <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
          {/* User Date and Status */}
          <div className="flex items-center space-x-3">
            <p className="px-4 py-2 text-white text-sm font-semibold rounded-full bg-primary">
              {user.date}
            </p>
            <span
              className={`px-6 py-2 text-sm font-semibold rounded-full ${
                user.status === "active"
                  ? "bg-green-100 text-green-800"
                  : user.status === "inactive"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
        {/* Additional User Details */}
        <div className="mt-6 space-y-2 max-w-xs mx-auto">
          <p className="font-medium text-primary">Email:</p>
          <p className="text-gray-800">{user.email}</p>
          <p className="font-medium text-primary">Phone:</p>
          <p className="text-gray-600">{user.phone}</p>
          <p className="font-medium text-primary">Joined:</p>
          <p className="text-gray-600">{user.date}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
