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
    "notifications",
    "manage-admins",
  ],
  "student": [
    "dashboard",
    "projects",
    "team-members",
    "notifications",
    "manuals",
    "schedule",
    "chat-groups",
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
    "users",
    "projects",
    "advisors",
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