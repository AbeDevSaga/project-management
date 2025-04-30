import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  "admin": [
    "dashboard",
    "users",
    "students",
    "advisors",
    "department-heads",
    "projects",
    "manuals",
    "notifications",
    "manage-admins",
  ],
  "student": [
    "dashboard",
    "projects",
    "notifications",
    "chat-groups",
    "manuals",
  ],
  "advisor": [
    "dashboard",
    "users",
    "projects",
    "notifications",
    "chat-groups",
    "manuals",
  ],
  "departmentHead": [
    "dashboard",
    "projects",
    "notifications",
    "manuals",
  ],
};