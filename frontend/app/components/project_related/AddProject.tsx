import React, { useState } from "react";
import { TProject, TUser } from "../../constants/type";

interface AddProjectProps {
  users: TUser[];
  closeAddProject: () => void;
  onAddProject: (newProject: TProject) => void;
}

const AddProject: React.FC<AddProjectProps> = ({
  users,
  closeAddProject,
  onAddProject,
}) => {
  const [newProject, setNewProject] = useState<TProject>({
    title: "",
    description: "",
    projectStatus: "in-progress",
  });
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const students = users.filter(user => user.role === 'student');
  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject(newProject);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={newProject.title}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeAddProject}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
            >
              Add Project
            </button>
          </div>
        </form>
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
      </div>
    </div>
  );
};

export default AddProject;