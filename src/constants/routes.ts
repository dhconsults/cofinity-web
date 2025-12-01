// src/constants/routes.ts
export const ROUTES = {
  // Auth
  LOGIN: "/login",
  LOGOUT: "/logout",

  // Main app (protected)
  DASHBOARD: "/dashboard",

  // Members
  MEMBERS: "/members",
  MEMBERS_NEW: "/members/new",
  MEMBER_DETAILS: (id: string | number) => `/members/${id}`,

  // Transactions
  TRANSACTIONS: "/transactions",

  // Settings & Profile
  SETTINGS: "/settings",
} as const;