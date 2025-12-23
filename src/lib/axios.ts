// src/lib/axios.ts
import axios from "axios";
import { API_BASE } from "@/constants/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 500) {
      if (!window.location.pathname.includes("/500")) {
        window.location.href = "/500";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 || error.response?.status === 419) {
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
