import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type User } from "./api";

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: Record<string, unknown>) => Promise<User>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    if (!api.accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const dash = await api.request<{ role: string }>("/api/dashboard");
      // Dashboard confirms token; rehydrate user from local storage mirror
      const cached = localStorage.getItem("wedyora_user");
      if (cached) {
        const parsed = JSON.parse(cached) as User;
        if (parsed.role === dash.role) setUser(parsed);
        else setUser({ ...parsed, role: dash.role as User["role"] });
      }
    } catch {
      api.clear();
      localStorage.removeItem("wedyora_user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>("/api/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    });
    api.setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem("wedyora_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload: Record<string, unknown>) => {
    const data = await api.request<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>("/api/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify(payload),
    });
    api.setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem("wedyora_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    api.clear();
    localStorage.removeItem("wedyora_user");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshSession }),
    [user, loading, login, register, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
