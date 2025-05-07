import { StaticImageData } from "next/image";
import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TUser, TDepartment } from "@/app/constants/type";

interface AddUserProps {
  role?: string;
  departments?: TDepartment[]; // Add departments prop
  closeAddUser: () => void;
  onAddUser: (userData: TUser) => void;
}

const AddUser: React.FC<AddUserProps> = ({
  role,
  departments,
  closeAddUser,
  onAddUser,
}) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(""); // For department selection
  const buttonLabel = role ? `Add ${role}` : "Add User";
  const headerText = role
    ? `Create New ${role} Account`
    : "Create New User Account";

  // Only show department selection for students
  const isAdmin = role === "admin";
  console.log("Departments:", departments);

  // Handle adding a new user
  const handleAddUser = () => {
    if (password !== confirmPassword) {
      alert("Password and confirm password do not match!");
      return;
    }

    // Create a new user object
    const newUser: TUser = {
      username,
      email,
      phone,
      password,
      created_at: new Date().toLocaleDateString(),
    };

    // Add role if provided
    if (role) {
      newUser.role = role;
    }

    // Add department if student and department is selected
    if (selectedDepartment) {
      newUser.department = selectedDepartment;
    }

    onAddUser(newUser);
    closeAddUser();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto max-w-md">
        <div className="flex items-center justify-center px-4">
          <p className="text-primary text-lg">{headerText}</p>
        </div>
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddUser}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Add User Form */}
        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-4 w-full mx-auto p-2">
            <h2 className="text-primary">User Details</h2>
            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                id="name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Name"
              />
            </div>

            {/* Email Input */}
            <div className="relative mt-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Email"
              />
            </div>

            {/* Phone Input */}
            <div className="relative mt-4">
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Phone"
              />
            </div>

            {/* Department Selection (not for admins) */}

            {!isAdmin && (<div className="relative mt-4">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Department</option>
                {departments?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>)}
          </div>

          <div className="space-y-4 w-full mx-auto p-2">
            <h2 className="text-primary">Set Password</h2>
            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Password"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="relative mt-4">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm Password"
              />
            </div>

            {/* Add User Button */}
            <div className="mt-6">
              <ActionButton
                label={buttonLabel}
                icon="add_user"
                onClick={handleAddUser}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
