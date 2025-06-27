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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { loading, user } = useSelector((state: RootState) => state.auth);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const collabseSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      }

      const pathname = window.location.pathname;
      const pathSegments = pathname.split("/").filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1] || "dashboard";

      const allowedPaths = rolesPermissions[user?.role as TRole] || [];
      if (!allowedPaths.includes(lastSegment)) {
        router.push("/unauthorized");
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
      <SidebarSection
        isOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
      />
      <div className="main-content">
        {/* Navbar */}
        <Navbar
          onToggleSidebar={toggleSidebar}
          onCollapseSidebar={collabseSidebar}
        />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
