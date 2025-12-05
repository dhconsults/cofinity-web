// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";  // ← ADD THIS IMPORT
import api from "@/lib/axios";
import { fetchCsrfToken } from "@/lib/sanctum";
import { AUTH_API } from "@/constants/api";
import { ROLES, type Role } from "@/constants/roles";
import { useQueryClient } from "@tanstack/react-query";
import type { Tenant } from "@/types/tenant.types";
import type { User } from "@/types/auth.types";

type AuthState = {
  user: User | null;
  tenants: Tenant[] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tenants: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const location = useLocation();  // ← ADD THIS
  const queryClient = useQueryClient();

  // ← ADD THIS: Guest pages where we DON'T fetch user
  const guestPaths = [
    "/login",
    "/signup", 
    "/verify-email",
  
  ];

  const isGuestPath = guestPaths.includes(location.pathname);

  // Fetch current authenticated user + tenant
  const fetchUser = async () => {
    try {
      const response = await api.get(AUTH_API.ME);
      const { user,tenants } = response.data;


        

      setState({
        user,
        tenants,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 419) {
        setState({
          user: null,
          tenants: null,
          isLoading: false,
          isAuthenticated: false,
        });
      } else {
        console.error("Failed to fetch user:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    await fetchCsrfToken();
    await api.post(AUTH_API.LOGIN, { email, password });

      await fetchUser();  
 
    queryClient.invalidateQueries();
  };

  // Logout
  const logout = async () => {
    try {
      await api.post(AUTH_API.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setState({
        user: null,
        tenants: null,
        isLoading: false,
        isAuthenticated: false,
      });
      queryClient.clear();
      window.location.href = "/login"; // Or use navigate if you prefer
    }
  };

  // ← FIXED: Only fetch user if NOT on guest page
  useEffect(() => {
    if (isGuestPath) {
      // On guest pages, don't fetch user, just show loading briefly
      setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }, 500);
    } else {
      // On protected pages, fetch user
      fetchUser();
    }
  }, [location.pathname, isGuestPath]); // Re-run when path changes

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refetchUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};