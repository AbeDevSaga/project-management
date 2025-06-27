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
  onCollapseSidebar?: () => void;
}
function Navbar({ onToggleSidebar, onCollapseSidebar }: NavbarProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="box-shadow flex flex-col space-y-2 px-2 py-1 md:flex-row md:items-center md:justify-between md:space-y-0 md:py-2">
      <div className="w-full lg:w-1/3">
        <SearchBar
          onToggleSidebar={onToggleSidebar}
          onCollapseSidebar={onCollapseSidebar}
        />
      </div>
      <div className="hidden w-full sm:flex items-center justify-end gap-2 lg:gap-7 lg:w-auto">
        <LanguageSelection />
        <Notification />
        <Theme />
        <UserCard user={user} />
      </div>
    </div>
  );
}

export default Navbar;
