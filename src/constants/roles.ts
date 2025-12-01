// src/constants/roles.ts
export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
} as const;

export type Role = keyof typeof ROLES;

// Helper to check permissions
export const hasPermission = (
  userRole: Role | null | undefined,
  requiredRole: Role | Role[]
): boolean => {
  if (!userRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }

  if (userRole === "OWNER") return true;

  return userRole === requiredRole;
};