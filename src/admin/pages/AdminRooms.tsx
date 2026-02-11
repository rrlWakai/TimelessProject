import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "../components/AdminPageHeader";
import SearchInput from "../components/SearchInput";
import type { Room, RoomStatus } from "../lib/roomTypes";
import { deleteRoom, listRooms, upsertRoom } from "../lib/mockRoomsApi";

function currency(n: number) {
  return `$${n.toLocaleString()}`;
}

function RoomBadge({ status }: { status: RoomStatus }) {
  const cls =
    status === "active"
      ? "bg-emerald-600/10 text-emerald-700 border-emerald-700/20"
      : "bg-black/5 text-black/70 border-black/10";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}
    >
      {status === "active" ? "Active" : "Hidden"}
    </span>
  );
}

export default function AdminRooms() {
  const [items, setItems] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listRooms());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) =>
      [x.name, x.slug, x.id].join(" ").toLowerCase().includes(q),
    );
  }, [items, query]);

  async function onDelete(id: string) {
    const ok = confirm("Delete this room?");
    if (!ok) return;
    await deleteRoom(id);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  async function onSave(form: {
    id?: string;
    name: string;
    slug: string;
    pricePerNight: number;
    maxGuests: number;
    status: RoomStatus;
    imageUrl?: string;
  }) {
    setSaving(true);
    try {
      const saved = await upsertRoom(form);
      setItems((prev) => {
        const exists = prev.some((x) => x.id === saved.id);
        return exists
          ? prev.map((x) => (x.id === saved.id ? saved : x))
          : [saved, ...prev];
      });
      setOpen(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="ROOMS"
        title="Room Management"
        subtitle="Add, edit, and control what appears on the public site."
        right={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search rooms..."
            />
            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black/90"
            >
              Add Room
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60 shadow-sm">
          Loading rooms...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60 shadow-sm">
          No rooms found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
            >
              <div className="aspect-[16/9] bg-black/[0.03]">
                {r.imageUrl ? (
                  <img
                    src={r.imageUrl}
                    alt={r.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{r.name}</div>
                    <div className="mt-1 text-sm text-black/60">{r.slug}</div>
                  </div>
                  <RoomBadge status={r.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-black/70">
                  <span className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1">
                    {currency(r.pricePerNight)} / night
                  </span>
                  <span className="rounded-full border border-black/10 bg-black/[0.02] px-3 py-1">
                    Max {r.maxGuests} guests
                  </span>
                </div>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(r);
                      setOpen(true);
                    }}
                    className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm hover:bg-black/[0.03]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(r.id)}
                    className="rounded-xl border border-rose-600/20 bg-rose-600/10 px-4 py-2 text-sm text-rose-700 hover:bg-rose-600/15"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <RoomModal
          saving={saving}
          initial={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSave={onSave}
        />
      )}
    </div>
  );
}

function RoomModal({
  initial,
  onClose,
  onSave,
  saving,
}: {
  initial: Room | null;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    name: string;
    slug: string;
    pricePerNight: number;
    maxGuests: number;
    status: RoomStatus;
    imageUrl?: string;
  }) => void;
  saving: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [price, setPrice] = useState(String(initial?.pricePerNight ?? 450));
  const [maxGuests, setMaxGuests] = useState(String(initial?.maxGuests ?? 2));
  const [status, setStatus] = useState<RoomStatus>(initial?.status ?? "active");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");

  const canSave =
    name.trim() &&
    slug.trim() &&
    Number.isFinite(Number(price)) &&
    Number.isFinite(Number(maxGuests));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-black/10 bg-white shadow-lg">
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <div className="text-xs tracking-[0.25em] text-black/50">ROOM</div>
            <div className="mt-2 text-xl font-semibold">
              {initial ? "Edit Room" : "Add Room"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-black/[0.03]"
          >
            Close
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/20"
                placeholder="Deluxe Ocean Suite"
              />
            </Field>
            <Field label="Slug">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/20"
                placeholder="deluxe-ocean-suite"
              />
            </Field>

            <Field label="Price / Night">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/20"
                placeholder="450"
              />
            </Field>

            <Field label="Max Guests">
              <input
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/20"
                placeholder="2"
              />
            </Field>

            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus)}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/20"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </Field>

            <Field label="Image URL (optional)">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/20"
                placeholder="https://..."
              />
            </Field>
          </div>

          <button
            disabled={!canSave || saving}
            onClick={() =>
              onSave({
                id: initial?.id,
                name: name.trim(),
                slug: slug.trim(),
                pricePerNight: Number(price),
                maxGuests: Number(maxGuests),
                status,
                imageUrl: imageUrl.trim() || undefined,
              })
            }
            className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-black/90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <div className="text-xs text-black/50">{label}</div>
      {children}
    </label>
  );
}
