// src/constants/api.ts
// Use Vite's `import.meta.env` in the browser instead of `process.env` (Next.js style).
const env = import.meta.env as Record<string, string | undefined>;

export const API_BASE = env.VITE_API_URL ?? env.NEXT_PUBLIC_API_URL ?? "";

// Sanctum endpoints
export const SANCTUM = {
  CSRF_COOKIE: `${API_BASE}/sanctum/csrf-cookie`,
};

// Auth
export const AUTH_API = {
  LOGIN: `${API_BASE}/api/auth/login`,
  REGISTER: `${API_BASE}/api/auth/register`,
  VERIFY_EMAIL: `${API_BASE}/api/auth/verify-email`,
  RESEND_VERIFICATION: `${API_BASE}/api/auth/resend-verification`,
  LOGOUT: `${API_BASE}/api/auth/logout`,
  ME: `${API_BASE}/api/me`, // or /api/tenant if you return tenant + user together
};

// Tenant (since every user belongs to exactly one tenant)
export const TENANT_API = {
  CURRENT: `${API_BASE}/api/tenant`,
};

// Members
export const MEMBERS_API = {
  LIST: `${API_BASE}/api/members`,
  CREATE: `${API_BASE}/api/members`,
  SHOW: (id: string | number) => `${API_BASE}/api/members/${id}`,
  UPDATE: (id: string | number) => `${API_BASE}/api/members/${id}`,
  DELETE: (id: string | number) => `${API_BASE}/api/members/${id}`,
};

// Transactions
export const TRANSACTIONS_API = {
  LIST: `${API_BASE}/api/transactions`,
  FUND: `${API_BASE}/api/transactions/fund`,
  WITHDRAW: `${API_BASE}/api/transactions/withdraw`,
};

// Verification (BVN/NIN)
export const VERIFICATION_API = {
  BVN: `${API_BASE}/api/verify/bvn`,
  NIN: `${API_BASE}/api/verify/nin`,
};

// Settings / Alerts
export const ALERTS_API = {
  TOGGLE_SMS: `${API_BASE}/api/settings/sms-alerts`,
};