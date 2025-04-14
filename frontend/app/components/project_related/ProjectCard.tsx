import React from "react";
import { TProject } from "../../constants/type";
import { FaTasks, FaFileAlt } from "react-icons/fa";
import { HiOutlineCalendar } from "react-icons/hi2";

interface ProjectCardProps {
  project: TProject;
  onCardClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCardClick }) => {
  return (
    <div className="bg-white relative rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full min-h-[300px]">
      {/* Project Name and Status */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200 shadow-sm">
          <HiOutlineCalendar className="w-6 h-6 text-gray-500" />
        </div>
        <h2 className="font-semibold text-gray-800">{project.title}</h2>
      </div>

      {/* Project Description */}
      {project.description && (
        <p className="text-gray-600 mb-6 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Project Stats */}
      <div className="flex space-x-6 mb-6">
        {/* Tasks Count */}
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

        {/* Files Count */}
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

      {/* Project View Button */}
      <button
        className="mt-auto w-full py-2 px-4 text-primary rounded-md hover:text-blue-600 transition-colors duration-300"
        onClick={onCardClick}
      >
        View Project
      </button>
    </div>
  );
};

export default ProjectCard;