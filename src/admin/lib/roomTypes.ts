export type RoomStatus = "active" | "hidden";

export type Room = {
  id: string;
  name: string;
  slug: string;
  pricePerNight: number;
  maxGuests: number;
  status: RoomStatus;
  imageUrl?: string;
  updatedAt: string; // ISO
};
