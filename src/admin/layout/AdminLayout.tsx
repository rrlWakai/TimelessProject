import { Link, Navigate, Outlet, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const authed = localStorage.getItem("admin_auth") === "true";
  const loc = useLocation();

  if (!authed)
    return <Navigate to="/admin/login" replace state={{ from: loc }} />;

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      <aside className="w-64 bg-black text-white p-6">
        <div className="text-lg font-semibold">Timeless Admin</div>

        <nav className="mt-8 flex flex-col gap-3 text-sm">
          <Link className="rounded-lg px-3 py-2 hover:bg-white/10" to="/admin">
            Dashboard
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
