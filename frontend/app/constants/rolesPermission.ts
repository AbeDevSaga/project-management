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
    "messages",
    "manage-admins",
  ],
  "student": [
    "dashboard",
    "projects",
    "notifications",
    "messages",
    "organizations",
  ],
  "advisor": [
    "dashboard",
    "users",
    "projects",
    "notifications",
    "messages",
  ],
  "departmentHead": [
    "dashboard",
    "projects",
    "notifications",
  ],
};