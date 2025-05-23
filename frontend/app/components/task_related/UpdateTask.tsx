// app/components/task_related/UpdateTask.tsx
"use client";
import React, { useState } from "react";
import { TTask, TUser } from "@/app/constants/type";

interface UpdateTaskProps {
  taskToUpdate: TTask;
  closeUpdateTask: () => void;
  onUpdateTask: (updatedTask: TTask) => void;
}

const statusOptions = [
  { value: "not-started", label: "Not Started" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

const UpdateTask: React.FC<UpdateTaskProps> = ({
  taskToUpdate,
  closeUpdateTask,
  onUpdateTask,
}) => {
  const [status, setStatus] = useState<TTask["status"]>(taskToUpdate.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTask({
      ...taskToUpdate,
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Task Status</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Task Name
            </label>
            <p className="text-gray-800">{taskToUpdate.taskName}</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Status
            </label>
            <p className="text-gray-800 capitalize">
              {taskToUpdate.status}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TTask["status"])}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeUpdateTask}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;