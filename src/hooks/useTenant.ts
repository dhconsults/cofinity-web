// src/hooks/useTenant.ts
import { useAuth } from "./useAuth";
import { tenantService } from "@/services";

export const useTenant = () => {
  const { tenant } = useAuth();
  return tenant;
};