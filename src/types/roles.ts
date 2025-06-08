
export type Role =
  | "resident"
  | "operator"
  | "leasing"
  | "maintenance"
  | "vendor"
  | "admin"
  | "super-admin";

export interface UserRole {
  role: Role;
  userId?: string;
  name?: string;
  email?: string;
}

// Role inheritance map - defines which roles can perform tasks assigned to other roles
export const RoleInheritanceMap: Record<Role, Role[]> = {
  resident: ["resident"],
  operator: ["operator", "leasing", "maintenance"],
  leasing: ["leasing"],
  maintenance: ["maintenance"],
  vendor: ["vendor"],
  admin: ["operator", "leasing", "maintenance", "resident"],
  "super-admin": ["operator", "leasing", "maintenance", "resident", "admin"],
};

// Utility function to check if a user role has access to complete a task assigned to a specific role
export const userHasAccessToTask = (userRole: Role, taskRole: Role): boolean => {
  return RoleInheritanceMap[userRole]?.includes(taskRole) || false;
};
