export type ReservationStatus = "new" | "pending" | "confirmed" | "cancelled";

export type Reservation = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  roomPreference?: string;
  message?: string;
  status: ReservationStatus;
  createdAt: string; // ISO string
};
