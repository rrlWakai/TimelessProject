import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useMemo } from "react";
import {
  LayoutDashboard,
  CalendarCheck2,
  LogOut,
  ExternalLink,
} from "lucide-react";

function cx(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

function NavItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  const loc = useLocation();
  const active =
    loc.pathname === to || (to !== "/admin" && loc.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={cx(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
        active
          ? "bg-black/5 text-black"
          : "text-black/60 hover:bg-black/[0.04] hover:text-black",
      )}
    >
      <span className="text-black/70">{icon}</span>
      <span className="font-medium">{label}</span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#B08B4F]" />
      )}
    </Link>
  );
}

export default function AdminLayout() {
  const authed = localStorage.getItem("admin_auth") === "true";
  const loc = useLocation();
  const nav = useNavigate();

  if (!authed)
    return <Navigate to="/admin/login" replace state={{ from: loc }} />;

  const logout = () => {
    localStorage.removeItem("admin_auth");
    nav("/admin/login");
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const pageTitle = useMemo(() => {
    if (loc.pathname.startsWith("/admin/reservations")) return "Reservations";
    if (loc.pathname === "/admin") return "Overview";
    return "Dashboard";
  }, [loc.pathname]);

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#FBF8F2]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-xs tracking-[0.3em] text-black/50">
              TIMELESS
            </div>
            <div className="mt-1 text-xl font-semibold">{pageTitle}</div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm hover:bg-black/[0.03]"
            >
              <ExternalLink className="h-4 w-4" />
              View Site
            </a>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-black/10 bg-red-100 px-4 py-2 text-sm shadow-sm hover:bg-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto flex max-w-7xl gap-12 px-6 py-10">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="space-y-6">
            <div>
              <div className="text-xs tracking-[0.25em] text-black/50">
                NAVIGATION
              </div>

              <nav className="mt-4 space-y-2">
                <NavItem
                  to="/admin"
                  label="Overview"
                  icon={<LayoutDashboard className="h-4 w-4" />}
                />
                <NavItem
                  to="/admin/reservations"
                  label="Reservations"
                  icon={<CalendarCheck2 className="h-4 w-4" />}
                />
              </nav>
            </div>

            <div className="text-sm text-black/55 leading-relaxed">
              Keep reservation statuses updated to help your front desk stay
              organized and efficient.
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
