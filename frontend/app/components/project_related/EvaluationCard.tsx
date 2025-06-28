import React from 'react';
import { TProject, TEvaluation } from "../../constants/type";
import { HiOutlineUser } from "react-icons/hi2";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface EvaluationCardProps {
  evaluation: TEvaluation;
  project?: TProject;
  onCardClick?: () => void;
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation, project, onCardClick }) => {
  // Calculate total marks if not provided
  const totalMarks = evaluation.totalMarks || (
    evaluation.presentation +
    evaluation.knowledgeDomain +
    evaluation.knowledgeMethodology +
    evaluation.questionConfidence +
    evaluation.contentClarity +
    evaluation.problemStatement +
    evaluation.objectivesSignificance +
    evaluation.projectMethodology +
    evaluation.useCaseDiagram +
    evaluation.sequenceActivityDiagram +
    evaluation.classDiagram +
    evaluation.persistenceDiagram
  );

  const percentage = ((totalMarks / 60) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Header with evaluator and date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <HiOutlineUser className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {typeof evaluation.evaluator === 'object' 
                ? evaluation.evaluator.username 
                : 'Evaluator'}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(evaluation.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        {project && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">{project.title}</p>
            <p className="text-xs text-gray-400">
              {project.projectStatus || 'In Progress'}
            </p>
          </div>
        )}
      </div>

      {/* Evaluation Summary */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-700">Total Score</span>
          <span className="font-bold">
            {totalMarks.toFixed(1)}/60 ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-600 font-medium">Presentation</p>
          <p className="font-bold">{evaluation.presentation}/6</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-green-600 font-medium">Knowledge</p>
          <p className="font-bold">
            {(evaluation.knowledgeDomain + evaluation.knowledgeMethodology).toFixed(1)}/12
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-xs text-purple-600 font-medium">Methodology</p>
          <p className="font-bold">{evaluation.projectMethodology}/4</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-xs text-yellow-600 font-medium">Diagrams</p>
          <p className="font-bold">
            {(evaluation.useCaseDiagram + evaluation.sequenceActivityDiagram + 
              evaluation.classDiagram + evaluation.persistenceDiagram).toFixed(1)}/18
          </p>
        </div>
      </div>

      {/* Comments */}
      {evaluation.comments && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Comments</h4>
          <p className="text-sm text-gray-600 line-clamp-3">
            {evaluation.comments}
          </p>
        </div>
      )}

      {/* Status and Action */}
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center">
          {evaluation.status === 'completed' ? (
            <FaCheckCircle className="text-green-500 mr-2" />
          ) : (
            <FaTimesCircle className="text-yellow-500 mr-2" />
          )}
          <span className="text-sm font-medium">
            {evaluation.status === 'completed' ? 'Completed' : 'Pending Review'}
          </span>
        </div>
        <button
          onClick={onCardClick}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
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
      </div>
    </div>
  );
};

export default EvaluationCard;