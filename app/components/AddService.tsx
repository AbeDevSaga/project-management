import React, { useState } from "react";
import ActionButton from "./ActionButton";
import { TService } from "../constants/type";

interface AddServiceProps {
  closeAddService: () => void; // Updated prop name
  onAddService: (serviceData: TService) => void; // Updated prop name and type
}

const AddService: React.FC<AddServiceProps> = ({ closeAddService, onAddService }) => {
  // State for new service details
  const [name, setName] = useState<TService["name"]>("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TService["category"]>("Communication");
  const [features, setFeatures] = useState<string[]>([]);
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(30);
  const [type, setType] = useState<TService["type"]>("free");
  const [status, setStatus] = useState<TService["status"]>("active");

  // Handle adding a new service
  const handleAddService = () => {
    const newService: TService = {
      name,
      description,
      category,
      features,
      price,
      duration,
      type,
      status,
      createdAt: new Date(), // Set the current date as the creation date
    };

    onAddService(newService); // Pass the new service data to the parent component
    closeAddService(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddService}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Add Service Form */}
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="mt-6 space-y-4 mx-auto p-2 border rounded-lg">
            <h2 className="text-primary">Service Details</h2>

            {/* Floating Label Input for Name */}
            <div className="relative mt-4">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Name"
              />
            </div> 
            {/* Floating Label Input for Description */}
            <div className="relative mt-4">
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Description"
              />
            </div>

            {/* Floating Label Input for Category */}
            <div className="relative mt-4">
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TService["category"])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              >
                <option value="Communication">Communication</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Development">Development</option>
                <option value="Management">Management</option>
              </select>
            </div>

            {/* Floating Label Input for Features */}
            <div className="relative mt-4">
              <input
                type="text"
                id="features"
                value={features.join(", ")} // Convert array to comma-separated string
                onChange={(e) => setFeatures(e.target.value.split(", "))} // Convert string back to array
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Features (comma-separated)"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4 mx-auto p-2 border rounded-lg">
            <h2 className="text-primary">Pricing and Status</h2>

            {/* Floating Label Input for Price */}
            <div className="relative">
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Price"
              />
            </div>

            {/* Floating Label Input for Duration */}
            <div className="relative mt-4">
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
                placeholder="Duration (in days)"
              />
            </div>

            {/* Floating Label Input for Type */}
            <div className="relative mt-4">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as TService["type"])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* Floating Label Input for Status */}
            <div className="relative mt-4">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TService["status"])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Add Service Button */}
            <ActionButton
              label="Add Service"
              icon="service"
              onClick={handleAddService}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;