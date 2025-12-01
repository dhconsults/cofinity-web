// src/lib/sanctum.ts
import axios from "./axios";
import { SANCTUM } from "@/constants/api";

/**
 * Fetch CSRF cookie from Laravel Sanctum
 * Must be called before any POST/PUT/DELETE request when not logged in
 */
export const fetchCsrfToken = async (): Promise<void> => {
  try {
    await axios.get(SANCTUM.CSRF_COOKIE);
  } catch (error) {
    console.error("Failed to fetch CSRF cookie:", error);
    throw error;
  }
};