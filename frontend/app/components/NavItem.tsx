import React from 'react';
import { 
    MdDashboard, MdPeople, MdOutlineWorkspacePremium, MdNotifications, MdMessage, MdPhoto, 
    MdReport, MdSupervisorAccount,MdMenuBook
  } from "react-icons/md"; 
  import { HiUserGroup } from 'react-icons/hi'
  import { FaUniversity } from "react-icons/fa";
  import { FaUserShield, FaProjectDiagram, FaUserGraduate } from "react-icons/fa";
  import { FaBuildingColumns } from "react-icons/fa6";
  import { GiTeacher } from 'react-icons/gi';
  import { RiUserStarLine } from 'react-icons/ri';
  import { AiOutlineSchedule } from "react-icons/ai";


type IconMapping = {
  [key: string]: React.ComponentType<{ className?: string }>;
};

const iconMapping: IconMapping = {
  dashboard: MdDashboard,
  users: MdPeople,
  students: FaUserGraduate,
  advisors: GiTeacher,
  departmentHeads: RiUserStarLine,
  premiumUsers: MdOutlineWorkspacePremium,
  notifications: MdNotifications,
  messages: MdMessage,
  photoReview: MdPhoto,
  reportsBans: MdReport,
  salesAgents: MdSupervisorAccount,
  manageAdmins: FaUserShield,
  oraganizations: FaBuildingColumns,
  projects: FaProjectDiagram,
  manuals: MdMenuBook,
  department: FaUniversity,
  schedule: AiOutlineSchedule,
  teams: HiUserGroup,
};

interface NavItemProps {
  icon?: string;
  text?: string; 
  active?: boolean;
}

export default function NavItem({ icon, text, active }: NavItemProps) {
  const IconComponent = icon ? iconMapping[icon] : null;

  return (
    <div 
    className={`flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer transition-colors ${
      active ? "bg-white text-primary" : "text-foreground hover:bg-white"
    }`}
      style={{
        width: 210,
        height: 48,
      }}
    >
      {IconComponent && <IconComponent className="w-4 h-4" />}
      {text && <span className="font-inter font-bold text-sm leading-5 tracking-normal">{text}</span>} 
    </div>
  );
}