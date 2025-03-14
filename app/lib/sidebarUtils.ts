import { rolesPermissions } from "../constants/rolesPermission";
import { sidebarItems } from "../constants/sidebarItems";
import { TRole } from "../constants/type";

export const getFilteredSidebarItems = (role: TRole | undefined) => {
  if (!role) return [];
  const allowedPaths = rolesPermissions[role];
  return sidebarItems.filter((item) => allowedPaths.includes(item.path.split("/")[2]));
};