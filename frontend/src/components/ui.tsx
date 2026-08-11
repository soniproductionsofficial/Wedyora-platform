import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function SiteHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link to="/" className="font-display text-3xl font-semibold tracking-wide text-white">
          Wedyora
        </Link>
        <nav className="flex items-center gap-3 text-sm md:gap-5">
          {!user && (
            <>
              <NavLink to="/login" className="hidden text-white/85 hover:text-white sm:inline">
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="btn-gold rounded-full px-4 py-2 text-sm"
              >
                Get started
              </NavLink>
            </>
          )}
          {user && (
            <>
              <NavLink
                to={user.role === "vendor" ? "/vendor" : "/customer"}
                className="text-white/85 hover:text-white"
              >
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="btn-outline rounded-full px-4 py-2 text-sm"
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function DashboardShell({
  title,
  subtitle,
  children,
  nav,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  nav: { to: string; label: string }[];
}) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#ebe6f5_0%,_#faf8ff_45%,_#f7f5fb_100%)]">
      <div className="border-b border-brand-line/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
          <div>
            <Link to="/" className="font-display text-2xl font-semibold text-brand-purple">
              Wedyora
            </Link>
            <p className="text-xs text-brand-muted">
              {user?.fullName} · {user?.role}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to.split("/").length <= 2}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-brand-purple text-white"
                      : "text-brand-purple/80 hover:bg-brand-mist"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-brand-line px-3 py-1.5 text-sm text-brand-muted hover:border-brand-purple/40"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-4xl font-semibold text-brand-purple md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-brand-muted">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}

export function Alert({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error" | "warn";
  children: React.ReactNode;
}) {
  const tones = {
    info: "bg-brand-mist text-brand-purple border-brand-line",
    success: "bg-emerald-50 text-emerald-900 border-emerald-200",
    error: "bg-rose-50 text-rose-900 border-rose-200",
    warn: "bg-amber-50 text-amber-950 border-amber-200",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel px-6 py-10 text-center text-brand-muted">{children}</div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-mist border-t-brand-purple" />
    </div>
  );
}
