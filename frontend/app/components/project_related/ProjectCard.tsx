import React, { useState } from "react";
import { TProject } from "../../constants/type";
import { FaTasks, FaFileAlt } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi2";
import { BsThreeDotsVertical } from "react-icons/bs";
import { updateProject } from "@/app/redux/slices/projectSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { toast } from "react-toastify";

interface ProjectCardProps {
  project: TProject;
  onCardClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCardClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showActions, setShowActions] = useState(false);
  const [isUpdating, setIsUpdating] = useState<"approved" | "rejected" | null>(
    null
  );

  const handleUpdateProject = async (status: "approved" | "rejected") => {
    setIsUpdating(status);
    setShowActions(false);

    try {
      const updatedProjectData = {
        isApproved: status === "approved",
        isRejected: status === "rejected",
      };

      // Minimum 500ms delay for better UX
      const [result] = await Promise.all([
        dispatch(
          updateProject({
            id: project._id ?? "",
            projectData: updatedProjectData,
          })
        ).unwrap(),
        new Promise((resolve) => setTimeout(resolve, 500)),
      ]);

      toast.success(`Project ${status} successfully`, {
        autoClose: 3000,
        pauseOnHover: true,
      });
    } catch (error) {
      toast.error("Failed to update project status", {
        autoClose: 4000,
        pauseOnHover: true,
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div
      className={`bg-white relative rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full min-h-[300px] ${
        isUpdating ? "opacity-75" : ""
      }`}
    >
      <div className="absolute top-2 right-2">
        <BsThreeDotsVertical
          onClick={() => !isUpdating && setShowActions(!showActions)}
          className={`text-gray-600 cursor-pointer ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md z-10 w-40">
          <button
            onClick={() => handleUpdateProject("approved")}
            disabled={isUpdating !== null}
            className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
              isUpdating === "approved"
                ? "text-green-500"
                : "hover:text-green-500"
            }`}
          >
            {isUpdating === "approved" ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Approving...
              </>
            ) : (
              "Approve Project"
            )}
          </button>

          <button
            onClick={() => handleUpdateProject("rejected")}
            disabled={isUpdating !== null}
            className={`w-full text-left px-4 py-2 hover:bg-gray-50 border-t border-gray-100 flex items-center ${
              isUpdating === "rejected" ? "text-red-500" : "hover:text-red-500"
            }`}
          >
            {isUpdating === "rejected" ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Rejecting...
              </>
            ) : (
              "Reject Project"
            )}
          </button>
        </div>
      )}

      {/* Project Content */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200 shadow-sm">
          <HiOutlineCalendar className="w-6 h-6 text-gray-500" />
        </div>
        <h2 className="font-semibold text-gray-800">{project.title}</h2>
      </div>

      {project.description && (
        <p className="text-gray-600 mb-6 line-clamp-2">{project.description}</p>
      )}

      <div className="flex space-x-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <FaTasks className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              {project.tasks?.length || 0}
            </span>
            <span className="text-sm text-gray-500">Tasks</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-full">
            <FaFileAlt className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-800">
              {project.files?.length || 0}
            </span>
            <span className="text-sm text-gray-500">Files</span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-auto">
        {project.isApproved ? (
          <button
            className="w-full py-2 px-4 text-green-500 rounded-md hover:text-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCardClick}
            disabled={isUpdating !== null}
          >
            View Project
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : project.isRejected ? (
          <div className="w-full py-2 px-4 text-red-600 rounded-md text-center">
            Project Rejected
          </div>
        ) : (
          <div className="w-full py-2 px-4 text-yellow-600 rounded-md text-center">
            {isUpdating ? "Updating status..." : "Project Pending"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
