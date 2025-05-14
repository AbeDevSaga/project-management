"use client";
import ActionButton from "@/app/components/ActionButton";
import AddUser from "@/app/components/user_related/AddUser";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/user_related/UsersTable";
import React, {useEffect, useState } from "react";
import { createUser, fetchAllUsers, selectStudents } from "@/app/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { TUser } from "@/app/constants/type";
import { useRouter } from "next/navigation";
import { fetchAllDepartments } from "@/app/redux/slices/deptSlice";

function Students() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector(selectStudents);
  const departmentList = useSelector(
        (state: RootState) => state.department.departments);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal
  const [alert, setAlert] = useState<{
      status: "success" | "error";
      text: string;
    } | null>(null);

  // useEffect(() => {
  //   dispatch(fetchPremiumUsers());
  // }, [dispatch]);

  useEffect(() => {
      dispatch(fetchAllDepartments());
    }, [dispatch]);

  const handleAddUser = () => {
    console.log("Opening Add User modal...");
    setIsAddUserOpen(true); // Open the modal
  };
  const handleViewUser = (user: TUser) => {
    router.push(`students/${user._id}`);
  };
  const handleCloseAddUser = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const handleSaveUser = async (newUser: TUser) => {
    const resultAction = await dispatch(createUser(newUser));
    if (createUser.fulfilled.match(resultAction)) {
      setAlert({
        status: "success",
        text: "User added successfully",
      });
      dispatch(fetchAllUsers());
      setIsAddUserOpen(false); // Close the modal after saving
    } else {
      setAlert({
        status: "error",
        text: "Failed to add user",
      });
    }
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="users" />
        <div className="w-auto">
          <ActionButton
            label="Create Student"
            onClick={handleAddUser}
            icon="add_user"
          />
        </div>
      </div>
      <UserTable onViewUser={handleViewUser} users={students} px="4" py="4" />
      {isAddUserOpen && (
        <AddUser
          closeAddUser={handleCloseAddUser}
          onAddUser={handleSaveUser}
          role="student"
          departments={departmentList}
        />
      )}
    </div>
  );
}

export default Students;
