"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import UserTable from "@/app/components/UsersTable";
import React from "react";

function users() {
  const handleAddUser = () => {
    console.log("Adding new user...");
  };
  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="flex items-center py-2">
        <SectionHeader sectionKey="users" />
        <div className="w-auto">
          <ActionButton
            label="Add User"
            onClick={handleAddUser}
            icon="logout"
          />
        </div>
      </div>
      <UserTable />
    </div>
  );
}

export default users;
