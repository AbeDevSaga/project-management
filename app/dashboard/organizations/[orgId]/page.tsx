"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TOrganization } from "@/app/constants/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizationById,
  updateOrganization,
} from "@/app/redux/slices/orgSlice";
import SectionHeader from "@/app/components/SectionHeader";
import ActionButton from "@/app/components/ActionButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import UpdateOrganization from "@/app/components/org_related/UpdateOrganization";
import DeleteOrganization from "@/app/components/org_related/DeleteOrganization";

const OrganizationDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orgId } = useParams() as { orgId: string };
  const [organization, setOrganization] = useState<TOrganization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showActions, setShowActions] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<TOrganization | null>(null);
  // Open the modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const openUpdateModal = (service: TOrganization) => {
    setIsUpdateModalOpen(true);
    setSelectedOrganization(service);
  };
  const openDeleteModal = (service: TOrganization) => {
    setSelectedOrganization(service);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleAddOrganization = async (newService: TOrganization) => {
    console.log("Adding new Organization...", newService);
    const resultAction = await dispatch(createOrganization(newService));
    if (createOrganization.fulfilled.match(resultAction)) {
      console.log("Organization added successfully:", resultAction.payload);
      setIsAddModalOpen(false);
    } else {
      console.error("Failed to add Organization:", resultAction.payload);
    }
  };
  const handleUpdateOrganization = async (updatedService: TOrganization) => {
    console.log("updatedOrganization: ", updatedService);
    if (selectedOrganization) {
      const resultAction = await dispatch(
        updateOrganization({
          id: selectedOrganization._id || "",
          organizationData: updatedService,
        })
      );
      if (updateOrganization.fulfilled.match(resultAction)) {
        console.log("Organization updated successfully:", resultAction.payload);
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update Organization:", resultAction.payload);
      }
    }
  };
  const handleDeleteOrganization = async () => {
    console.log("Deleting Organization:", selectedOrganization);
    const resultAction = await dispatch(
      deleteOrganization(selectedOrganization?._id || "")
    );
    if (deleteOrganization.fulfilled.match(resultAction)) {
      console.log("Organization deleted successfully:", resultAction.payload);
      setIsDeleteModalOpen(false);
    } else {
      console.error("Failed to delete Organization:", resultAction.payload);
    }
  };

  // Close the modals
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Fetch organization data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (orgId) {
        try {
          setLoading(true);
          const response = await dispatch(fetchOrganizationById(orgId));
          if (fetchOrganizationById.fulfilled.match(response)) {
            setOrganization(response.payload);
          } else if (fetchOrganizationById.rejected.match(response)) {
            setError("Failed to fetch organization data");
          }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, orgId]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where organization data is not available
  if (!organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
      <div className="p-6 bg-white rounded-lg shadow-md">
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
              onClick={() =>
                openUpdateModal({
                  ...organization,
                  _id: organization._id || "",
                })
              }
              className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update Organization
            </div>
            <div
              onClick={() =>
                openDeleteModal({
                  ...organization,
                  _id: organization._id || "",
                })
              }
              className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete Organization
            </div>
          </div>
        )}
        {/* Organization Name and Logo */}
        <div className="flex items-center space-x-4 mb-6">
          {organization.logo && (
            <img
              src={organization.logo}
              alt={`${organization.name} Logo`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-800">
            {organization.name}
          </h1>
        </div>

        {/* Organization Description */}
        {organization.description && (
          <p className="text-gray-600 mb-6">{organization.description}</p>
        )}

        {/* Organization Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Address */}
          {organization.address && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Address</h2>
              <p className="text-gray-800">{organization.address}</p>
            </div>
          )}

          {/* Phone */}
          {organization.phone && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Phone</h2>
              <p className="text-gray-800">{organization.phone}</p>
            </div>
          )}

          {/* Email */}
          {organization.email && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Email</h2>
              <p className="text-gray-800">{organization.email}</p>
            </div>
          )}

          {/* Website */}
          {organization.website && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Website</h2>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {organization.website}
              </a>
            </div>
          )}

          {/* Super Admin */}
          {organization.superAdmin && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Super Admin
              </h2>
              <p className="text-gray-800">{organization.superAdmin.name}</p>
            </div>
          )}

          {/* Created At */}
          {organization.createdAt && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Created At
              </h2>
              <p className="text-gray-800">
                {new Date(organization.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Users Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
          <div className="w-auto">
            <ActionButton
              label="Add Users"
              onClick={openAddModal}
              icon="user"
            />
          </div>
        </div>
        {/* <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {organization.users.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3"
                >
                  <img
                    src={user.avatar} // Assuming user has an avatar field
                    alt={`${user.name} Avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="text-gray-800">{user.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
      {/* Projects Section */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="projects" />
          <div className="w-auto">
            <ActionButton
              label="Add Project"
              onClick={openAddModal}
              icon="user"
            />
          </div>
        </div>
        {/*
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {organization.projects.map((project) => (
                <div key={project._id} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {project.name}
                  </h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
      {isUpdateModalOpen && selectedOrganization && (
        <UpdateOrganization
          closeUpdateOrganization={closeUpdateModal}
          onUpdateOrganization={handleUpdateOrganization}
          organizationToUpdate={selectedOrganization}
        />
      )}
      {isDeleteModalOpen && selectedOrganization && (
        <DeleteOrganization
          organization={selectedOrganization}
          closeDeleteOrganization={closeDeleteModal}
          onDeleteOrganization={handleDeleteOrganization}
        />
      )}
    </div>
  );
};

export default OrganizationDetailsPage;
