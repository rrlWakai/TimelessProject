import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();

  const login = () => {
    // mock auth for now
    localStorage.setItem("admin_auth", "true");
    nav("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-[420px] rounded-2xl bg-white p-8 shadow-sm border border-black/10">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-black/60">
          (Mock) We’ll connect this to backend later.
        </p>

        <button
          onClick={login}
          className="mt-6 w-full rounded-xl bg-black px-4 py-2 text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}
