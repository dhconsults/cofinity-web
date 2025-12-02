// src/lib/api-client.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";
import { fetchCsrfToken } from "./sanctum";

// ========================
// 1. Unified Response Format
// ========================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
  statusCode?: number;
}

// ========================
// 2. API Client Class (Your Ionic Pattern — Upgraded)
// ========================
class ApiClient {
  private pendingRequests = new Map<string, Promise<any>>();

  private generateKey(method: string, url: string, config?: AxiosRequestConfig): string {
    const params = config?.params ? JSON.stringify(config.params) : "";
    const body = config?.data ? JSON.stringify(config.data) : "";
    return `${method.toUpperCase()}|${url}|${params}|${body}`;
  }

  private async executeRequest<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const key = this.generateKey(method, url, config);
    const isGet = method === "get";

    // Deduplicate GET requests (fixes React 18 StrictMode double-mount)
    if (isGet && this.pendingRequests.has(key)) {
      console.debug(`[API] Deduplicated GET: ${url}`);
      return this.pendingRequests.get(key)!;
    }

    const requestPromise = (async () => {
      let response: AxiosResponse;

      // Ensure CSRF token for state-changing requests
      if (!isGet) await fetchCsrfToken();

      try {
        switch (method) {
          case "get":
            response = await axios.get(url, config);
            break;
          case "post":
            response = await axios.post(url, data, config);
            break;
          case "put":
            response = await axios.put(url, data, config);
            break;
          case "patch":
            response = await axios.patch(url, data, config);
            break;
          case "delete":
            response = await axios.delete(url, config);
            break;
        }

        // Normalize success response
        const raw = response.data;

        const normalized: ApiResponse<T> = {
          success: true,
          message: typeof raw === "object" && raw.message ? raw.message : "Success",
          data: raw?.data ?? raw ?? null,
          meta: raw?.meta ?? undefined,
        };

        // // Auto toast on success (optional)
        // if (normalized.message && normalized.message !== "Success") {
        //   toast.success(normalized.message);
        // }

        return normalized;
      } catch (error: any) {
        // Normalize error response
        let message = "Something went wrong";
        let errors: string[] = [];
        let statusCode = error.response?.status;

        if (error.response) {
          const res = error.response?.data;

          if (res?.message) message = res.message;
          else if (res?.error) message = res.error;
          else if (typeof res === "string") message = res;

          if (res?.errors) {
            errors = Array.isArray(res.errors)
              ? res.errors
              : Object.values(res.errors).flat() as string[];
            message = errors[0] || message;
          }
        } else if (error.request) {
          message = "No response from server";
        }

        // Show toast (except 401)
        if (statusCode !== 401) {
          toast.error(message);
        }

        const errorResponse: ApiResponse<T> = {
          success: false,
          message,
          errors: errors.length ? errors : undefined,
          data: null as T,
        };

        throw errorResponse; // Important: throw so .catch() works
      }
    })();

    // Cache GET requests
    if (isGet) {
      this.pendingRequests.set(key, requestPromise);
      requestPromise.finally(() => this.pendingRequests.delete(key));
    }

    return requestPromise;
  }

  // Public methods
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.executeRequest<T>("get", url, undefined, config);
  }

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.executeRequest<T>("post", url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.executeRequest<T>("put", url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.executeRequest<T>("patch", url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.executeRequest<T>("delete", url, undefined, config);
  }
}

// ========================
// 3. Export Instance
// ========================
export const apiClient = new ApiClient();

export default apiClient;