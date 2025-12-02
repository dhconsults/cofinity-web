// src/lib/axios.ts
import axios from "axios";
import { API_BASE } from "@/constants/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Critical for Sanctum cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Optional: Global response interceptor (401 → auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {

    console.error("API error:", error);
    // if (error.response?.status === 401 || error.response?.status === 419) {
    //   // 419 = CSRF token mismatch or session expired
    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

export default api;