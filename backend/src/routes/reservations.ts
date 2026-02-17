// backend/src/routes/reservations.ts
import { Router } from "express";

const router = Router();

type ReservationStatus = "new" | "pending" | "confirmed" | "cancelled";

type Reservation = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomPreference?: string;
  message?: string;
  status: ReservationStatus;
  createdAt: string;
};

// In-memory storage (Step 2 only). We’ll replace with DB later.
let seq = 100; // ✅ first booking will be R-100
const reservations: Reservation[] = [];

function nextId() {
  const id = `R-${seq}`;
  seq += 1;
  return id;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function parseISODate(value: string) {
  // Accepts YYYY-MM-DD from input[type="date"]
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const allowedStatuses: ReservationStatus[] = [
  "new",
  "pending",
  "confirmed",
  "cancelled",
];

// GET /api/reservations
router.get("/", (_req, res) => {
  const sorted = [...reservations].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
  res.json(sorted);
});

// POST /api/reservations
router.post("/", (req, res) => {
  const {
    fullName,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    roomPreference,
    message,
  } = req.body ?? {};

  const name = String(fullName ?? "").trim();
  const mail = String(email ?? "").trim();
  const phoneStr = phone ? String(phone).trim() : "";
  const inStr = String(checkIn ?? "").trim();
  const outStr = String(checkOut ?? "").trim();
  const guestsNum = Number(guests);

  // Required
  if (!name || !mail || !inStr || !outStr || !Number.isFinite(guestsNum)) {
    return res.status(400).json({
      message: "Missing required fields.",
      fields: ["fullName", "email", "checkIn", "checkOut", "guests"],
    });
  }

  // Email
  if (!isValidEmail(mail)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  // Guests
  if (!Number.isInteger(guestsNum) || guestsNum < 1) {
    return res.status(400).json({ message: "Guests must be at least 1." });
  }

  // Dates
  const inD = parseISODate(inStr);
  const outD = parseISODate(outStr);
  if (!inD || !outD) {
    return res.status(400).json({ message: "Invalid check-in/check-out date." });
  }
  if (outD.getTime() <= inD.getTime()) {
    return res
      .status(400)
      .json({ message: "Check-out must be after check-in." });
  }

  // Phone (optional but validated if present)
  if (phoneStr && !isValidPhone(phoneStr)) {
    return res.status(400).json({ message: "Invalid phone number." });
  }

  const reservation: Reservation = {
    id: nextId(),
    fullName: name,
    email: mail,
    phone: phoneStr || undefined,
    checkIn: inStr,
    checkOut: outStr,
    guests: guestsNum,
    roomPreference: roomPreference ? String(roomPreference).trim() : undefined,
    message: message ? String(message).trim() : undefined,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  reservations.unshift(reservation);
  return res.status(201).json(reservation);
});

// PATCH /api/reservations/:id/status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const status = String(req.body?.status ?? "").trim() as ReservationStatus;

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  const idx = reservations.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not found." });

  reservations[idx] = { ...reservations[idx], status };
  return res.json(reservations[idx]);
});

// DELETE /api/reservations/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx === -1) return res.status(404).json({ message: "Not found." });

  reservations.splice(idx, 1);
  return res.status(204).send();
});

export default router;
