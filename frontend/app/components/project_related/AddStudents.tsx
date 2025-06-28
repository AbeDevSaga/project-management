import React, { useState } from "react";
import ActionButton from "../ActionButton";
import { TUser } from "@/app/constants/type";

interface AddStudentsProps {
  users: TUser[]; // List of all users
  projectId: string; // ID of the project to add students to
  closeAddStudents: () => void; // Callback to close the modal
  onAddStudents: (studentIds: string[], projectId: string) => void; // Callback to add students
}

const AddStudents: React.FC<AddStudentsProps> = ({
  users,
  projectId,
  closeAddStudents,
  onAddStudents,
}) => {
  // State for selected student IDs
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Filter users to get only students
  const students = users.filter(user => user.role === 'student');
  
  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle adding selected students
  const handleAddStudents = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student!");
      return;
    }
    
    onAddStudents(selectedStudents, projectId);
    closeAddStudents();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddStudents}
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
                  checked={selectedStudents.includes(student._id!)}
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
            onClick={closeAddStudents}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <ActionButton
            label={`Add ${selectedStudents.length} Students`}
            icon="add_user"
            onClick={handleAddStudents}
          />
        </div>
      </div>
    </div>
  );
};

export default AddStudents;