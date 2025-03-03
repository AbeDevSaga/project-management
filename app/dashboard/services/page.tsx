"use client";
import ActionButton from "@/app/components/ActionButton";
import AddService from "@/app/components/service_related/AddService";
import SectionHeader from "@/app/components/SectionHeader";
import ServiceCard from "@/app/components/service_related/ServiceCard";
import UpdateService from "@/app/components/service_related/UpdateService";
import { TService } from "@/app/constants/type";
import { useServiceStore } from "@/app/utils/serviceStore";
import React, { useEffect, useState } from "react";

function Services() {
  const fetchServices = useServiceStore((state) => state.fetchServices);
  const servicesList = useServiceStore((state) => state.listServices);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isUpdateServiceOpen, setIsUpdateServiceOpen] = useState(false);
  const [serviceToUpdate, setServiceToUpdate] = useState<TService | null>(null);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Open the modals
  const handleAddServices = () => {
    console.log("Adding new Services...");
    setIsAddServiceOpen(true);
  };
  const handleUpdate = (service: TService) => {
    console.log("Service To Update:", serviceToUpdate);
    console.log("Updating Service:", service);
    setIsUpdateServiceOpen(true);
    setServiceToUpdate(service);
  };

  // Close the modals
  const handleCloseServices = () => {
    setIsAddServiceOpen(false);
  };
  const handleCloseUpdateServices = () => {
    setIsUpdateServiceOpen(false);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="services" />
        <div className="w-auto">
          <ActionButton
            label="Add Services"
            onClick={handleAddServices}
            icon="service"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((service, index) => (
          <div key={index} className="self-start">
            <ServiceCard service={service} onUpdate={handleUpdate} />
          </div>
        ))}
      </div>
      {isAddServiceOpen && (
        <AddService
          closeAddService={handleCloseServices}
          onAddService={handleAddServices}
        />
      )}
      {isUpdateServiceOpen && serviceToUpdate && (
        <UpdateService
          closeUpdateService={handleCloseUpdateServices}
          onUpdateService={handleAddServices}
          serviceToUpdate={serviceToUpdate}
        />
      )}
    </div>
  );
}

export default Services;
