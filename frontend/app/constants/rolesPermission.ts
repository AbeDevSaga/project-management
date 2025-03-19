import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  "Admin": [
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
  "Super Admin": [
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
  "Project Manager": [
    "dashboard",
    "users",
    "projects",
    "notifications",
    "messages",
  ],
  "Developer": [
    "dashboard",
    "projects",
    "notifications",
  ],
  "Team Member": [
    "dashboard",
    "notifications",
  ],
  "User": [
    "dashboard",
    "notifications",
  ],
};