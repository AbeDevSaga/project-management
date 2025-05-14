"use client";
import ActionButton from "@/app/components/ActionButton";
import AddUser from "@/app/components/user_related/AddUser";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/user_related/UsersTable";
import React, { useEffect, useState } from "react";
import { createUser, fetchAllUsers, selectAdvisors } from "@/app/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { TUser } from "@/app/constants/type";
import { useRouter } from "next/navigation";
import { fetchAllDepartments } from "@/app/redux/slices/deptSlice";
import NotificationCard from "@/app/components/NotificationCard";

function Students() {
  const router = useRouter();
  const advisors = useSelector(selectAdvisors);
  const departmentList = useSelector(
    (state: RootState) => state.department.departments
  );
  const user = useSelector(
    (state: RootState) => state.auth.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    onCloseComplete?: () => void;
  } | null>(null);
  const [alert, setAlert] = useState<{
      status: "success" | "error";
      text: string;
    } | null>(null);

  useEffect(() => {
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  const handleAddUser = () => {
    console.log("Opening Add User modal...");
    setIsAddUserOpen(true); // Open the modal
  };
  const handleViewUser = (user: TUser) => {
    router.push(`advisors/${user._id}`);
  };
  const handleCloseAddUser = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const handleSaveUser = async (newUser: TUser) => {
    console.log("New User Data:", newUser);
    const resultAction = await dispatch(createUser(newUser));
    if (createUser.fulfilled.match(resultAction)) {
      setNotification({
        message: "User created successfully!",
        type: "success",
        onCloseComplete: () => setIsAddUserOpen(false),
      });
      dispatch(fetchAllUsers());
      setIsAddUserOpen(false); // Close the modal after saving
    } else {
      setNotification({
        message: "Failed to create user",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="users" />
        {user?.role === "admin" && (<div className="w-auto">
          <ActionButton
            label="Create Advisors"
            onClick={handleAddUser}
            icon="add_user"
          />
        </div>)}
      </div>
      <UserTable onViewUser={handleViewUser} users={advisors} px="4" py="4" />
      {isAddUserOpen && (
        <AddUser
          closeAddUser={handleCloseAddUser}
          onAddUser={handleSaveUser}
          role="advisor"
          departments={departmentList}
        />
      )}
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => {
            setNotification(null);
            notification.onCloseComplete?.();
          }}
        />
      )}
    </div>
  );
}

export default Students;
