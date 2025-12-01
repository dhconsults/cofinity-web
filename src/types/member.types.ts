// src/types/member.types.ts
export type Member = {
  id: number;
  tenant_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string | null;
  bvn?: string | null;
  nin?: string | null;
  bvn_verified_at?: string | null;
  nin_verified_at?: string | null;
  balance: number; // in kobo or naira — your choice (we use kobo internally)
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;
};

export type MemberWithFullName = Member & {
  full_name: string;
};