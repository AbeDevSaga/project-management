'use client';
import { ReactNode, useState } from "react";
import SidebarSection from "../components/SidebarSection";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <SidebarSection isOpen={isSidebarOpen}/>
      <div className="main-content">
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar}/>
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
