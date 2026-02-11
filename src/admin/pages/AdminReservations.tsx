import { useEffect, useMemo, useState } from "react";
import type { Reservation, ReservationStatus } from "../lib/type";
import { listReservations, updateReservationStatus } from "../lib/mockApi";
import StatusBadge from "../components/StatusBadge";

const filters: Array<{ key: "all" | ReservationStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString();
}

export default function AdminReservations() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<"all" | ReservationStatus>("all");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const data = await listReservations();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((x) => x.status === active);
  }, [items, active]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const f of filters) {
      if (f.key !== "all")
        c[f.key] = items.filter((x) => x.status === f.key).length;
    }
    return c;
  }, [items]);

  async function setStatus(id: string, status: ReservationStatus) {
    setSaving(id);
    try {
      const updated = await updateReservationStatus(id, status);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setSelected((prev) => (prev?.id === id ? updated : prev));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Reservations</h1>
          <p className="mt-1 text-sm text-black/60">
            Manage inquiries and reservation requests.
          </p>
        </div>

        <button
          onClick={refresh}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/[0.03]"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={[
                "rounded-full px-4 py-2 text-sm border transition",
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white border-black/10 hover:bg-black/[0.03]",
              ].join(" ")}
            >
              {f.label}{" "}
              <span className={isActive ? "text-white/80" : "text-black/50"}>
                ({counts[f.key] ?? 0})
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-black/70">
              <tr>
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Dates</th>
                <th className="px-5 py-3 font-medium">Guests</th>
                <th className="px-5 py-3 font-medium">Room Pref</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="px-5 py-6 text-black/60" colSpan={7}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-black/60" colSpan={7}>
                    No reservations found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="border-t border-black/10">
                    <td className="px-5 py-4 font-medium">{r.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium">{r.fullName}</div>
                      <div className="text-xs text-black/60">{r.email}</div>
                    </td>
                    <td className="px-5 py-4 text-black/70">
                      {formatDate(r.checkIn)} – {formatDate(r.checkOut)}
                    </td>
                    <td className="px-5 py-4">{r.guests}</td>
                    <td className="px-5 py-4 text-black/70">
                      {r.roomPreference ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(r)}
                        className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs hover:bg-black/[0.03]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-lg border border-black/10">
            <div className="flex items-start justify-between gap-4 p-6">
              <div>
                <div className="text-xs text-black/50">Reservation</div>
                <div className="text-xl font-semibold">{selected.id}</div>
                <div className="mt-2">
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg border border-black/10 px-3 py-2 text-sm hover:bg-black/[0.03]"
              >
                Close
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-black/50">Guest</div>
                  <div className="font-medium">{selected.fullName}</div>
                  <div className="text-black/60">{selected.email}</div>
                  {selected.phone && (
                    <div className="text-black/60">{selected.phone}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-black/50">Stay</div>
                  <div className="font-medium">
                    {formatDate(selected.checkIn)} –{" "}
                    {formatDate(selected.checkOut)}
                  </div>
                  <div className="text-black/60">{selected.guests} guests</div>
                  <div className="text-black/60">
                    Room: {selected.roomPreference ?? "—"}
                  </div>
                </div>
              </div>

              {selected.message && (
                <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4 text-sm">
                  <div className="text-xs text-black/50 mb-1">Message</div>
                  <div className="text-black/80">{selected.message}</div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  disabled={saving === selected.id}
                  onClick={() => setStatus(selected.id, "confirmed")}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  Confirm
                </button>
                <button
                  disabled={saving === selected.id}
                  onClick={() => setStatus(selected.id, "pending")}
                  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/[0.03] disabled:opacity-60"
                >
                  Mark Pending
                </button>
                <button
                  disabled={saving === selected.id}
                  onClick={() => setStatus(selected.id, "cancelled")}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  disabled={saving === selected.id}
                  onClick={() => setStatus(selected.id, "new")}
                  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/[0.03] disabled:opacity-60"
                >
                  Set New
                </button>
              </div>

              <div className="text-xs text-black/50">
                Created: {new Date(selected.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
