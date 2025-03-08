import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { TOrganization } from "../../constants/type";

interface UpdateOrganizationProps {
  closeUpdateOrganization: () => void; // Function to close the modal
  onUpdateOrganization: (organizationData: TOrganization) => void; // Function to handle organization update
  organizationToUpdate: TOrganization; // The organization data to be updated
}

const UpdateOrganization: React.FC<UpdateOrganizationProps> = ({
  closeUpdateOrganization,
  onUpdateOrganization,
  organizationToUpdate,
}) => {
  // State for updated organization details
  const [name, setName] = useState<TOrganization["name"]>(organizationToUpdate.name);
  const [description, setDescription] = useState(organizationToUpdate.description);
  const [address, setAddress] = useState(organizationToUpdate.address);
  const [phone, setPhone] = useState(organizationToUpdate.phone);
  const [email, setEmail] = useState(organizationToUpdate.email);
  const [website, setWebsite] = useState(organizationToUpdate.website);
  const [logo, setLogo] = useState(organizationToUpdate.logo);

  // Pre-fill the form with the organization data
  useEffect(() => {
    setName(organizationToUpdate.name);
    setDescription(organizationToUpdate.description);
    setAddress(organizationToUpdate.address);
    setPhone(organizationToUpdate.phone);
    setEmail(organizationToUpdate.email);
    setWebsite(organizationToUpdate.website);
    setLogo(organizationToUpdate.logo);
  }, [organizationToUpdate]);

  // Handle updating the organization
  const handleUpdateOrganization = () => {
    const updatedOrganization: TOrganization = {
      ...organizationToUpdate, // Keep the existing fields like _id and created_at
      name,
      description,
      address,
      phone,
      email,
      website,
      logo,
    };

    onUpdateOrganization(updatedOrganization); // Pass the updated organization data to the parent component
    closeUpdateOrganization(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeUpdateOrganization}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Update Organization Form */}
        <div className="mt-6">
          <h2 className="text-primary text-xl font-semibold mb-4">Organization Details</h2>

          {/* Grid Layout for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Name"
                />
              </div>

              {/* Description */}
              <div className="relative">
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Description"
                />
              </div>

              {/* Address */}
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Address"
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="relative">
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Phone"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Email"
                />
              </div>

              {/* Website */}
              <div className="relative">
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Website"
                />
              </div>

              {/* Logo */}
              <div className="relative">
                <input
                  type="url"
                  id="logo"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Logo URL"
                />
              </div>
            </div>
          </div>

          {/* Update Organization Button */}
          <div className="mt-6 flex items-center justify-center">
            <ActionButton
              label="Update Organization"
              icon="organization"
              onClick={handleUpdateOrganization}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrganization;