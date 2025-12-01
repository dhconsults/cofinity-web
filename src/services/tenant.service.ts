// src/services/tenant.service.ts
import api from "@/lib/axios";
import { TENANT_API } from "@/constants/api";
import type { Tenant } from "@/types";

export const tenantService = {
  async getCurrent(): Promise<Tenant> {
    const res = await api.get(TENANT_API.CURRENT);
    return res.data.tenant;
  },
};