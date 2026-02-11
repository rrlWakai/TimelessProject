import type { Reservation, ReservationStatus } from "./type";

const seed: Reservation[] = [
 
];

const LS_KEY = "timeless_reservations_v1";
const LS_SEQ_KEY = "timeless_reservations_seq_v1";

function load(): Reservation[] {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    // initialize sequence from seed
    const max = getMaxNumericId(seed);
    localStorage.setItem(LS_SEQ_KEY, String(Math.max(100, max)));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw) as Reservation[];
    // ensure seq exists
    if (!localStorage.getItem(LS_SEQ_KEY)) {
      const max = getMaxNumericId(parsed);
      localStorage.setItem(LS_SEQ_KEY, String(Math.max(100, max)));
    }
    return parsed;
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    const max = getMaxNumericId(seed);
    localStorage.setItem(LS_SEQ_KEY, String(Math.max(100, max)));
    return seed;
  }
}

function save(data: Reservation[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function getMaxNumericId(list: Reservation[]) {
  let max = 0;
  for (const r of list) {
    const n = parseNumericId(r.id);
    if (n && n > max) max = n;
  }
  return max;
}

function parseNumericId(id: string): number | null {
  // supports "R-100" or "R-0100" etc.
  const m = /^R-(\d+)$/.exec(id.trim());
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

function nextId(): string {
  // Always increment from stored sequence
  const raw = localStorage.getItem(LS_SEQ_KEY);
  const current = raw ? Number(raw) : Math.max(100, getMaxNumericId(load()));
  const next = Number.isFinite(current) ? current + 1 : 101;

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
  return data[idx];
}

export async function deleteReservation(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 150));

  const data = load();
  const next = data.filter((x) => x.id !== id);

  if (next.length === data.length) throw new Error("Reservation not found");

  save(next);
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

  return reservation;
}
