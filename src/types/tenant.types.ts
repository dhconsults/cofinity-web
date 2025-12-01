// src/types/tenant.types.ts
export type Tenant = {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
};