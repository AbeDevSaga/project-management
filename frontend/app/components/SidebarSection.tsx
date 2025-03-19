"use client";
import React from "react";
import Sidebar from "./Sidebar";
import ActionButton from "./ActionButton";
import { useDispatch } from "react-redux";
import { logout } from "@/app/redux/slices/authSlice";
import { useRouter } from "next/navigation";

interface SidebarSectionProps {
  isOpen: boolean; // Prop to control open/close state
}

export default function SidebarSection({ isOpen }: SidebarSectionProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = () => {
    console.log("Logging out...");
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 w-[246px] bg-sidebarcolor h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Sidebar */}
      <div className="flex-1 overflow-hidden">
        <Sidebar />
      </div>
      {/* Logout Button */}
      <div className="px-5 pb-5">
        <ActionButton label="Log Out" icon="logout" onClick={handleLogOut} />
      </div>
    </div>
  );
}
