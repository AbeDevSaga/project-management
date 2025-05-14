import { StaticImageData } from "next/image";
import React, { useState } from "react";
import ActionButton from "../ActionButton";
import { TUser, TDepartment } from "@/app/constants/type";

interface AddUserProps {
  role?: string;
  departments?: TDepartment[];
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
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const buttonLabel = role ? `Add ${role}` : "Add User";
  const headerText = role
    ? `Create New ${role} Account`
    : "Create New User Account";

  const isAdmin = role === "admin";
  const isDepartmentHead = role === "departmentHead";

  const handleAddUser = () => {
    if (password !== confirmPassword) {
      alert("Password and confirm password do not match!");
      return;
    }

    const newUser: TUser = {
      username,
      email,
      phone,
      password,
      created_at: new Date().toLocaleDateString(),
    };

    if (role) newUser.role = role;
    if (selectedDepartment) newUser.department = selectedDepartment;

    onAddUser(newUser);
    closeAddUser();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto max-w-4xl"> {/* Increased max width */}
        <div className="flex items-center justify-center px-4">
          <p className="text-primary text-lg">{headerText}</p>
        </div>
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddUser}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Grid layout with 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Left Column - User Details */}
          <div className="space-y-4">
            <h2 className="text-primary font-medium">User Details</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  id="name"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Name"
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Email"
                />
              </div>

              <div>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Phone"
                />
              </div>

              {!isAdmin && !isDepartmentHead && (
                <div>
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
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Password Settings */}
          <div className="space-y-4">
            <h2 className="text-primary font-medium">Set Password</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Password"
                />
              </div>

              <div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm Password"
                />
              </div>

              {/* Action Button - spans full width on mobile, aligned right on desktop */}
              <div className="md:pt-8 md:flex md:justify-end">
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
    </div>
  );
};

export default AddUser;