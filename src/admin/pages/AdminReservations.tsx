// src/admin/pages/AdminReservations.tsx
import { useEffect, useMemo, useState } from "react";
import type { Reservation, ReservationStatus } from "../lib/type";
import { listReservations, updateReservationStatus } from "../lib/mockApi";
import StatusBadge from "../components/StatusBadge";
import AdminPageHeader from "../components/AdminPageHeader";
import SearchInput from "../components/SearchInput";

const filters: Array<{ key: "all" | ReservationStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

function formatDate(d: string) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString();
}

export default function AdminReservations() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [active, setActive] = useState<"all" | ReservationStatus>("all");
  const [query, setQuery] = useState("");

  const [selected, setSelected] = useState<Reservation | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

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

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const f of filters) {
      if (f.key !== "all")
        c[f.key] = items.filter((x) => x.status === f.key).length;
    }
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list =
      active === "all" ? items : items.filter((x) => x.status === active);

    if (!q) return list;

    return list.filter((x) => {
      const hay = [
        x.id,
        x.fullName,
        x.email,
        x.phone ?? "",
        x.roomPreference ?? "",
        x.message ?? "",
        x.checkIn,
        x.checkOut,
      ]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [items, active, query]);

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

  function copyReservation(r: Reservation) {
    const text = `
Reservation ID: ${r.id}
Guest: ${r.fullName}
Email: ${r.email}
Phone: ${r.phone ?? "—"}
Check-in: ${r.checkIn}
Check-out: ${r.checkOut}
Guests: ${r.guests}
Room: ${r.roomPreference ?? "—"}
Status: ${r.status}
Message: ${r.message ?? "—"}
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  const drawerOpen = !!selected;

  // close on ESC
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="RESERVATIONS"
        title="Manage Requests"
        subtitle="Filter, review, and update booking statuses."
        right={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search name, email, ID, room..."
            />
            <button
              onClick={refresh}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03]"
            >
              Refresh
            </button>
          </div>
        }
      />

      {/* Filters (scrollable on mobile) */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filters.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={[
                "shrink-0 rounded-full px-4 py-2 text-sm border transition shadow-sm",
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

      {/* Table: horizontal scroll on small screens */}
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="max-h-[520px] overflow-auto">
          <div className="min-w-[900px]">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-[#FBF8F2] text-black/70">
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
                    <tr
                      key={r.id}
                      className="border-t border-black/10 hover:bg-black/[0.02]"
                    >
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
                          onClick={() => {
                            setCopied(false);
                            setSelected(r);
                          }}
                          className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs shadow-sm hover:bg-black/[0.03]"
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
      </div>

      {/* Responsive Details Drawer */}
      <div
        className={[
          "fixed inset-0 z-50 transition",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!drawerOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setSelected(null)}
          className={[
            "absolute inset-0 bg-black/40 transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Panel (mobile bottom sheet, desktop right drawer) */}
        <div
          className={[
            "absolute bg-white shadow-2xl border-black/10",
            "transition-transform duration-300",
            "sm:right-0 sm:top-0 sm:h-full sm:w-[520px] sm:border-l",
            "left-0 right-0 bottom-0 sm:left-auto sm:right-0",
            "max-h-[85vh] sm:max-h-none",
            "border-t sm:border-t-0",
            drawerOpen
              ? "translate-y-0 sm:translate-x-0"
              : "translate-y-full sm:translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          {selected && (
            <div className="flex h-full flex-col">
              {/* Drag handle (mobile) */}
              <div className="sm:hidden flex justify-center pt-3">
                <div className="h-1 w-12 rounded-full bg-black/20" />
              </div>

              {/* Header */}
              <div className="border-b border-black/10 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs tracking-[0.25em] text-black/50">
                      RESERVATION
                    </div>
                    <div className="mt-2 text-lg sm:text-xl font-semibold">
                      {selected.id}
                    </div>
                    <div className="mt-3">
                      <StatusBadge status={selected.status} />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-black/[0.03]"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  {/* Guest */}
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                    <div className="text-xs text-black/50">Guest</div>
                    <div className="mt-1 font-medium text-base">
                      {selected.fullName}
                    </div>
                    <div className="text-black/60">{selected.email}</div>

                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone.replace(/\s+/g, "")}`}
                        className="mt-1 inline-block text-emerald-700 font-medium hover:underline"
                      >
                        {selected.phone}
                      </a>
                    )}
                  </div>

                  {/* Stay */}
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                    <div className="text-xs text-black/50">Stay</div>
                    <div className="mt-1 font-medium">
                      {formatDate(selected.checkIn)} –{" "}
                      {formatDate(selected.checkOut)}
                    </div>
                    <div className="text-black/60">
                      {selected.guests} guests
                    </div>
                    <div className="text-black/60">
                      Room: {selected.roomPreference ?? "—"}
                    </div>
                  </div>
                </div>

                {selected.message && (
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm">
                    <div className="text-xs text-black/50 mb-1">Message</div>
                    <div className="text-black/80">{selected.message}</div>
                  </div>
                )}

                <div className="text-xs text-black/50">
                  Created: {new Date(selected.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Footer actions */}
              <div className="border-t border-black/10 p-5 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    disabled={saving === selected.id}
                    onClick={() => setStatus(selected.id, "confirmed")}
                    className="w-full sm:w-auto rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600/90 disabled:opacity-60"
                  >
                    {saving === selected.id ? "Saving..." : "Confirm"}
                  </button>

                  <button
                    disabled={saving === selected.id}
                    onClick={() => setStatus(selected.id, "pending")}
                    className="w-full sm:w-auto rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03] disabled:opacity-60"
                  >
                    Mark Pending
                  </button>

                  <button
                    disabled={saving === selected.id}
                    onClick={() => setStatus(selected.id, "cancelled")}
                    className="w-full sm:w-auto rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-600/90 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={saving === selected.id}
                    onClick={() => setStatus(selected.id, "new")}
                    className="w-full sm:w-auto rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03] disabled:opacity-60"
                  >
                    Set New
                  </button>

                  <button
                    onClick={() => copyReservation(selected)}
                    className="w-full sm:w-auto rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03]"
                  >
                    {copied ? "Copied ✓" : "Copy Details"}
                  </button>
                </div>

                {copied && (
                  <div className="mt-3 text-xs text-emerald-700">
                    Reservation details copied to clipboard.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
