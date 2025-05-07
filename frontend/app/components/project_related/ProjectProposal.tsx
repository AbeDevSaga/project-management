import { TProject, TProposal, TUser } from "@/app/constants/type";
import { createProposal } from "@/app/redux/slices/proposalSlice";
import { AppDispatch } from "@/app/redux/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface projectProposalProp {
  user: TUser | null;
  project: TProject;
  proposal: TProposal | null;
  onDownload: (proposal: TProposal) => void;
  onUpdate: () => void;
  onDelete: (proposal: TProposal) => void;
  setProjectProposal: (proposal: TProposal) => void;
}

const ProjectProposal: React.FC<projectProposalProp> = ({
  user,
  project,
  proposal,
  onDownload,
  onUpdate,
  onDelete,
  setProjectProposal,
}) => {
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const handleProposalUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setAlert({
        status: "error",
        text: "Only PDF and Word documents are allowed",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project", project._id || " ");
    formData.append("student", project?.students?.[0]?._id || ""); // Assuming first student is the submitter

    try {
      const resultAction = await dispatch(createProposal(formData));
      if (createProposal.fulfilled.match(resultAction)) {
        setProjectProposal(resultAction.payload);
        setAlert({
          status: "success",
          text: "Proposal uploaded successfully",
        });
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (error) {
      setAlert({
        status: "error",
        text: "Failed to upload proposal",
      });
    }
  };
  // Permissions
  const canDownload = [
    "admin",
    "student",
    "advisor",
    "departmentHead",
    "evaluator",
  ].includes(user?.role || "");
  const canUpdate = user?.role === "advisor";
  const canDelete = user?.role === "student";
  const canSubmit = user?.role === "student";

  return proposal ? (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-500">
          Project Proposal
        </h2>
        <div className="flex space-x-2">
          {/* Download Button */}
          {canDownload && (
            <button
              onClick={() => onDownload(proposal)}
              className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
              title="Download Proposal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          )}

          {/* Update Button */}
          {canUpdate && (
            <button
              onClick={onUpdate}
              className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
              title="Update Proposal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {/* Delete Button */}
          {canDelete && (
            <button
              onClick={() => onDelete(proposal)}
              className="p-1 text-red-600 hover:text-red-800 transition-colors"
              title="Delete Proposal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 truncate">
            {proposal.file && proposal.file.split(`${proposal.project}`).pop()}
          </p>
          <div className="flex items-center mt-1">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                proposal.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : proposal.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              status: {proposal.status}
            </span>
            {proposal.feedback && (
              <p className="ml-2 text-xs text-gray-500 truncate">
                Feedback: {proposal.feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : canSubmit ? (
    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors">
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span className="mt-2 text-sm font-medium text-gray-600">
          Submit Proposal
        </span>
        <span className="text-xs text-gray-500">Click to upload</span>
        <input
          type="file"
          className="hidden"
          onChange={(e) => handleProposalUpload(e.target.files)}
          accept=".pdf,.doc,.docx"
        />
      </label>
    </div>
  ) : (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-500">No proposal submitted yet.</p>
    </div>
  );
};

export default ProjectProposal;
