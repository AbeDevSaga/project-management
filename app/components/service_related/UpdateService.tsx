import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TService } from "../../constants/type";

interface UpdateServiceProps {
  closeUpdateService: () => void; 
  onUpdateService: (serviceData: TService) => void; 
  serviceToUpdate: TService;
}

const UpdateService: React.FC<UpdateServiceProps> = ({
  closeUpdateService,
  onUpdateService,
  serviceToUpdate,
}) => {
  // State for updated service details
  const [name, setName] = useState<TService["name"]>(serviceToUpdate.name);
  const [description, setDescription] = useState(serviceToUpdate.description);
  const [category, setCategory] = useState<TService["category"]>(serviceToUpdate.category);
  const [features, setFeatures] = useState<string[]>(serviceToUpdate.features);
  const [price, setPrice] = useState(serviceToUpdate.price);
  const [duration, setDuration] = useState(serviceToUpdate.duration);
  const [type, setType] = useState<TService["type"]>(serviceToUpdate.type);
  const [status, setStatus] = useState<TService["status"]>(serviceToUpdate.status);

  // Pre-fill the form with the service data
  useEffect(() => {
    setName(serviceToUpdate.name);
    setDescription(serviceToUpdate.description);
    setCategory(serviceToUpdate.category);
    setFeatures(serviceToUpdate.features);
    setPrice(serviceToUpdate.price);
    setDuration(serviceToUpdate.duration);
    setType(serviceToUpdate.type);
    setStatus(serviceToUpdate.status);
  }, [serviceToUpdate]);

  // Handle updating the service
  const handleUpdateService = () => {
    const updatedService: TService = {
      ...serviceToUpdate, // Keep the existing fields like _id and createdAt
      name,
      description,
      category,
      features,
      price,
      duration,
      type,
      status,
    };

    onUpdateService(updatedService); // Pass the updated service data to the parent component
    closeUpdateService(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeUpdateService}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Update Service Form */}
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="mt-6 space-y-4 mx-auto p-2 border rounded-lg">
            <h2 className="text-primary">Service Details</h2>

            {/* Floating Label Input for Name */}
            <div className="relative">
              <select
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value as TService["name"])}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
              >
                <option value="" disabled>Select Service Name</option>
                <option value="Authentication">Authentication</option>
                <option value="Chat">Chat</option>
                <option value="Video Call">Video Call</option>
                <option value="File Management">File Management</option>
                <option value="Live Editor">Live Editor</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Docker">Docker</option>
                <option value="CLI">CLI</option>
                <option value="Version Control">Version Control</option>
              </select>
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

            {/* Update Service Button */}
            <ActionButton
              label="Update Service"
              icon="service"
              onClick={handleUpdateService}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateService;