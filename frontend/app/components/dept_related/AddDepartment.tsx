"use client";
import React, { useState } from "react";
import { TDepartment, TUser } from "@/app/constants/type";

// Simplified type that only uses string IDs for relationships
type DepartmentFormData = {
  name: string;
  head: string; // Now strictly a string ID
};

interface AddDepartmentProps {
  users: TUser[];
  closeAddDepartment: () => void;
  onAddDepartment: (department: Omit<TDepartment, "_id">) => void;
}

const AddDepartment: React.FC<AddDepartmentProps> = ({
  users,
  closeAddDepartment,
  onAddDepartment,
}) => {
  const [departmentData, setDepartmentData] = useState<DepartmentFormData>({
    name: "",
    head: "", // Now guaranteed to be a string
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDepartmentData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDepartmentData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!departmentData.name.trim()) {
      newErrors.name = "Department name is required";
    }
    if (!departmentData.head) {
      newErrors.head = "Department head is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddDepartment({
        name: departmentData.name,
        head: departmentData.head, // This is now a string ID
        advisors: [],
        students: [],
      });
    }
  };

  // Filter non-student users (potential department heads)
  const potentialHeads = users.filter(user => user.role === "departmentHead");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Department</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Department Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Department Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={departmentData.name}
              onChange={handleInputChange}
              placeholder="Enter department name"
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Department Head - Now properly typed with string value */}
          <div>
            <label htmlFor="head" className="block text-sm font-medium text-gray-700 mb-1">
              Department Head
            </label>
            <select
              id="head"
              name="head"
              value={departmentData.head} // This is now guaranteed to be a string
              onChange={handleSelectChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.head ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select department head</option>
              {potentialHeads.map(user => (
                <option key={user._id} value={user._id}> {/* Using user._id which is a string */}
                  {user.username}
                </option>
              ))}
            </select>
            {errors.head && (
              <p className="text-red-500 text-sm mt-1">{errors.head}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={closeAddDepartment}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;