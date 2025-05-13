import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  "admin": [
    "dashboard",
    "users",
    "department",
    "students",
    "advisors",
    "evaluators",
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