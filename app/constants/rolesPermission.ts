import { TRole } from "./type";

export const rolesPermissions: Record<TRole, string[]> = {
  admin: [
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
  super_admin: [
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
  manager: [
    "dashboard",
    "users",
    "projects",
    "notifications",
    "messages",
  ],
  developer: [
    "dashboard",
    "projects",
    "notifications",
  ],
  viewer: [
    "dashboard",
    "notifications",
  ],
};