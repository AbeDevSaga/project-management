"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import { TOrganization } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { createOrganization, deleteOrganization, fetchOrganizations, updateOrganization } from "@/app/redux/slices/orgSlice";
import OrganizationCard from "@/app/components/org_related/OrganizationCard";
import AddOrganization from "@/app/components/org_related/AddOrganization";
import UpdateOrganization from "@/app/components/org_related/UpdateOrganization";
import DeleteOrganization from "@/app/components/org_related/DeleteOrganization";

function Organizations() {
  const dispatch = useDispatch<AppDispatch>();
  const organizationList = useSelector(
    (state: RootState) => state.organization.organizations
  ); // Access services from Redux store
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<TOrganization | null>(null);

  // Fetch services on component mount
  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

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
    console.log("updatedOrganization: ", updatedService)
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
  const handleDeleteOrganization = async() => {
    console.log("Deleting Organization:", selectedOrganization);
    const resultAction = await dispatch(deleteOrganization(selectedOrganization?._id || ""));
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

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="organizations" />
        <div className="w-auto">
          <ActionButton
            label="Add Organizations"
            onClick={openAddModal}
            icon="service"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizationList.map((organization, index) => (
          <div key={index} className="self-start">
            <OrganizationCard
              organization={organization}
              onUpdate={openUpdateModal}
              onDelete={openDeleteModal}
            />
          </div>
        ))}
      </div>
      {isAddModalOpen && (
        <AddOrganization
          closeAddOrganization={closeAddModal}
          onAddOrganization={handleAddOrganization}
        />
      )}
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
}

export default Organizations;
