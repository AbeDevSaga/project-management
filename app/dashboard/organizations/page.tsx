"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import { TOrganization } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import {
  createOrganization,
  fetchOrganizations,
} from "@/app/redux/slices/orgSlice";
import OrganizationCard from "@/app/components/org_related/OrganizationCard";
import AddOrganization from "@/app/components/org_related/AddOrganization";
import { useRouter } from "next/navigation";

function Organizations() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const organizationList = useSelector(
    (state: RootState) => state.organization.organizations
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch services on component mount
  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  // Open the modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
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

  // Close the modals
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle card click to navigate to organization details
  const handleCardClick = (organization: TOrganization) => {
    router.push(`organizations/${organization._id}`);
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
              onCardClick={() => handleCardClick(organization)}
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
    </div>
  );
}

export default Organizations;
