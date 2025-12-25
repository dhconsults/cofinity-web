// src/constants/api.ts

// Use Vite's `import.meta.env` in the browser instead of `process.env` (Next.js style).
const env = import.meta.env as Record<string, string | undefined>;

console.log(env);

export const API_BASE = env.VITE_API_URL ?? env.NEXT_PUBLIC_API_URL ?? "";

// Sanctum endpoints
export const SANCTUM = {
  CSRF_COOKIE: `${API_BASE}/sanctum/csrf-cookie`,
};

// Auth
export const AUTH_API = {
  LOGIN: `${API_BASE}/api/auth/login`,
  FORGOT_PASSWORD: `${API_BASE}/api/auth/forgot-password`,
  REGISTER: `${API_BASE}/api/auth/register`,
  VERIFY_EMAIL: `${API_BASE}/api/auth/verify-email`,
  RESEND_VERIFICATION: `${API_BASE}/api/auth/resend-verification`,
  VERIFY_LOGIN_CODE: `${API_BASE}/api/verify-login`,
  RESEND_LOGIN_CODE: `${API_BASE}/api/resend-login-code`,
  LOGOUT: `${API_BASE}/api/auth/logout`,
  ME: `${API_BASE}/api/me`, // or /api/tenant if you return tenant + user together
  UPDATE_USER: `${API_BASE}/api/user`,
};

// Tenant (since every user belongs to exactly one tenant)
export const TENANT_API = {
  TENANT: `${API_BASE}/api/tenant`,
  CREATE_TENANT: `${API_BASE}/api/tenants/create`,
  TENANT_STATUS: (id: string | number) =>
    `${API_BASE}/api/tenants/${id}/status`,
  SWITCH: `${API_BASE}/api/tenants/switch`,
};

// Usage:

export const APIS = {
  GET_PLANS: `${API_BASE}/api/plans`,
  SUBSCRIPTION: `${API_BASE}/api/subscription`,
  SUBSCRIPTION_INITIATE: `${API_BASE}/api/subscription/initiate`,
};

// Members
export const MEMBERS_API = {
  LIST: `${API_BASE}/api/members`,
  CREATE: `${API_BASE}/api/members`,
  SHOW: (id: string | number) => `${API_BASE}/api/members/${id}`,
  UPDATE: (id: string | number) => `${API_BASE}/api/members/${id}`,
  TRANSACTIONS: (id: string | number) =>
    `${API_BASE}/api/members/${id}/transactions`,
  LOANS: (id: string | number) => `${API_BASE}/api/members/${id}/loans`,
  KYCUPLOAD: (id: string | number) => `${API_BASE}/api/members/${id}/kyc`,
  SENDEMAIL: (id: string | number) => `${API_BASE}/api/members/${id}/email`,
  SENDSMS: (id: string | number) => `${API_BASE}/api/members/${id}/sms`,
  // UPDATE: (id: string | number) => `${API_BASE}/api/members/${id}`,
  DELETE: (id: string | number) => `${API_BASE}/api/members/${id}`,
  SAVINGSACCOUNTS: (id: string | number) =>
    `${API_BASE}/api/members/${id}/savings-accounts`,

  BANK_ACCOUNTS: (memberId: string | number) =>
    `${API_BASE}/api/members/${memberId}/bank-accounts`,

  NEXT_OF_KIN_ITEM: (memberId: string | number, nokId: string | number) =>
    `${API_BASE}/api/members/${memberId}/next-of-kin/${nokId}`,

  NEXT_OF_KIN: (memberId: string | number) =>
    `${API_BASE}/api/members/${memberId}/next-of-kin`,
};

export const LOANPRODUCT_API = {
  LIST: `${API_BASE}/api/loan-products`,
  CREATE: `${API_BASE}/api/loan-products`,
  SHOW: (id: string | number) => `${API_BASE}/api/loan-products/${id}`,
  UPDATE: (id: string | number) => `${API_BASE}/api/loan-products/${id}`,
  DELETE: (id: string | number) => `${API_BASE}/api/loan-products/${id}`,
  QUOTA: `${API_BASE}/api/loan-products-quota`,
  TOGGLE: (id: string | number) => `${API_BASE}/api/loan-products/${id}/toggle`,
};

export const LOAN_API = {
  LIST: `${API_BASE}/api/loans`,
  CREATE: `${API_BASE}/api/loans`,
};
export const SAVINGPRODUCT_API = {
  LIST: `${API_BASE}/api/savings-products`,
  CREATE: `${API_BASE}/api/savings-products`,
  SHOW: (id: string | number) => `${API_BASE}/api/savings-products/${id}`,
  UPDATE: (id: string | number) => `${API_BASE}/api/savings-products/${id}`,
  DELETE: (id: string | number) => `${API_BASE}/api/savings-products/${id}`,
  QUOTA: `${API_BASE}/api/savings-products-quota`,
  TOGGLE: (id: string | number) =>
    `${API_BASE}/api/savings-products/${id}/toggle`,
};

export const SAVINGACCOUNT_API = {
  LIST: `${API_BASE}/api/savings-accounts`,
  CREATE: `${API_BASE}/api/savings-accounts`,
  SHOW: (id: string | number) => `${API_BASE}/api/savings-accounts/${id}`,
  UPDATE: (id: string | number) => `${API_BASE}/api/savings-accounts/${id}`,
  DELETE: (id: string | number) => `${API_BASE}/api/savings-accounts/${id}`,
  QUOTA: `${API_BASE}/api/savings-accounts-quota`,
  SUMMARY: `${API_BASE}/api/savings-accounts-summary`,
  TOGGLE: (id: string | number) =>
    `${API_BASE}/api/savings-accounts/${id}/toggle`,

  // Route::get('savings-accounts/{account}/transactions', [SavingsAccountController::class, 'transactions']);
  ///api/savings-accounts/${id}/${endpoint}

  DEPOSIT_WITHDRAWAL: (id: string | number, endpoint: string) =>
    `${API_BASE}/api/savings-accounts/${id}/${endpoint}`,
  WITHDRAW: `${API_BASE}/api/savings/transactions/withdraw`,
  TRANSACTIONS: (id: string | number) =>
    `${API_BASE}/api/savings-accounts/${id}/transactions`,
};

export const BRANCH_API = {
  LIST: `${API_BASE}/api/branches`,
  CREATE: `${API_BASE}/api/branches`,
  SHOW: (id: string | number) => `${API_BASE}/api/branches/${id}`,
  UPDATE: (id: string | number) => `${API_BASE}/api/branches/${id}`,
  DELETE: (id: string | number) => `${API_BASE}/api/branches/${id}`,
};

export const SAVINGTRANSACTION_API = {
  LIST: `${API_BASE}/api/branches`,
  CREATE: `${API_BASE}/api/branches`,
  SHOW: (id: string | number) => `${API_BASE}/api/branches/${id}`,
  UPDATE: (id: string | number) => `${API_BASE}/api/branches/${id}`,
  DELETE: (id: string | number) => `${API_BASE}/api/branches/${id}`,
};

export const SHARESPLAN_API = {
  LIST: "/api/shares-plans",
  QUOTA: "/api/shares-plans-quota",
  DELETE: (id: number) => `/api/shares-plans/${id}`,
  TOGGLE: (id: number) => `/api/shares-plans/${id}/toggle`,
};

export const MEMBER_SHARE_ACCOUNT_API = {
  LIST: "/api/member-share-accounts",
  QUOTA: "/api/member-share-accounts-quota",
  CREATE: "/api/member-share-accounts",
  TOGGLE: (id: number) => `/api/member-share-accounts/${id}/toggle`,
  TRANSACTIONS: (id: number) => `/api/member-share-accounts/${id}/transactions`,
};

export const DIVIDEND_API = {
  LIST: "/api/dividends",
  PAY: (id: number) => `/api/dividends/${id}/pay`,
};

export const TRANSACTION_API = {
  LIST: "/api/transactions",
  SUMMARY: "/api/transactions/summary",
  SHOW: "/api/transactions", // base for show endpoint
  EXPORT_PDF: `${API_BASE}/api/transactions/export-pdf`,
  EXPORT_CSV: `${API_BASE}/api/transactions/export-csv`,
};

// Transactions
export const TRANSACTIONS_API = {
  LIST: `${API_BASE}/api/transactions`,
  FUND: `${API_BASE}/api/transactions/fund`,
  WITHDRAW: `${API_BASE}/api/transactions/withdraw`,
};

export const EXPENSE_API = {
  CATEGORIES: "/api/expense-categories",
  EXPENSES: "/api/expenses",
  SUMMARY: "/api/expenses/summary",
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
