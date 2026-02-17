// src/admin/lib/api.ts
import type { Reservation, ReservationStatus } from "./type";

const API_BASE =
  import.meta.env.VITE_API_URL?.trim() || "http://localhost:4000";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  // try to read json error message (if any)
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { message?: string };
      if (data?.message) msg = data.message;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

/* -------------------- RESERVATIONS -------------------- */

export function listReservations(): Promise<Reservation[]> {
  return http<Reservation[]>("/api/reservations");
}

export function createReservation(input: {
  fullName: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomPreference?: string;
  message?: string;
}): Promise<Reservation> {
  return http<Reservation>("/api/reservations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation> {
  return http<Reservation>(`/api/reservations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteReservation(id: string): Promise<void> {
  return http<void>(`/api/reservations/${id}`, { method: "DELETE" });
}

/* -------------------- LIVE UPDATES (polling) --------------------
   Since your backend is plain REST (no websocket/SSE yet),
   we do lightweight polling. This keeps your "NEW" toast working.
*/
export function onReservationsChanged(cb: () => void, intervalMs = 2500) {
  if (typeof window === "undefined") return () => {};

  const timer = window.setInterval(cb, intervalMs);

  // When tab becomes active again, refresh immediately.
  const onVis = () => {
    if (document.visibilityState === "visible") cb();
  };
  document.addEventListener("visibilitychange", onVis);

  return () => {
    window.clearInterval(timer);
    document.removeEventListener("visibilitychange", onVis);
  };
}
