// src/services/auth.service.ts
import api from "@/lib/axios";
import { AUTH_API } from "@/constants/api";
import type { AuthResponse } from "@/types";

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post(AUTH_API.LOGIN, { email, password });
    return res.data;
  },

  async logout() {
    await api.post(AUTH_API.LOGOUT);
  },

  async me(): Promise<AuthResponse> {
    const res = await api.get(AUTH_API.ME);
    return res.data;
  },
};