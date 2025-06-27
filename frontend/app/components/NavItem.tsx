import React from "react";
import {
  MdDashboard,
  MdPeople,
  MdOutlineWorkspacePremium,
  MdNotifications,
  MdMessage,
  MdPhoto,
  MdReport,
  MdSupervisorAccount,
  MdMenuBook,
} from "react-icons/md";
import { motion } from "framer-motion";
import { HiUserGroup } from "react-icons/hi";
import { FaUniversity } from "react-icons/fa";
import {
  FaUserShield,
  FaProjectDiagram,
  FaUserGraduate,
  FaUserTie,
} from "react-icons/fa";
import { FaBuildingColumns } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { RiUserStarLine } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { FaChalkboardTeacher } from "react-icons/fa";

type IconMapping = {
  [key: string]: React.ComponentType<{ className?: string }>;
};

const iconMapping: IconMapping = {
  dashboard: MdDashboard,
  users: MdPeople,
  students: FaUserGraduate,
  advisors: GiTeacher,
  evaluators: FaUserTie,
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
  isCollapsed?: boolean;
}

export default function NavItem({
  icon,
  text,
  active,
  isCollapsed,
}: NavItemProps) {
  const IconComponent = icon ? iconMapping[icon] : null;

  // Animation variants
  const itemVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className={`nav-item w-full flex items-center gap-4 px-4 py-4 rounded-md cursor-pointer 
        ${active ? "bg-white text-primary" : "text-foreground hover:bg-white"}
        ${isCollapsed ? "justify-center" : "justify-start"}`}
      whileHover="hover"
      whileTap="tap"
      variants={itemVariants}
      initial={false}
    >
      {IconComponent && (
        <motion.div variants={iconVariants}>
          <IconComponent className="w-4 h-4" />
        </motion.div>
      )}
      {!isCollapsed && text && (
        <motion.span
          className="font-inter font-bold text-sm leading-5 tracking-normal"
          variants={{
            hover: { x: 2 },
          }}
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  );
}
