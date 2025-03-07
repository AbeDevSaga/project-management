import { TOrganization } from "@/app/constants/type";
import React from "react";

interface DeleteOrganizationProps {
  organization: TOrganization; // The organization data to be deleted
  closeDeleteOrganization: () => void; // Function to close the modal
  onDeleteOrganization: () => void; // Function to handle organization deletion
}

const DeleteOrganization: React.FC<DeleteOrganizationProps> = ({
  organization,
  closeDeleteOrganization,
  onDeleteOrganization,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="relative bg-white rounded-lg shadow-lg py-6 w-full max-w-md">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeDeleteOrganization}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Organization Details */}
        <div className="flex flex-col items-center space-y-4">
          {/* Organization Name */}
          <h2 className="text-2xl font-semibold text-gray-800">
            {organization.name}
          </h2>

          {/* Organization Description */}
          {organization.description && (
            <p className="text-gray-600 text-center">{organization.description}</p>
          )}

          {/* Organization Address */}
          {organization.address && (
            <p className="text-gray-600 text-center">
              <span className="font-medium">Address:</span> {organization.address}
            </p>
          )}

          {/* Organization Phone */}
          {organization.phone && (
            <p className="text-gray-600 text-center">
              <span className="font-medium">Phone:</span> {organization.phone}
            </p>
          )}

          {/* Organization Email */}
          {organization.email && (
            <p className="text-gray-600 text-center">
              <span className="font-medium">Email:</span> {organization.email}
            </p>
          )}

          {/* Organization Website */}
          {organization.website && (
            <p className="text-gray-600 text-center">
              <span className="font-medium">Website:</span>{" "}
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {organization.website}
              </a>
            </p>
          )}

          {/* Confirmation Message */}
          <div className="flex-col items-center space-y-4">
            <p className="text-gray-600 text-center">
              Are you sure you want to delete this organization?
            </p>

            {/* Action Buttons */}
            <div className="flex text-white space-x-2">
              {/* Cancel Button */}
              <button
                onClick={closeDeleteOrganization}
                className="w-full text-center cursor-pointer px-4 py-2 bg-primary rounded-lg hover:text-primary hover:bg-white transition-all duration-300 border border-primary shadow-xl"
              >
                Cancel
              </button>

              {/* Delete Button */}
              <button
                onClick={onDeleteOrganization}
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

export default DeleteOrganization;