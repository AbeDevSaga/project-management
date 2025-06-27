"use client";
import React, { useEffect, useState } from "react";
import NavItem from "./NavItem";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getFilteredSidebarItems } from "../lib/sidebarUtils";
import { TRole } from "../constants/type";
import Logo from "./Logo";
import { logoData } from "../constants/logo";

interface SidebarProps {
  onToggleSidebar: () => void;
  isCollapsed?: boolean;
}

export default function Sidebar({
  onToggleSidebar,
  isCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const user = useSelector((state: RootState) => state.auth.user);

  // Redirect unauthenticated users to the login page
  useEffect(() => {
    if (!userRole) {
      router.push("/auth/login");
    }
  }, [userRole, router]);

  console.log("user: ", user);

  // Get filtered sidebar items based on the user's role
  const filteredSidebarItems = getFilteredSidebarItems(userRole as TRole);
  console.log("filteredSidebarItems: ", filteredSidebarItems);

  return (
    <div className="flex w-full flex-col h-full">
      {/* Logo Section */}
      <Logo
        onToggleSidebar={onToggleSidebar}
        logo={logoData}
        isCollapsed={isCollapsed}
      />
      {/* Scrollable Sidebar Items */}
      <div
        className={`flex-1 min-h-0 overflow-y-auto ${
          isCollapsed ? "py-4 px-1" : "p-4"
        } space-y-2 scrollbar-hide`}
      >
        {filteredSidebarItems.map((item, index) => (
          <Link key={index} href={item.path} passHref>
            <NavItem
              icon={item.icons}
              text={item.label}
              active={pathname === item.path}
              isCollapsed={isCollapsed}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
