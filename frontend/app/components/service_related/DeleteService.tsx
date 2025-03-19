import { TService } from "@/app/constants/type";
import React from "react";

interface DeleteServiceProps {
  service: TService; // The service data to be deleted
  closeDeleteService: () => void; // Function to close the modal
  onDeleteService: () => void; // Function to handle service deletion
}

const DeleteService: React.FC<DeleteServiceProps> = ({
  service,
  closeDeleteService,
  onDeleteService,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-lg py-6 w-full max-w-md">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeDeleteService}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Service Details */}
        <div className="flex flex-col items-center space-y-4">
          {/* Service Name */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {service.name}
          </h2>

          {/* Service Description */}
          <p className="text-gray-600 text-center">{service.description}</p>

          {/* Service Status */}
          <div className="p-2 flex space-x-2 items-center">
            <p
              className={`w-2 h-2 border rounded-full ${
                service.status === "active"
                  ? "bg-green-800"
                  : "bg-red-800"
              }`}
            ></p>
            <span
              className={`text-sm font-semibold rounded-lg ${
                service.status === "active"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {service.status}
            </span>
          </div>

          {/* Confirmation Message */}
          <div className="flex-col items-center space-y-4">
            <p className="text-gray-600 text-center">
              Are you sure you want to delete this service?
            </p>

            {/* Action Buttons */}
            <div className="flex text-white space-x-2">
              {/* Cancel Button */}
              <button
                onClick={closeDeleteService}
                className="w-full text-center cursor-pointer px-4 py-2 bg-primary rounded-lg hover:text-primary hover:bg-white transition-all duration-300 border border-primary shadow-xl"
              >
                Cancel
              </button>

              {/* Delete Button */}
              <button
                onClick={onDeleteService}
                className="w-full text-center cursor-pointer px-4 py-2 bg-red-500 rounded-lg hover:text-red-500 hover:bg-white transition-all duration-300 border border-red-500 shadow-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteService;