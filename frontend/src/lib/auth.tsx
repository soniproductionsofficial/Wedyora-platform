import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { api, type User, type Vendor } from "./api";

interface AuthState {
  user: User | null;
  vendor: Vendor | null;
  customer: unknown;
  loading: boolean;
  socket: Socket | null;
  notifications: NotificationItem[];
  login: (email: string, password: string) => Promise<User>;
  register: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const AuthContext = createContext<AuthState | null>(null);

const SOCKET_URL = import.meta.env.VITE_API_URL || window.location.origin;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [customer, setCustomer] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const connectSocket = useCallback((token: string) => {
    const s = io(SOCKET_URL, { auth: { token } });
    s.on("notification", (n: NotificationItem) => {
      setNotifications((prev) => [n, ...prev]);
    });
    setSocket(s);
    return s;
  }, []);

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem("wedyora_access");
    if (!token) {
      setUser(null);
      setVendor(null);
      setCustomer(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      setVendor(data.vendor);
      setCustomer(data.customer);
      const notes = await api.get("/dashboard/notifications");
      setNotifications(notes.data.notifications ?? []);
    } catch {
      localStorage.removeItem("wedyora_access");
      localStorage.removeItem("wedyora_refresh");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    const token = localStorage.getItem("wedyora_access");
    if (!token || !user) {
      socket?.disconnect();
      setSocket(null);
      return;
    }
    const s = connectSocket(token);
    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, connectSocket]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("wedyora_access", data.accessToken);
    localStorage.setItem("wedyora_refresh", data.refreshToken);
    setUser(data.user);
    setVendor(data.vendor);
    setCustomer(data.customer);
    return data.user as User;
  };

  const register = async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("wedyora_access", data.accessToken);
    localStorage.setItem("wedyora_refresh", data.refreshToken);
    setUser(data.user);
    setVendor(data.vendor);
    setCustomer(data.customer);
  };

  const logout = () => {
    localStorage.removeItem("wedyora_access");
    localStorage.removeItem("wedyora_refresh");
    socket?.disconnect();
    setSocket(null);
    setUser(null);
    setVendor(null);
    setCustomer(null);
    setNotifications([]);
  };

  const markNotificationRead = async (id: string) => {
    await api.post(`/dashboard/notifications/${id}/read`);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const value = useMemo(
    () => ({
      user,
      vendor,
      customer,
      loading,
      socket,
      notifications,
      login,
      register,
      logout,
      refreshMe,
      markNotificationRead,
    }),
    [user, vendor, customer, loading, socket, notifications, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
