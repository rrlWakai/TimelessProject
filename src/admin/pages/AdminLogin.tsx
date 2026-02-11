import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLogin() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("admin_auth", "true");
      nav("/admin");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur">
        <div className="text-xs tracking-[0.25em] text-black/50">TIMELESS</div>
        <h1 className="mt-2 text-2xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-black/60">
          Secure access to reservations and room management.
        </p>

        <div className="mt-6 space-y-3">
          <button
            onClick={login}
            disabled={loading}
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in (Mock)"}
          </button>

          <div className="text-xs text-black/50">
            Later: replace with real auth + JWT.
          </div>
        </div>

        <div className="mt-8 h-px bg-black/10" />

        <div className="mt-4 text-xs text-black/50">
          © {new Date().getFullYear()} Timeless Luxury
        </div>
      </div>
    </div>
  );
}
