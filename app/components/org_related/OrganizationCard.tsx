import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TOrganization } from "../../constants/type";

interface OrganizationCardProps {
  organization: TOrganization;
  onUpdate: (organization: TOrganization) => void;
  onDelete: (organization: TOrganization) => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onUpdate,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false); // State to toggle actions visibility

  return (
    <div className="bg-white relative rounded-lg shadow-md p-6 pb-3 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full min-h-[300px]">
      {/* Three dots menu */}
      <div className="absolute top-2 right-2">
        <BsThreeDotsVertical
          onClick={() => setShowActions(!showActions)}
          className="text-gray-600 cursor-pointer"
        />
      </div>
      {/* Actions */}
      {showActions && (
        <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md">
          <div
            onClick={() => onUpdate({ ...organization, _id: organization._id || "" })}
            className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
          >
            Update Organization
          </div>
          <div
            onClick={() => onDelete({ ...organization, _id: organization._id || "" })}
            className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
          >
            Delete Organization
          </div>
        </div>
      )}

      {/* Organization Logo and Name */}
      <div className="flex items-center mb-4">
        {organization.logo && (
          <img
            src={organization.logo}
            alt={`${organization.name} Logo`}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        )}
        <h2 className="text-xl font-semibold text-gray-800">{organization.name}</h2>
      </div>

      {/* Organization Description */}
      {organization.description && (
        <p className="text-gray-600 mb-4">{organization.description}</p>
      )}

      {/* Organization Details */}
      <div className="space-y-2 text-sm text-gray-600">
        {organization.address && (
          <p>
            <span className="font-medium">Address:</span> {organization.address}
          </p>
        )}
        {organization.phone && (
          <p>
            <span className="font-medium">Phone:</span> {organization.phone}
          </p>
        )}
        {organization.email && (
          <p>
            <span className="font-medium">Email:</span> {organization.email}
          </p>
        )}
        {organization.website && (
          <p>
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
        {organization.superAdmin && (
          <p>
            <span className="font-medium">Super Admin:</span>{" "}
            {organization.superAdmin.name}
          </p>
        )}
        <p>
          <span className="font-medium">Total Users:</span>{" "}
          {22}
        </p>
        <p>
          <span className="font-medium">Total Projects:</span>{" "}
          {32}
        </p>
        {organization.createdAt && (
          <p>
            <span className="font-medium">Created At:</span>{" "}
            {new Date(organization.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrganizationCard;