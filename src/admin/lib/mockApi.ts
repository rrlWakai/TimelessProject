// src/admin/lib/mockApi.ts
import type { Reservation, ReservationStatus } from "./type";

const seed: Reservation[] = [];

const LS_KEY = "timeless_reservations_v1";
const LS_SEQ_KEY = "timeless_reservations_seq_v1";

// ✅ Event system for live updates
const EVENT_KEY = "timeless_reservations_changed";

function emitReservationsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_KEY));
}

export function onReservationsChanged(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_KEY, cb);
  return () => window.removeEventListener(EVENT_KEY, cb);
}

function parseNumericId(id: string): number | null {
  // supports "R-100" or "R-0100" etc.
  const m = /^R-(\d+)$/.exec(id.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function getMaxNumericId(list: Reservation[]) {
  let max = 0;
  for (const r of list) {
    const n = parseNumericId(r.id);
    if (n && n > max) max = n;
  }
  return max;
}

function ensureSeq(list: Reservation[]) {
  if (localStorage.getItem(LS_SEQ_KEY)) return;

  const max = getMaxNumericId(list);
  // ✅ seq stores the "last used number"
  // if no reservations yet, last used should be 99 so first becomes 100
  const lastUsed = max > 0 ? max : 99;
  localStorage.setItem(LS_SEQ_KEY, String(Math.max(99, lastUsed)));
}

function load(): Reservation[] {
  const raw = localStorage.getItem(LS_KEY);

  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    ensureSeq(seed);
    return seed;
  }

  try {
    const parsed = JSON.parse(raw) as Reservation[];
    ensureSeq(parsed);
    return parsed;
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    ensureSeq(seed);
    return seed;
  }
}

function save(data: Reservation[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ✅ first created reservation = R-100
function nextId(): string {
  const data = load(); // ensures seq exists
  void data;

  const raw = localStorage.getItem(LS_SEQ_KEY);
  const lastUsed = raw ? Number(raw) : 99;

  const safeLast = Number.isFinite(lastUsed) ? lastUsed : 99;
  const next = safeLast + 1;

  localStorage.setItem(LS_SEQ_KEY, String(next));
  return `R-${next}`;
}

export async function listReservations(): Promise<Reservation[]> {
  await new Promise((r) => setTimeout(r, 150));
  return load().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation> {
  await new Promise((r) => setTimeout(r, 150));

  const data = load();
  const idx = data.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error("Reservation not found");

  data[idx] = { ...data[idx], status };
  save(data);

  // ✅ tell admin pages something changed
  emitReservationsChanged();

  return data[idx];
}

export async function deleteReservation(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 150));

  const data = load();
  const next = data.filter((x) => x.id !== id);

  if (next.length === data.length) throw new Error("Reservation not found");

  save(next);

  // ✅ tell admin pages something changed
  emitReservationsChanged();
}

export async function createReservation(input: {
  fullName: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomPreference?: string;
  message?: string;
}): Promise<Reservation> {
  await new Promise((r) => setTimeout(r, 150));

  const data = load();
  const now = new Date().toISOString();

  const reservation: Reservation = {
    id: nextId(),
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() || undefined,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    roomPreference: input.roomPreference?.trim() || undefined,
    message: input.message?.trim() || undefined,
    status: "new" as ReservationStatus,
    createdAt: now,
  };

  data.unshift(reservation);
  save(data);

  // ✅ tell admin pages a new reservation arrived
  emitReservationsChanged();

  return reservation;
}
