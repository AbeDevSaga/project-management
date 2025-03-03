import React, { useState } from "react";
import { Service } from "../../utils/type";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TService } from "../../constants/type";

interface ServiceCardProps {
  service: TService;
  onUpdate: (service: Service) => void;
  onDelete: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onUpdate, onDelete }) => {
  const [showFeatures, setShowFeatures] = useState(false); // State to toggle features visibility
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
            onClick={() => onUpdate({ ...service, _id: service._id || "" })}
            className="right-2 bg-white px-4 pb-2  cursor-pointer hover:text-primary duration-300"
          >
            Update Service
          </div>
          <div
            onClick={() => onDelete({ ...service, _id: service._id || "" })}
            className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
          >
            Delete Service
          </div>
        </div>
      )}
      {/* Service Name and Type */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{service.name}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            service.type === "free"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {service.type === "free" ? "Free" : `Premium - $${service.price}`}
        </span>
      </div>

      {/* Service Description */}
      <p className="text-gray-600 mb-4">{service.description}</p>

      {/* Category */}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Category:</span> {service.category}
      </p>

      {/* Duration (for premium services) */}
      {service.type === "premium" && (
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium">Duration:</span> {service.duration} days
        </p>
      )}

      {/* Features Section (Collapsible) */}
      <div className="mb-4 flex-grow">
        {showFeatures && (
          <ul className="list-disc list-inside text-gray-600 mt-2">
            {service.features.map((feature, index) => (
              <li key={index} className="mb-1">
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View Features Button */}
      <div className="w-full mt-auto">
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="w-full text-center text-blue-600 hover:text-blue-800 font-medium focus:outline-none py-2 border-t border-gray-200"
        >
          {showFeatures ? "Hide Features" : "View Features"}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
