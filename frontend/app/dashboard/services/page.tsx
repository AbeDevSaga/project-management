"use client";
import ActionButton from "@/app/components/ActionButton";
import AddService from "@/app/components/service_related/AddService";
import SectionHeader from "@/app/components/SectionHeader";
import ServiceCard from "@/app/components/service_related/ServiceCard";
import UpdateService from "@/app/components/service_related/UpdateService";
import { TService } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import DeleteService from "@/app/components/service_related/DeleteService";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import { fetchServices, updateService, createService, deleteService } from "@/app/redux/slices/serviceSlice";

function Services() {
  const dispatch = useDispatch<AppDispatch>();
  const servicesList = useSelector(
    (state: RootState) => state.service.services
  ); // Access services from Redux store
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<TService | null>(null);

  // Fetch services on component mount
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  // Open the modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };
  const openUpdateModal = (service: TService) => {
    setIsUpdateModalOpen(true);
    setSelectedService(service);
  };
  const openDeleteModal = (service: TService) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleAddServices = async (newService: TService) => {
    console.log("Adding new Services...", newService);
    const resultAction = await dispatch(createService(newService));
    if (createService.fulfilled.match(resultAction)) {
      console.log("Service added successfully:", resultAction.payload);
      setIsAddModalOpen(false);
    } else {
      console.error("Failed to add service:", resultAction.payload);
    }
  };
  const handleUpdateService = async (updatedService: TService) => {
    console.log("updatedService: ", updatedService)
    if (selectedService) {
      const resultAction = await dispatch(
        updateService({
          id: selectedService._id || "",
          serviceData: updatedService,
        })
      );
      if (updateService.fulfilled.match(resultAction)) {
        console.log("Service updated successfully:", resultAction.payload);
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update service:", resultAction.payload);
      }
    }
  };
  const handleDeleteService = async() => {
    console.log("Deleting service:", selectedService);
    const resultAction = await dispatch(deleteService(selectedService?._id || ""));
    if (deleteService.fulfilled.match(resultAction)) {
      console.log("Service deleted successfully:", resultAction.payload);
      setIsDeleteModalOpen(false);
    } else {
      console.error("Failed to delete service:", resultAction.payload);
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
        <SectionHeader sectionKey="services" />
        <div className="w-auto">
          <ActionButton
            label="Add Services"
            onClick={openAddModal}
            icon="service"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service, index) => (
          <div key={index} className="self-start">
            <ServiceCard
              service={service}
              onUpdate={openUpdateModal}
              onDelete={openDeleteModal}
            />
          </div>
        ))}
      </div>
      {isAddModalOpen && (
        <AddService
          closeAddService={closeAddModal}
          onAddService={handleAddServices}
        />
      )}
      {isUpdateModalOpen && selectedService && (
        <UpdateService
          closeUpdateService={closeUpdateModal}
          onUpdateService={handleUpdateService}
          serviceToUpdate={selectedService}
        />
      )}
      {isDeleteModalOpen && selectedService && (
        <DeleteService
          service={selectedService}
          closeDeleteService={closeDeleteModal}
          onDeleteService={handleDeleteService}
        />
      )}
    </div>
  );
}

export default Services;
