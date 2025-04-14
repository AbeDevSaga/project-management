import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  "admin": [
    "dashboard",
    "users",
    "students",
    "advisors",
    "students",
    "department-heads",
    "projects",
    "notifications",
    "manage-admins",
  ],
  "student": [
    "dashboard",
    "projects",
    "notifications",
    "chat-groups",
    "organizations",
  ],
  "advisor": [
    "dashboard",
    "users",
    "projects",
    "notifications",
    "chat-groups",
  ],
  "departmentHead": [
    "dashboard",
    "projects",
    "notifications",
  ],
};