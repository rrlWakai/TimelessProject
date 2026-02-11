import type { Reservation, ReservationStatus } from "./type";

const seed: Reservation[] = [
  {
    id: "R-1001",
    fullName: "Sarah Swift",
    email: "sarah@example.com",
    phone: "+63 912 345 6789",
    checkIn: "2026-03-02",
    checkOut: "2026-03-04",
    guests: 2,
    roomPreference: "Presidential Suite",
    message: "Anniversary stay — quiet room please.",
    status: "new",
    createdAt: new Date().toISOString(),
  },
  {
    id: "R-1002",
    fullName: "Paul Benson",
    email: "paul@example.com",
    checkIn: "2026-03-10",
    checkOut: "2026-03-12",
    guests: 4,
    roomPreference: "Garden Villa Suite",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "R-1003",
    fullName: "Sophie Martin",
    email: "sophie@example.com",
    checkIn: "2026-02-20",
    checkOut: "2026-02-22",
    guests: 3,
    roomPreference: "Deluxe Ocean Suite",
    status: "confirmed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const LS_KEY = "timeless_reservations_v1";

function load(): Reservation[] {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as Reservation[];
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
}

function save(data: Reservation[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export async function listReservations(): Promise<Reservation[]> {
  await new Promise((r) => setTimeout(r, 150)); // simulate network
  return load().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<Reservation> {
  await new Promise((r) => setTimeout(r, 150));
  const data = load();
  const idx = data.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error("Reservation not found");

  data[idx] = { ...data[idx], status };
  save(data);
  return data[idx];
}
