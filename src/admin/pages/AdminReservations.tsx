// src/admin/pages/AdminReservations.tsx
import { useEffect, useMemo, useState } from "react";
import type { Reservation, ReservationStatus } from "../lib/type";
import {
  listReservations,
  updateReservationStatus,
  deleteReservation,
} from "../lib/mockApi";
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

function DeleteModal({
  open,
  reservation,
  busy,
  onClose,
  onConfirm,
}: {
  open: boolean;
  reservation: Reservation | null;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={[
        "fixed inset-0 z-[60] transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div
        onClick={busy ? undefined : onClose}
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={[
            "w-full max-w-md rounded-3xl border border-black/10 bg-white shadow-2xl",
            "transition-all duration-300",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          ].join(" ")}
        >
          <div className="p-6 sm:p-7">
            <div className="text-xs tracking-[0.25em] text-rose-700">
              DELETE RESERVATION
            </div>

            <div className="mt-3 text-lg font-semibold text-black">
              Are you sure?
            </div>

            <p className="mt-2 text-sm leading-relaxed text-black/65">
              This will permanently delete{" "}
              <span className="font-medium text-black">
                {reservation?.id ?? "this reservation"}
              </span>
              . This action cannot be undone.
            </p>

            {reservation && (
              <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-sm">
                <div className="font-medium">{reservation.fullName}</div>
                <div className="text-black/60">{reservation.email}</div>
                <div className="text-black/60">
                  {formatDate(reservation.checkIn)} –{" "}
                  {formatDate(reservation.checkOut)} • {reservation.guests}{" "}
                  guests
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                disabled={busy}
                onClick={onClose}
                className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                disabled={busy}
                onClick={onConfirm}
                className="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-600/90 disabled:opacity-60"
              >
                {busy ? "Deleting..." : "Delete"}
              </button>
            </div>

            <div className="mt-3 text-xs text-black/45">
              Tip: Use “Cancel” instead of deleting if you want to keep records.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminReservations() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [active, setActive] = useState<"all" | ReservationStatus>("all");
  const [query, setQuery] = useState("");

  const [selected, setSelected] = useState<Reservation | null>(null);

  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);

  // NEW: delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null);

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
    setActionError(null);
    setSaving(id);
    try {
      const updated = await updateReservationStatus(id, status);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setSelected((prev) => (prev?.id === id ? updated : prev));
    } catch {
      setActionError("Failed to update status. Please try again.");
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

  // OPEN delete modal (no window.confirm)
  function requestDelete(r: Reservation) {
    setActionError(null);
    setDeleteTarget(r);
    setDeleteOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setActionError(null);
    setDeleting(deleteTarget.id);

    try {
      await deleteReservation(deleteTarget.id);
      setItems((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      setSelected((prev) => (prev?.id === deleteTarget.id ? null : prev));

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch {
      setActionError("Failed to delete. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  const drawerOpen = !!selected;

  // close drawer on ESC
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
              placeholder="Search name, email, ID, phone, room..."
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

      {/* Filters */}
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

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="max-h-[520px] overflow-auto">
          <div className="min-w-[980px]">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-[#FBF8F2] text-black/70">
                <tr>
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Guest</th>
                  <th className="px-5 py-3 font-medium">Dates</th>
                  <th className="px-5 py-3 font-medium">Guests</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Room Pref</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-5 py-6 text-black/60" colSpan={8}>
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td className="px-5 py-6 text-black/60" colSpan={8}>
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
                        {r.phone ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-black/70">
                        {r.roomPreference ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setActionError(null);
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

      {/* Details Drawer */}
      <div
        className={[
          "fixed inset-0 z-50 transition",
          drawerOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={() => setSelected(null)}
          className={[
            "absolute inset-0 bg-black/40 transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

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
              <div className="sm:hidden flex justify-center pt-3">
                <div className="h-1 w-12 rounded-full bg-black/20" />
              </div>

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

              <div className="flex-1 overflow-auto p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                    <div className="text-xs text-black/50">Guest</div>
                    <div className="mt-1 font-medium text-base">
                      {selected.fullName}
                    </div>
                    <div className="text-black/60">{selected.email}</div>
                    {selected.phone ? (
                      <a
                        href={`tel:${selected.phone.replace(/\s+/g, "")}`}
                        className="mt-1 inline-block text-emerald-700 font-medium hover:underline"
                      >
                        {selected.phone}
                      </a>
                    ) : (
                      <div className="mt-1 text-black/50">—</div>
                    )}
                  </div>

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

              <div className="border-t border-black/10 p-5 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <button
                    disabled={
                      saving === selected.id || deleting === selected.id
                    }
                    onClick={() => setStatus(selected.id, "confirmed")}
                    className="w-full sm:w-auto rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600/90 disabled:opacity-60"
                  >
                    {saving === selected.id ? "Saving..." : "Confirm"}
                  </button>

                  <button
                    disabled={
                      saving === selected.id || deleting === selected.id
                    }
                    onClick={() => setStatus(selected.id, "pending")}
                    className="w-full sm:w-auto rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03] disabled:opacity-60"
                  >
                    Mark Pending
                  </button>

                  <button
                    disabled={
                      saving === selected.id || deleting === selected.id
                    }
                    onClick={() => setStatus(selected.id, "cancelled")}
                    className="w-full sm:w-auto rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-600/90 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={
                      saving === selected.id || deleting === selected.id
                    }
                    onClick={() => setStatus(selected.id, "new")}
                    className="w-full sm:w-auto rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03] disabled:opacity-60"
                  >
                    Set New
                  </button>

                  <button
                    disabled={deleting === selected.id}
                    onClick={() => copyReservation(selected)}
                    className="w-full sm:w-auto rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-black/[0.03] disabled:opacity-60"
                  >
                    {copied ? "Copied ✓" : "Copy Details"}
                  </button>

                  {/* Delete -> opens modal */}
                  <button
                    disabled={
                      saving === selected.id || deleting === selected.id
                    }
                    onClick={() => requestDelete(selected)}
                    className="w-full sm:w-auto rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 shadow-sm hover:bg-rose-100 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>

                {actionError && (
                  <div className="mt-3 text-xs text-rose-700">
                    {actionError}
                  </div>
                )}

                {copied && !actionError && (
                  <div className="mt-3 text-xs text-emerald-700">
                    Reservation details copied to clipboard.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deletion Modal */}
      <DeleteModal
        open={deleteOpen}
        reservation={deleteTarget}
        busy={!!deleting}
        onClose={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
