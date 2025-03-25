import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  "admin": [
    "dashboard",
    "users",
    "premium-users",
    "organizations",
    "services",
    "projects",
    "notifications",
    "messages",
    "photo-review",
    "reports-bans",
    "sales-agents",
    "manage-admins",
  ],
  "student": [
    "dashboard",
    "users",
    "services",
    "projects",
    "notifications",
    "messages",
    "photo-review",
    "reports-bans",
    "sales-agents",
    "manage-admins",
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