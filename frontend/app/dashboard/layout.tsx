"use client";
import { ReactNode, useEffect, useState } from "react";
import SidebarSection from "../components/SidebarSection";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation"; 
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { rolesPermissions } from "../constants/rolesPermission";
import { TRole } from "../constants/type";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { loading, user } = useSelector((state: RootState) => state.auth);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      }

      // Get current path without query parameters
      const pathname = window.location.pathname;
      // console.log("Current Pathname:", pathname);
      const pathSegments = pathname.split("/").filter(Boolean);
      // console.log("Path Segments:", pathSegments);
      const lastSegment = pathSegments[pathSegments.length - 1] || "dashboard";
      // console.log("Last Segment:", lastSegment);

      // Check if the last segment is a valid path
      const allowedPaths = rolesPermissions[user?.role as TRole] || [];
      // console.log("Allowed Paths:", allowedPaths);
      if (!allowedPaths.includes(lastSegment)) {
        // Redirect to the dashboard if the path is not allowed
        router.push("/unauthorized");
        // console.log("Unauthorized access to:", pathname);
      }
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SidebarSection isOpen={isSidebarOpen} />
      <div className="main-content">
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
