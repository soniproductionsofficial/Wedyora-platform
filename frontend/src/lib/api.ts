const API_BASE = import.meta.env.VITE_API_URL ?? "";

export type Role = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  phone?: string;
  createdAt?: string;
}

export interface ApiError {
  message: string;
  details?: unknown;
}

class ApiClient {
  accessToken: string | null = localStorage.getItem("wedyora_access");
  refreshToken: string | null = localStorage.getItem("wedyora_refresh");

  setTokens(access: string | null, refresh?: string | null) {
    this.accessToken = access;
    if (access) localStorage.setItem("wedyora_access", access);
    else localStorage.removeItem("wedyora_access");
    if (refresh !== undefined) {
      this.refreshToken = refresh;
      if (refresh) localStorage.setItem("wedyora_refresh", refresh);
      else localStorage.removeItem("wedyora_refresh");
    }
  }

  clear() {
    this.setTokens(null, null);
  }

  async request<T>(
    path: string,
    options: RequestInit & { auth?: boolean } = {}
  ): Promise<T> {
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }
    if (options.auth !== false && this.accessToken) {
      headers.set("Authorization", `Bearer ${this.accessToken}`);
    }

    let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401 && this.refreshToken && options.auth !== false) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        headers.set("Authorization", `Bearer ${this.accessToken}`);
        res = await fetch(`${API_BASE}${path}`, { ...options, headers });
      }
    }

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      const err: ApiError = {
        message: json?.error?.message ?? res.statusText ?? "Request failed",
        details: json?.error?.details,
      };
      throw err;
    }
    return json.data as T;
  }

  private async tryRefresh(): Promise<boolean> {
    try {
      const data = await this.request<{
        accessToken: string;
        refreshToken: string;
      }>("/api/auth/refresh", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      this.clear();
      return false;
    }
  }
}

export const api = new ApiClient();

export function formatMoney(amountMinor: number, currency = "inr") {
  const major = amountMinor / 100;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(major);
  } catch {
    return `₹${major.toLocaleString("en-IN")}`;
  }
}

export function formatINR(rupees: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export const SERVICE_TYPES = [
  "Photographer",
  "Videographer",
  "Catering",
  "Decor",
  "Makeup",
  "Mehendi",
  "DJ",
  "Venue",
  "Planner",
  "Florist",
  "Transportation",
  "Priest",
];

export const EVENT_TYPES = [
  "Wedding",
  "Engagement",
  "Reception",
  "Mehendi",
  "Sangeet",
  "Haldi",
  "Anniversary",
];
