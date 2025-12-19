// src/types/auth.types.ts
import type { Role } from "@/constants/roles";
import type { Tenant } from "./tenant.types";

export type User = {
  id: number;
  name: string;
  full_name:string;
  first_name: string;
  last_name:string;
  email: string;
  phone: string;  
  role: Role; // "owner" | "admin"
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  mfa_enabled: boolean;
};

export type AuthResponse = {
  user: User;
  tenant: Tenant;
};