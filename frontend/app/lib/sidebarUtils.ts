import { rolesPermissions } from "../constants/rolesPermission";
import { sidebarItems } from "../constants/sidebarItems";
import { TRole } from "../constants/type";

export const getFilteredSidebarItems = (role: TRole | undefined) => {
  if (!role) return [];
  const allowedPaths = rolesPermissions[role] || []; // Fallback to empty array if role is not found
  return sidebarItems.filter((item) => {
    const pathSegments = item.path.split("/").filter(Boolean); // Remove empty strings
    const lastSegment = pathSegments[pathSegments.length - 1]; // Get the last segment
    return lastSegment && allowedPaths.includes(lastSegment);
  });
};

// Example test cases
// console.log(getFilteredSidebarItems("admin")); // Should return all admin-specific items
// console.log(getFilteredSidebarItems("manager")); // Should return manager-specific items
// console.log(getFilteredSidebarItems("viewer")); // Should return viewer-specific items
// console.log(getFilteredSidebarItems(undefined)); // Should return an empty array