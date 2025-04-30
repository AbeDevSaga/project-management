"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import React, { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { createManual, fetchManuals } from "@/app/redux/slices/manualSlice";
import { TManual } from "@/app/constants/type";
import ManualCard from "@/app/components/maual_realted/ManualCard";
import AddManual from "@/app/components/maual_realted/AddManual";
import UpdateManual from "@/app/components/maual_realted/UpdateManual";

function Manuals() {
  const dispatch = useDispatch<AppDispatch>();
  const manualList = useSelector((state: RootState) => state.manual.manuals);
  const [selectedManual, setSelectedManual] = useState<TManual | null>(null);
  const [isAddManualOpen, setIsAddManual] = useState(false);
  const [isUpdateManualOpen, setIsUpdateManual] = useState(false);

  useEffect(() => {
    dispatch(fetchManuals());
  }, [dispatch]);

  // Open the modals
  const openAddModal = () => {
    setIsAddManual(true);
  };
  const openUpdateModal = (manual: TManual) => {
    setSelectedManual(manual);
    setIsUpdateManual(true);
  };

  const handleAddManual = async (formData: FormData) => {
    try {
      await dispatch(createManual(formData)).unwrap();
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  const handleUpdateManual = (manual: TManual) => {
    // Handle edit logic
    console.log("Update manual:", manual);
  };

  // Close the modals
  const closeAddModal = () => {
    setIsAddManual(false);
  };
  const closeUpdateModal = () => {
    setIsAddManual(false);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="users" />
        <div className="w-auto">
          <ActionButton
            label="Create Manuals"
            onClick={openAddModal}
            icon="upload"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {manualList.map((manual) => (
          <ManualCard
            key={manual._id}
            manual={manual}
            oUpdateModal={openUpdateModal}
          />
        ))}
      </div>
      {isAddManualOpen && (
        <AddManual
          closeAddManual={closeAddModal}
          onAddManual={handleAddManual}
        />
      )}
      {isUpdateManualOpen && selectedManual && (
        <UpdateManual
          closeUpdateManual={() => setIsUpdateManual(false)}
          onUpdateManual={handleUpdateManual}
          manualToUpdate={selectedManual}
        />
      )}
    </div>
  );
}

export default Manuals;
