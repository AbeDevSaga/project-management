"use client";
import React, { useState } from "react";
import { sidebarItems } from "../constants/sidebarItems";
import NavItem from "./NavItem";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col h-full">
      {/* Logo Section */}
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <h2 className="m-0">Logo</h2>
      </div>

      {/* Scrollable Sidebar Items */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 scrollbar-hide">
        {sidebarItems.map((item, index) => (
          <Link key={index} href={item.path} passHref>
            <NavItem
              icon={item.icons}
              text={item.label}
              active={pathname === item.path}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
