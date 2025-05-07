import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TManual } from "../../constants/type";

interface UpdateManualProps {
  closeUpdateManual: () => void;
  onUpdateManual: (manualData: FormData) => void;
  manualToUpdate: TManual;
}

const UpdateManual: React.FC<UpdateManualProps> = ({
  closeUpdateManual,
  onUpdateManual,
  manualToUpdate,
}) => {
  // State for updated manual details
  const [title, setTitle] = useState(manualToUpdate.title);
  const [description, setDescription] = useState(manualToUpdate.description);
  const [type, setType] = useState(manualToUpdate.type);
  const [fileUrl, setFileUrl] = useState(manualToUpdate.file);
  const [file, setFile] = useState<File | null>(null);

  // Pre-fill the form with the manual data
  useEffect(() => {
    setTitle(manualToUpdate.title);
    setDescription(manualToUpdate.description);
    setType(manualToUpdate.type);
    setFileUrl(manualToUpdate.file);
  }, [manualToUpdate]);

  console.log("file: ", manualToUpdate);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateManual = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    // If a new file was selected, append it
    if (file instanceof File) {
      formData.append("file", file);
    }
    onUpdateManual(formData);
    closeUpdateManual();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeUpdateManual}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Update Manual Form */}
        <div className="mt-6">
          <h2 className="text-primary text-xl font-semibold mb-4">
            Manual Details
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Title */}
            <div className="relative">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Manual Title"
                required
              />
            </div>

            {/* Description */}
            <div className="relative">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Manual Description"
                rows={3}
                required
              />
            </div>

            {/* Type */}
            <div className="relative">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Type *
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="documentation">Documentation</option>
                <option value="implementation">Implementation</option>
                <option value="policy">Policy</option>
                <option value="guideline">Guideline</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="relative">
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Manual File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="w-8 h-8 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX
                    </p>
                  </div>
                </label>
              </div>
              {fileUrl && !file && (
                <p className="mt-2 text-sm text-gray-600">
                  Current file: {fileUrl.split("/").pop()}
                </p>
              )}
            </div>
          </div>

          {/* Update Manual Button */}
          <div className="mt-6 flex justify-center">
            <ActionButton
              label="Update Manual"
              icon="update"
              onClick={handleUpdateManual}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateManual;
