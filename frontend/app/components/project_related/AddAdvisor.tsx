import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TUser } from "@/app/constants/type";

interface AddAdvisorProps {
  users: TUser[]; // List of all users
  projectId: string; // ID of the project to add students to
  closeAddAdvisor: () => void; // Callback to close the modal
  onAddAdvisor: (advisorId: string, projectId: string, role: string) => void; // Callback to add students
}

const AddAdvisor: React.FC<AddAdvisorProps> = ({
  users,
  projectId,
  closeAddAdvisor,
  onAddAdvisor,
}) => {
  // State for selected student IDs
  const [selectedAdvisor, setSelectedAdvisor] = useState<string|null>(null);
  
  // Filter users to get only students
  const students = users.filter(user => user.role === 'advisor');
  
  // Toggle student selection
  const toggleStudentSelection = (advisorId: string) => {
    setSelectedAdvisor(advisorId);
  };

  // Handle adding selected students
  const handleAddAdvisor = () => {
    if (!selectedAdvisor) {
      alert("Please select an Advisor!");
      return;
    }
    
    onAddAdvisor(selectedAdvisor, projectId, "advisor");
    closeAddAdvisor();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddAdvisor}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-primary text-xl font-semibold">
            Add Students to Project
          </h2>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          {students.length === 0 ? (
            <p className="text-center text-gray-500">No students available</p>
          ) : (
            students.map(student => (
              <div 
                key={student._id} 
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleStudentSelection(student._id!)}
              >
                <input
                  type="checkbox"
                  checked={selectedAdvisor === student._id!}
                  onChange={() => toggleStudentSelection(student._id!)}
                  className="mr-3 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{student.username}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={closeAddAdvisor}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <ActionButton
            label={`Add Advisor`}
            icon="add_user"
            onClick={handleAddAdvisor}
          />
        </div>
      </div>
    </div>
  );
};

export default AddAdvisor;