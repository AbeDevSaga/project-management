import React, { useState, useRef } from "react";
import ActionButton from "../ActionButton";
import { FiUpload, FiFileText, FiX } from "react-icons/fi";

interface AddManualProps {
  department?: string;
  closeAddManual: () => void;
  onAddManual: (manualData: FormData) => void;
}

const AddManual: React.FC<AddManualProps> = ({
  closeAddManual,
  onAddManual,
  department,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("documentation");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    type: false,
    file: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setErrors((prev) => ({ ...prev, file: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: !title.trim(),
      description: !description.trim(),
      type: !type,
      file: !file,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleAddManual = () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    if (file) formData.append("file", file);
    if (department) formData.append("department", department);

    onAddManual(formData);
    closeAddManual();
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
    setErrors((prev) => ({ ...prev, file: true }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-primary">Add New Manual</h2>
          <button
            onClick={closeAddManual}
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Manual Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">
                Manual Details
              </h3>

              {/* Title */}
              <div>
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
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: false }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.title
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  placeholder="Enter manual title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">Title is required</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: false }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  placeholder="Enter description"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    Description is required
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type *
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setErrors((prev) => ({ ...prev, type: false }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.type
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                >
                  <option value="documentation">Documentation</option>
                  <option value="implementation">Implementation</option>
                  <option value="policy">Policy</option>
                  <option value="guideline">Guideline</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">Type is required</p>
                )}
              </div>
            </div>

            {/* Right Column - File Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">File Upload</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manual File *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    errors.file
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-primary hover:bg-gray-50"
                  }`}
                  onClick={handleFileButtonClick}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FiUpload className="w-8 h-8 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      {fileName || "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX
                    </p>
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileButtonClick();
                      }}
                    >
                      Select File
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                  />
                </div>
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600">File is required</p>
                )}

                {fileName && (
                  <div className="mt-3 flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FiFileText className="text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {fileName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove file"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <ActionButton
              label="Add Manual"
              icon="upload"
              onClick={handleAddManual}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddManual;
