import { TRole } from "../constants/type";

export const getRolesStorageKey = (role: TRole) => `auth_${role}`;

export const clearOtherRolesStorage = (currentRole: TRole) => {
  const roles: TRole[] = ["admin", "student", "advisor", "departmentHead"];
  roles.forEach((role) => {
    if (role !== currentRole) {
      localStorage.removeItem(getRolesStorageKey(role));
    }
  });
};
