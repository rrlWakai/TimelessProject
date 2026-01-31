import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[rgb(var(--bg))] text-[rgb(var(--ink))]">
      {/* Subtle luxury background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_0%,rgba(197,168,108,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_20%,rgba(0,0,0,0.05),transparent_55%)]" />
      </div>

      {children}
    </div>
  );
}
