"use client";
import React, { useState } from "react";
import { TDepartment, TUser } from "@/app/constants/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { updateDepartment } from "@/app/redux/slices/deptSlice";
import { toast } from "react-toastify";

interface UpdateDepartmentProps {
  departmentToUpdate: TDepartment;
  closeUpdateDepartment: () => void;
  onUpdateDepartment: (updatedDepartment: TDepartment) => void;
}

const UpdateDepartment: React.FC<UpdateDepartmentProps> = ({
  departmentToUpdate,
  closeUpdateDepartment,
  onUpdateDepartment,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [departmentData, setDepartmentData] = useState<TDepartment>({
    ...departmentToUpdate,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDepartmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDepartmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!departmentData.name.trim()) {
      newErrors.name = "Department name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(
        updateDepartment({
          id: departmentToUpdate._id!,
          departmentData,
        })
      );

      if (updateDepartment.fulfilled.match(resultAction)) {
        toast.success("Department updated successfully");
        onUpdateDepartment(resultAction.payload);
        closeUpdateDepartment();
      } else {
        throw new Error("Failed to update department");
      }
    } catch (error) {
      toast.error("Failed to update department");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Department</h2>
        
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
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={closeUpdateDepartment}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepartment;