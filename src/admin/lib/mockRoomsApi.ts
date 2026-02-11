import type { Room, RoomStatus } from "./roomTypes";

const LS_KEY = "timeless_rooms_v1";

const seed: Room[] = [
  {
    id: "RM-001",
    name: "Deluxe Ocean Suite",
    slug: "deluxe-ocean-suite",
    pricePerNight: 450,
    maxGuests: 2,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "RM-002",
    name: "Presidential Suite",
    slug: "presidential-suite",
    pricePerNight: 850,
    maxGuests: 4,
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1560067174-8943bd8f2662?auto=format&fit=crop&w=1200&q=80",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "RM-003",
    name: "Garden Villa Suite",
    slug: "garden-villa-suite",
    pricePerNight: 550,
    maxGuests: 3,
    status: "hidden",
    imageUrl:
      "https://images.unsplash.com/photo-1551887373-6c5bd60f0a3a?auto=format&fit=crop&w=1200&q=80",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function load(): Room[] {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as Room[];
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
}
function save(data: Room[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export async function listRooms(): Promise<Room[]> {
  await new Promise((r) => setTimeout(r, 120));
  return load().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function upsertRoom(input: {
  id?: string;
  name: string;
  slug: string;
  pricePerNight: number;
  maxGuests: number;
  status: RoomStatus;
  imageUrl?: string;
}): Promise<Room> {
  await new Promise((r) => setTimeout(r, 160));
  const data = load();
  const now = new Date().toISOString();

  if (input.id) {
    const idx = data.findIndex((x) => x.id === input.id);
    if (idx === -1) throw new Error("Room not found");
    data[idx] = { ...data[idx], ...input, updatedAt: now };
    save(data);
    return data[idx];
  }

  const room: Room = {
    id: `RM-${String(Math.floor(1000 + Math.random() * 9000))}`,
    name: input.name,
    slug: input.slug,
    pricePerNight: input.pricePerNight,
    maxGuests: input.maxGuests,
    status: input.status,
    imageUrl: input.imageUrl,
    updatedAt: now,
  };
  data.unshift(room);
  save(data);
  return room;
}

export async function deleteRoom(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 120));
  const data = load().filter((x) => x.id !== id);
  save(data);
}
