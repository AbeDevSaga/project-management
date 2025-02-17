import React from 'react';
import { BiLogOut } from "react-icons/bi";

export default function LogoutBtn() {
  return (
    <button className="w-full bg-primary text-white py-2 px-4 rounded-lg flex items-center justify-center">
        <BiLogOut className="mr-3 text-white" />
        Log Out
    </button>
  );
}