"use client";
import ActionButton from "@/app/components/ActionButton";
import AddUser from "@/app/components/user_related/AddUser";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/user_related/UsersTable";
import React, { useEffect, useState } from "react";
import {
  createUser,
  selectDepartmentHeads,
} from "@/app/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { TUser } from "@/app/constants/type";
import { useRouter } from "next/navigation";
import { fetchAllDepartments } from "@/app/redux/slices/deptSlice";

function Students() {
  const router = useRouter();
  const dept_heads = useSelector(selectDepartmentHeads);
  const departmentList = useSelector(
    (state: RootState) => state.department.departments
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal
  useEffect(() => {
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  const handleAddUser = () => {
    console.log("Opening Add User modal...");
    setIsAddUserOpen(true); // Open the modal
  };
  const handleViewUser = (user: TUser) => {
    router.push(`department-heads/${user._id}`);
  };
  const handleCloseAddUser = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const handleSaveUser = async (newUser: TUser) => {
    console.log("New User Data:", newUser);
    const resultAction = await dispatch(createUser(newUser));
    if (createUser.fulfilled.match(resultAction)) {
      console.log("User added successfully:", resultAction.payload);
      setIsAddUserOpen(false); // Close the modal after saving
    } else {
      console.error("Failed to add user:", resultAction.payload);
    }
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="users" />
        <div className="w-auto">
          <ActionButton
            label="Create Department Head"
            onClick={handleAddUser}
            icon="add_user"
          />
        </div>
      </div>
      <UserTable onViewUser={handleViewUser} users={dept_heads} px="4" py="4" />
      {isAddUserOpen && (
        <AddUser
          closeAddUser={handleCloseAddUser}
          onAddUser={handleSaveUser}
          role="departmentHead"
          departments={departmentList}
        />
      )}
    </div>
  );
}

export default Students;
