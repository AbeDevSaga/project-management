"use client";
import React, { useState } from "react";
import { FiX, FiSend} from "react-icons/fi";
import { TNotification } from "@/app/constants/type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import Alert from "@/app/components/AlertProp";
import MultiSelectUsers from "./MultiSelectUsers";
import { createNotification } from "@/app/redux/slices/notificationSlice";

interface AddNotificationProps {
  closeModal: () => void;
  userId: string;
}

const notificationTypes = [
  "Project Update",
  "Approval Required",
  "Feedback",
  "Reminder",
  "General",
  "Message"
];

const AddNotification: React.FC<AddNotificationProps> = ({ closeModal, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector((state: RootState) => state.project.projects);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<TNotification, "_id" | "status" | "timestamp">>({
    recipients: [],
    type: "General",
    message: "",
    projectId: undefined,
    sender: userId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.recipients.length === 0) {
      setAlert({
        status: "error",
        text: "Please select at least one recipient"
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.message.trim()) {
      setAlert({
        status: "error",
        text: "Please enter a message"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(createNotification(formData)).unwrap();
      setAlert({
        status: "success",
        text: "Notification sent successfully"
      });
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      setAlert({
        status: "error",
        text: error instanceof Error ? error.message : "Failed to send notification"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecipientsChange = (selectedUsers: string[]) => {
    setFormData({ ...formData, recipients: selectedUsers });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Create New Notification</h3>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {alert && (
            <Alert
              status={alert.status}
              text={alert.text}
              onClose={() => setAlert(null)}
            />
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipients <span className="text-red-500">*</span>
            </label>
            <MultiSelectUsers
              selectedUsers={formData.recipients}
              onChange={handleRecipientsChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Type
            </label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {notificationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Project (optional)
            </label>
            <div className="relative">
              <select
                name="projectId"
                value={formData.projectId || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your notification message..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <FiSend className="mr-2" />
                  Send Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotification;