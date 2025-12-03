// src/lib/sanctum.ts
import api from "./axios";
// import axios from "./axios";
import { SANCTUM } from "@/constants/api";

/**
 * Fetch CSRF cookie from Laravel Sanctum
 * Must be called before any POST/PUT/DELETE request when not logged in
 */
export const fetchCsrfToken = async (): Promise<void> => {
  try {
    await api.get(SANCTUM.CSRF_COOKIE);
  } catch (error) {
    console.error("Failed to fetch CSRF cookie:", error);
    throw error;
  }
};