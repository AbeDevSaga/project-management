import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  "admin": [
    "dashboard",
    "users",
    "department",
    "students",
    "advisors",
    "department-heads",
    "projects",
    "manuals",
    "notifications",
    "chat-groups",
    "manage-admins",
  ],
  "student": [
    "dashboard",
    "projects",
    "notifications",
    "manuals",
    "schedule",
  ],
  "advisor": [
    "dashboard",
    "users",
    "projects",
    "notifications",
    "chat-groups",
    "manuals",
    "schedule",
  ],
  "departmentHead": [
    "dashboard",
    "projects",
    "notifications",
    "manuals",
  ],
  "evaluator": [
    "dashboard",
    "projects",
    "notifications",
    "manuals",
  ],
};