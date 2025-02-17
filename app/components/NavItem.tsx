import React from 'react';
import { 
    MdDashboard, MdPeople, MdOutlineWorkspacePremium, MdNotifications, MdMessage, MdPhoto, 
    MdReport, MdSupervisorAccount 
  } from "react-icons/md"; 
  import { FaUserShield } from "react-icons/fa";

type IconMapping = {
  [key: string]: React.ComponentType<{ className?: string }>;
};

const iconMapping: IconMapping = {
  dashboard: MdDashboard,
  users: MdPeople,
  premiumUsers: MdOutlineWorkspacePremium,
  notifications: MdNotifications,
  messages: MdMessage,
  photoReview: MdPhoto,
  reportsBans: MdReport,
  salesAgents: MdSupervisorAccount,
  manageAdmins: FaUserShield,
};

interface NavItemProps {
  icon?: string;
  text?: string; 
}

export default function NavItem({ icon, text }: NavItemProps) {
  const IconComponent = icon ? iconMapping[icon] : null;

  return (
    <div className=''
      style={{
        width: 210,
        height: 48,
        top: 89,
        left: 20,
        borderRadius: 8,
        paddingRight: 12,
        paddingLeft: 16,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {IconComponent && <IconComponent className="w-4 h-4" />} {/* Render the icon if it exists */}
      {text && <span className="font-inter font-bold text-sm leading-5 tracking-normal">{text}</span>} {/* Render the text if it exists */}
    </div>
  );
}