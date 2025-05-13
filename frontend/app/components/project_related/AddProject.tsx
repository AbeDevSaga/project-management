import React, { useState } from "react";
import { TProject, TUser, TFile } from "../../constants/type";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface AddProjectProps {
  users: TUser[];
  closeAddProject: () => void;
  onAddProject: (newProject: FormData) => Promise<void>; // Changed to accept FormData
}

const AddProject: React.FC<AddProjectProps> = ({
  users,
  closeAddProject,
  onAddProject,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector(
    (state: RootState) => state.auth.user);
  const deptId =  typeof user?.department === "object" ? user?.department._id : null;

  const students = users.filter((user) => user.role === "student");

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStudents.length === 0) {
      setError("Please select at least one student");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('projectStatus', 'in-progress');
      if (deptId) {
        formData.append('department', deptId);
      }
      
      // Append each student ID
      selectedStudents.forEach(studentId => {
        formData.append('students', studentId);
      });
      
      if (selectedFile) {
        formData.append('description', selectedFile);
      }

      await onAddProject(formData);
      closeAddProject();
    } catch (err) {
      setError("Failed to create project. Please try again.");
      console.error("Project creation error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          
          {/* File Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Project File (Optional)
            </label>
            {selectedFile ? (
              <div className="mt-2 p-3 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="truncate max-w-xs">
                    <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex justify-center text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="description"
                        type="file"
                        onChange={handleFileChange}
                        className="sr-only"
                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, PPT up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Student List */}
          <div className="mb-4 space-y-3 max-h-60 overflow-y-auto">
            <label className="block text-sm font-medium text-gray-700">
              Assign Students *
            </label>
            {students.length === 0 ? (
              <p className="text-center text-gray-500">No students available</p>
            ) : (
              students.map((student) => (
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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{student.username}</h3>
                    <p className="text-sm text-gray-600 truncate">{student.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={closeAddProject}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={isUploading || !title || selectedStudents.length === 0}
            >
              {isUploading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;