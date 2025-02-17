import React from 'react';
import Sidebar from './Sidebar';
import LogoutBtn from './LogoutBtn';

export default function SidebarSection() {
  return (
    <div className="w-[246px] bg-sidebarcolor h-screen flex flex-col">
      {/* Sidebar */}
      <div className="flex-1 overflow-hidden"> 
        <Sidebar />
      </div>

      {/* Logout Button */}
      <div className="px-5 pb-5">
        <LogoutBtn />
      </div>
    </div>
  );
}
