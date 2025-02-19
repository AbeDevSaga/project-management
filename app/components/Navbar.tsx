import React from "react";
import UserCard from "./UserCard";
import Notification from "./Notification";

function Navbar() {
  return (
    <div className="bg-navbarbg border border-blue-500 py-4 px-8 flex items-center justify-between">
      <div>
        <UserCard />
      </div>
      <div className="flex items-center space-x-4">
        <Notification />
        <UserCard />
      </div>
    </div>
  );
}

export default Navbar;
