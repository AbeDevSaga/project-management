"use client";
import ActionButton from "@/app/components/ActionButton";
import AddUser from "@/app/components/user_related/AddUser";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/user_related/UsersTable";
import React, {useState } from "react";
import { createUser, fetchAllUsers, selectAdmins } from "@/app/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { TUser } from "@/app/constants/type";
import { useRouter } from "next/navigation";

function ManageAdmins() {
  const router = useRouter();
  const admins = useSelector(selectAdmins);
  const dispatch = useDispatch<AppDispatch>();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal

  // useEffect(() => {
  //   dispatch(fetchPremiumUsers());
  // }, [dispatch]);

  const handleAddUser = () => {
    console.log("Opening Add User modal...");
    setIsAddUserOpen(true); // Open the modal
  };
  const handleViewUser = (user: TUser) => {
    router.push(`manage-admins/${user._id}`);
  };
  const handleCloseAddUser = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const handleSaveUser = async (newUser: TUser) => {
    console.log("New User Data:", newUser);
    const resultAction = await dispatch(createUser(newUser));
    if (createUser.fulfilled.match(resultAction)) {
      console.log("User added successfully:", resultAction.payload);
      dispatch(fetchAllUsers());
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
            label="Add Admin"
            onClick={handleAddUser}
            icon="add_user"
          />
        </div>
      </div>
      <UserTable onViewUser={handleViewUser} users={admins} px="4" py="4" />
      {isAddUserOpen && (
        <AddUser
          closeAddUser={handleCloseAddUser}
          onAddUser={handleSaveUser}
          role="admin"
        />
      )}
    </div>
  );
}

export default ManageAdmins;
