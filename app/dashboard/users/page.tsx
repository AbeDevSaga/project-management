"use client";
import ActionButton from "@/app/components/ActionButton";
import AddUser from "@/app/components/AddUser";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/UsersTable";
import { User } from "@/app/utils/type";
import React, { useState } from "react";

function users() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false); // State to control the modal

  const handleAddUser = () => {
    console.log("Opening Add User modal...");
    setIsAddUserOpen(true); // Open the modal
  };
  const handleCloseAddUser = () => {
    setIsAddUserOpen(false); // Close the modal
  };

  const handleSaveUser = (newUser: User) => {
    console.log("New User Data:", newUser);
    // Here you can call an API to save the new user
    setIsAddUserOpen(false); // Close the modal after saving
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="users" />
        <div className="w-auto">
          <ActionButton
            label="Add User"
            onClick={handleAddUser}
            icon="add_user"
          />
        </div>
      </div>
      <UserTable />
      {isAddUserOpen && (
        <AddUser closeAddUser={handleCloseAddUser} onAddUser={handleSaveUser} />
      )}
    </div>
  );
}

export default users;
