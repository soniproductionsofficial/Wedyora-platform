import { Link, NavLink } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function SiteHeader() {
  const { user, logout, notifications } = useAuth();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-brand-black text-white border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/wedyora-logo.png" alt="Wedyora" className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm text-white/80">
          <NavLink to="/vendors" className="hover:text-brand-gold-bright">
            Vendors
          </NavLink>
          <NavLink to="/book" className="hover:text-brand-gold-bright">
            Book
          </NavLink>
          {user?.role === "customer" && (
            <NavLink to="/customer" className="hover:text-brand-gold-bright">
              Dashboard
            </NavLink>
          )}
          {user?.role === "vendor" && (
            <NavLink to="/vendor" className="hover:text-brand-gold-bright">
              Vendor Hub
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {user && (
            <Link to={user.role === "vendor" ? "/vendor" : "/customer"} className="relative p-2">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-brand-button text-brand-black text-[10px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-white/70">{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="text-sm px-4 py-2 rounded-full border border-white/30 hover:bg-white hover:text-brand-black"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-button text-brand-black"
              >
                Sign up
              </Link>
              <Link to="/login" className="text-sm text-white/80 hover:text-white">
                Log in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
