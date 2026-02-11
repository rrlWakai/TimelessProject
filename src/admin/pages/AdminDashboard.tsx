import { useEffect, useMemo, useState } from "react";
import AdminCard from "../components/AdminCard";
import AdminPageHeader from "../components/AdminPageHeader";
import { listReservations } from "../lib/mockApi";
import type { Reservation } from "../lib/type";

export default function AdminDashboard() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setItems(await listReservations());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const by = (s: Reservation["status"]) =>
      items.filter((x) => x.status === s).length;

    return {
      total,
      new: by("new"),
      pending: by("pending"),
      confirmed: by("confirmed"),
      cancelled: by("cancelled"),
    };
  }, [items]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="OVERVIEW"
        title="Dashboard"
        subtitle="Quick snapshot of reservation activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminCard title="TOTAL REQUESTS" value={loading ? "…" : stats.total} />
        <AdminCard title="NEW" value={loading ? "…" : stats.new} />
        <AdminCard title="PENDING" value={loading ? "…" : stats.pending} />
        <AdminCard title="CONFIRMED" value={loading ? "…" : stats.confirmed} />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">Notes</div>
        <p className="mt-2 text-sm text-black/60">
          Next: connect real backend + MySQL. Your UI is already ready for it.
        </p>
      </div>
    </div>
  );
}
