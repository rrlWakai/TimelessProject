import type { ReservationStatus } from "../lib/type";

const map: Record<ReservationStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-blue-600/10 text-blue-700 border-blue-700/20" },
  pending: {
    label: "Pending",
    cls: "bg-amber-500/10 text-amber-700 border-amber-700/20",
  },
  confirmed: {
    label: "Confirmed",
    cls: "bg-emerald-600/10 text-emerald-700 border-emerald-700/20",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-rose-600/10 text-rose-700 border-rose-700/20",
  },
};

export default function StatusBadge({ status }: { status: ReservationStatus }) {
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${s.cls}`}
    >
      {s.label}
    </span>
  );
}
