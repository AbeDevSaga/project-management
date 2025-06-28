import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TProject, TUser } from "../../constants/type";

interface UpdateProjectProps {
  closeUpdateProject: () => void; // Function to close the modal
  onUpdateProject: (projectData: TProject) => void; // Function to handle project update
  projectToUpdate: TProject; // The project data to be updated
}

const UpdateProject: React.FC<UpdateProjectProps> = ({
  closeUpdateProject,
  onUpdateProject,
  projectToUpdate,
}) => {
  // State for updated project details
  const [title, setTitle] = useState<TProject["title"]>(projectToUpdate.title);
  const [description, setDescription] = useState(projectToUpdate.description);
  const [department, setDepartment] = useState(projectToUpdate.department);
  const [projectStatus, setProjectStatus] = useState(projectToUpdate.projectStatus);
  const [students, setStudents] = useState(projectToUpdate.students || []);
  const [advisor, setAdvisor] = useState(projectToUpdate.advisor);

  console.log("Project to update:", projectToUpdate);

  // Pre-fill the form with the project data
  useEffect(() => {
    setTitle(projectToUpdate.title);
    setDescription(projectToUpdate.description);
    setDepartment(projectToUpdate.department);
    setProjectStatus(projectToUpdate.projectStatus);
    setStudents(projectToUpdate.students || []);
    setAdvisor(projectToUpdate.advisor);
  }, [projectToUpdate]);

  // Handle updating the project
  const handleUpdateProject = () => {
    const updatedProject: TProject = {
      ...projectToUpdate, // Keep the existing fields like _id, tasks, proposals, submissions, and created_at
      title,
      description,
      department,
      projectStatus,
      students,
      advisor,
    };

    onUpdateProject(updatedProject); // Pass the updated project data to the parent component
    closeUpdateProject(); // Close the modal
  };

  // Handle student selection
  const handleStudentSelection = (studentId: TUser, isChecked: boolean) => {
    if (isChecked) {
      setStudents([...students, studentId]);
    } else {
      setStudents(students.filter(id => id !== studentId));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeUpdateProject}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Update Project Form */}
        <div className="mt-6">
          <h2 className="text-primary text-xl font-semibold mb-4">Project Details</h2>

          {/* Grid Layout for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Title */}
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Title"
                  required
                />
              </div>

              {/* Description */}
              <div className="relative">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description"
                  rows={3}
                />
              </div>

              {/* Department */}
              {/* <div className="relative">
                <select
                  id="department"
                  value={department?._id}
                  onChange={(e) => setDepartment(e.target.value.toString())}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* Project Status */}
              <div className="relative">
                <select
                  id="projectStatus"
                  value={projectStatus}
                  onChange={(e) => setProjectStatus(e.target.value as TProject["projectStatus"])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Advisor */}
              {/* <div className="relative">
                <select
                  id="advisor"
                  value={advisor}
                  onChange={(e) => setAdvisor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Advisor</option>
                  {users
                    .filter(user => user.role === 'advisor') // Assuming there's a role field
                    .map(user => (
                      <option key={user._id} value={user._id}>
                        {user.username}
                      </option>
                    ))}
                </select>
              </div> */}

              {/* Students */}
              {/* <div className="relative">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Students
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {users
                    .filter(user => user.role === 'student') // Assuming there's a role field
                    .map(user => (
                      <div key={user._id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={`student-${user._id}`}
                          checked={students.includes(user._id)}
                          onChange={(e) => handleStudentSelection(user._id, e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`student-${user._id}`}>{user.username}</label>
                      </div>
                    ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Update Project Button */}
          <div className="mt-6 flex items-center justify-center">
            <ActionButton
              label="Update Project"
              icon="project"
              onClick={handleUpdateProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;