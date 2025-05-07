import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TProposal } from "../../constants/type";

interface UpdateProposalProps {
  closeUpdateProposal: () => void;
  onUpdateProposal: (manualData: FormData) => void;
  proposalToUpdate: TProposal;
}

const UpdateProposal: React.FC<UpdateProposalProps> = ({
  closeUpdateProposal,
  onUpdateProposal,
  proposalToUpdate,
}) => {
  // State for updated proposal details
  const [status, setStatus] = useState(proposalToUpdate.status || "pending");
  const [feedback, setFeedback] = useState(proposalToUpdate.feedback || "");
  const [fileUrl, setFileUrl] = useState(proposalToUpdate.file || "");
  const [file, setFile] = useState<File | null>(null);

  // Pre-fill the form with the proposal data
  useEffect(() => {
    setStatus(proposalToUpdate.status || "pending");
    setFeedback(proposalToUpdate.feedback || "");
    setFileUrl(proposalToUpdate.file || "");
  }, [proposalToUpdate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateProposal = async () => {
    const fileFormData = new FormData();
    fileFormData.append('status', status);
    fileFormData.append('feedback', feedback);
    file? fileFormData.append("file", file):fileFormData.append("file", fileUrl);
    onUpdateProposal(fileFormData);
    closeUpdateProposal();  
    };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeUpdateProposal}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Update Proposal Form */}
        <div className="mt-6">
          <h2 className="text-primary text-xl font-semibold mb-4">Update Proposal</h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Status */}
            <div className="relative">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_revision">Needs Revision</option>
              </select>
            </div>

            {/* Feedback */}
            <div className="relative">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                Feedback {status !== "approved" && status !== "pending" && "*"}
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Provide feedback if rejecting or requesting revisions"
                rows={3}
                required={status !== "approved" && status !== "pending"}
              />
            </div>

            {/* File Upload (for student to update their proposal file) */}
            <div className="relative">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Proposal File
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
                  Current file: {fileUrl.split('/').pop()}
                </p>
              )}
            </div>
          </div>

          {/* Update Proposal Button */}
          <div className="mt-6 flex justify-center">
            <ActionButton
              label="Update Proposal"
              icon="update"
              onClick={handleUpdateProposal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProposal;