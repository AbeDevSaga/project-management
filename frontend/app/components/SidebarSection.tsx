"use client";
import React from "react";
import Sidebar from "./Sidebar";
import ActionButton from "./ActionButton";
import { useDispatch } from "react-redux";
import { logout } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";

interface SidebarSectionProps {
  isOpen: boolean; // Prop to control open/close state
  onToggleSidebar: () => void;
  isCollapsed?: boolean;
}

export default function SidebarSection({
  isOpen,
  onToggleSidebar,
  isCollapsed,
}: SidebarSectionProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = () => {
    dispatch(logout());
    setTimeout(() => {
      router.push("/auth/login");
    }, 100);
  };

  return (
    <div
      className={`z-100 bg-sidebarcolor fixed lg:static w-4/5 max-w-[246px] inset-y-0 left-0 h-screen flex flex-col 
         transition-all duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
        ${isCollapsed ? "flex lg:w-[70px]" : "w-3/4 lg:w-[246px]"}
        `}
    >
      {/* Sidebar */}
      <div className="flex-1 overflow-hidden">
        <Sidebar onToggleSidebar={onToggleSidebar} isCollapsed={isCollapsed} />
      </div>
      {/* Logout Button */}
      <ActionButton
        label="Log Out"
        icon="logout"
        onClick={handleLogOut}
        isCollapsed={isCollapsed}
      />
    </div>
  );
}
