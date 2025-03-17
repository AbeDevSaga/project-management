import React from "react";
import UserCard from "./UserCard";
import Notification from "./Notification";
import LanguageSelection from "./LanguageSelection";
import SearchBar from "./SearchBar";
import Theme from "./Theme";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface NavbarProps {
  onToggleSidebar: () => void;
}
function Navbar({ onToggleSidebar }: NavbarProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between bg-navbarbg border border-blue-500 lg:py-4 px-2 md:px-6 lg:px-8 space-x-2 space-y-2">
      <div className="absolute -left-0 p-2">
        <button
          className="lg:hidden text-gray-600 focus:outline-none"
          onClick={onToggleSidebar}
        >
          ☰
        </button>
      </div>
      <div className="w-full lg:w-1/3">
        <SearchBar />
      </div>
      <div className="w-full flex items-center justify-between lg:w-auto space-x-2 lg:space-x-7">
        <LanguageSelection />
        <Notification />
        <Theme />
        <UserCard user={user}/>
      </div>
    </div>
  );
}

export default Navbar;
