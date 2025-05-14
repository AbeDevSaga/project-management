"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import { TDepartment } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";

import { useRouter } from "next/navigation";
import { fetchAllUsers } from "@/app/redux/slices/userSlice";
import { createDepartment, fetchAllDepartments } from "@/app/redux/slices/deptSlice";
import DepartmentCard from "@/app/components/dept_related/DepartmentCard";
import AddDepartment from "@/app/components/dept_related/AddDepartment";

function Departments() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);
  const departmentList = useSelector(
    (state: RootState) => state.department.departments
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch departments and users on component mount
  useEffect(() => {
    dispatch(fetchAllDepartments());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Open the add department modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // TODO: Implement handleAddDepartment function
  const handleAddDepartment = async (newDepartment: TDepartment) => {
    console.log("Adding new Department...", newDepartment);
    const resultAction = await dispatch(createDepartment(newDepartment));
    if (createDepartment.fulfilled.match(resultAction)) {
      console.log("Department added successfully:", resultAction.payload);
    dispatch(fetchAllDepartments());
      setIsAddModalOpen(false);
    } else {
      console.error("Failed to add Department:", resultAction.payload);
    }
  };

  // Close the modals
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle card click to navigate to department details
  const handleCardClick = (department: TDepartment) => {
    router.push(`department/${department._id}`);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="departments" />
        {/* Only show create button for admin users */}
        {user?.role === "admin" && (
          <div className="w-auto">
            <ActionButton
              label="Create Department"
              onClick={openAddModal}
              icon="department" // You might need to create or choose an appropriate icon
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departmentList.map((department, index) => (
          <div key={index} className="self-start">
            <DepartmentCard
              department={department}
              onCardClick={() => handleCardClick(department)}
            />
          </div>
        ))}
      </div>

      {/* TODO: Implement AddDepartment modal component */}
      {isAddModalOpen && (
        <AddDepartment
          users={users}
          closeAddDepartment={closeAddModal}
          onAddDepartment={handleAddDepartment}
        />
      )}
    </div>
  );
}

export default Departments;