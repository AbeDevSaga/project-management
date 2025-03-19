"use client";
import React from "react";
import {
  BiLogOut,
  BiUser,
  BiEdit,
  BiTrash,
  BiUpload,
  BiPlusCircle,
  BiTask,
} from "react-icons/bi"; // Import icons
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { FaBuildingColumns, FaFileCirclePlus } from "react-icons/fa6";
import { IoMdChatboxes } from "react-icons/io";
import { FaProjectDiagram } from "react-icons/fa";

// Define the type for the props
interface ActionButtonProps {
  label: string; // Button label
  icon?:
    | "logout"
    | "user"
    | "edit"
    | "delete"
    | "update"
    | "add_user"
    | "service"
    | "organization"
    | "chat"
    | "task"
    | "file"
    | "project"
  onClick: () => void; // Action to perform on click
}

// Map icon names to their corresponding components
const iconMap = {
  logout: BiLogOut,
  user: BiUser,
  edit: BiEdit,
  delete: BiTrash,
  update: BiUpload,
  add_user: MdOutlinePersonAddAlt,
  service: BiPlusCircle,
  organization: FaBuildingColumns,
  chat: IoMdChatboxes,
  task: BiTask,
  project: FaProjectDiagram,
  file: FaFileCirclePlus,
};

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onClick,
}) => {
  // Get the icon component based on the icon name
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <button
      className="w-auto bg-primary text-white py-2 px-12 rounded-lg flex items-center justify-center shadow-lg hover:shadow-none transition-shadow  whitespace-nowrap"
      onClick={onClick}
    >
      {IconComponent && <IconComponent className="mr-3 text-white" />}
      {label}
    </button>
  );
};

export default ActionButton;
