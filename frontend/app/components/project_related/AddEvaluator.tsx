import React, { useState } from "react";
import ActionButton from "../ActionButton";
import { TUser } from "@/app/constants/type";

interface AddEvaluatorsProps {
  advisor: TUser;
  evaluators?: TUser[];
  users: TUser[]; // List of all users
  projectId: string; // ID of the project to add Advisors to
  closeAddEvaluators: () => void; // Callback to close the modal
  onAddEvaluators: (evaluatorsIds: string[], projectId: string) => void; // Callback to add sAdvisors
}

const AddEvaluators: React.FC<AddEvaluatorsProps> = ({
  evaluators,
  advisor,
  users,
  projectId,
  closeAddEvaluators,
  onAddEvaluators,
}) => {
  // State for selected advisor IDs
  const [selectedAdvisors, setSelectedAdvisors] = useState<string[]>([]);

  // Filter users to get only non-students (advisors)
  console.log("advisor: ", advisor);
  console.log("users: ", users);
  let advisors = users.filter(
    (user) =>
      (user.role === "advisor" || user.role === "departmentHead") &&
      user._id !== advisor._id
  );
  if(evaluators && evaluators?.length > 0){
    advisors = advisors.filter((user) =>
      !evaluators.some((evaluator) =>
        evaluator._id === user._id
    ));
  }
  // Toggle advisor selection
  const toggleAdvisorSelection = (advisorId: string) => {
    setSelectedAdvisors((prev) =>
      prev.includes(advisorId)
        ? prev.filter((id) => id !== advisorId)
        : [...prev, advisorId]
    );
  };

  // Select all advisors
  const selectAllAdvisors = () => {
    if (selectedAdvisors.length === advisors.length) {
      setSelectedAdvisors([]);
    } else {
      setSelectedAdvisors(advisors.map((advisor) => advisor._id!));
    }
  };

  // Handle adding selected advisors
  const handleAddAdvisors = () => {
    if (selectedAdvisors.length === 0) {
      alert("Please select at least one advisor!");
      return;
    }
    console.log("add avisors: ", selectedAdvisors);
    onAddEvaluators(selectedAdvisors, projectId);
    closeAddEvaluators();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddEvaluators}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-primary text-xl font-semibold">
            Add Evaluators to Project
          </h2>
        </div>

        {/* Select All Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={
              selectedAdvisors.length === advisors.length && advisors.length > 0
            }
            onChange={selectAllAdvisors}
            className="mr-3 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="font-medium">
            {selectedAdvisors.length === advisors.length && advisors.length > 0
              ? "Deselect All"
              : "Select All"}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            ({selectedAdvisors.length} selected)
          </span>
        </div>

        {/* Advisor List */}
        <div className="space-y-3">
          {advisors.length === 0 ? (
            <p className="text-center text-gray-500">No advisors available</p>
          ) : (
            advisors.map((advisor) => (
              <div
                key={advisor._id}
                className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleAdvisorSelection(advisor._id!)}
              >
                <input
                  type="checkbox"
                  checked={selectedAdvisors.includes(advisor._id!)}
                  onChange={() => toggleAdvisorSelection(advisor._id!)}
                  className="mr-3 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{advisor.username}</h3>
                  <p className="text-sm text-gray-600">{advisor.email}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {advisor.role}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={closeAddEvaluators}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <ActionButton
            label={`Add ${
              selectedAdvisors.length > 0 ? selectedAdvisors.length : ""
            } Evaluator${selectedAdvisors.length !== 1 ? "s" : ""}`}
            icon="add_user"
            onClick={handleAddAdvisors}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEvaluators;
