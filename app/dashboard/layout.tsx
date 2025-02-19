import { ReactNode } from 'react';
import SidebarSection from '../components/SidebarSection';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-container">
      {/* Sidebar for navigation */}
      <SidebarSection />

      <div className="main-content">
        {/* Navbar */}
        <Navbar />

        {/* Main content area, where page-specific content will be rendered */}
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
