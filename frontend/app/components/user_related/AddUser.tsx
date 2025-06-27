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
  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    password: "",
    email: "",
  });

  const buttonLabel = role ? `Add ${role}` : "Add User";
  const headerText = role
    ? `Create New ${role} Account`
    : "Create New User Account";

  const isAdmin = role === "admin";
  const isDepartmentHead = role === "departmentHead";

  const validateForm = () => {
    const newErrors = {
      username: "",
      phone: "",
      password: "",
      email: "",
    };
    let isValid = true;

    // Username validation (at least 3 characters)
    if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z_\- ]+$/.test(username)) {
      newErrors.username =
        "Username can only contain letters, spaces, underscores (_), and hyphens (-)";
      isValid = false;
    }

    // Phone validation (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone must be 10 digits";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddUser = () => {
    if (!validateForm()) {
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, password: "Passwords do not match" }));
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
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto max-w-4xl">
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
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  className={`w-full px-4 py-2 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Name"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={`w-full px-4 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, "");
                    setPhone(value);
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  maxLength={10}
                  className={`w-full px-4 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Phone (10 digits)"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`w-full px-4 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Password (min 6 characters)"
                />
                {errors.password && !errors.password.includes("match") && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border ${
                    errors.password.includes("match")
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                  placeholder="Confirm Password"
                />
                {errors.password.includes("match") && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

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
