// src/components/Contact.tsx
import type React from "react";
import { Container } from "./Container";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  min?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: string | null;
  hint?: string;
};

type Errors = Partial<
  Record<
    "name" | "email" | "phone" | "checkin" | "checkout" | "guests" | "room",
    string
  >
>;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  min,
  required,
  inputMode,
  value,
  onChange,
  onBlur,
  error,
  hint,
}: FieldProps) {
  const hasError = !!error;

  return (
    <motion.label variants={fadeUp} className="grid gap-2">
      <span className="text-sm text-black/70">
        {label} {required ? <span className="text-rose-700">*</span> : null}
      </span>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        required={required}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? `${name}-error` : hint ? `${name}-hint` : undefined
        }
        className={[
          "contact-field",
          hasError ? "border-rose-300 ring-2 ring-rose-200/60" : "",
        ].join(" ")}
      />

      {hasError ? (
        <div
          id={`${name}-error`}
          className="text-xs text-rose-700"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      ) : hint ? (
        <div id={`${name}-hint`} className="text-xs text-black/45">
          {hint}
        </div>
      ) : null}
    </motion.label>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(raw: string) {
  return raw.replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone: string) {
  const cleaned = normalizePhone(phone);
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return false;
  return /^\+?\d[\d\s-]*$/.test(cleaned);
}

function parseDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// function extractGuestsFromMeta(meta?: string) {
//   if (!meta) return null;
//   const m = meta.match(/(\d+)\s*Guests?/i);
//   if (!m) return null;
//   const n = Number(m[1]);
//   return Number.isFinite(n) && n > 0 ? n : null;
// }

function formatPhoneInput(raw: string) {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  const parts: string[] = [];
  let i = 0;

  if (digits.length > 0) {
    parts.push(digits.slice(i, i + 3));
    i += 3;
  }
  if (digits.length > 3) {
    parts.push(digits.slice(i, i + 3));
    i += 3;
  }
  if (digits.length > 6) {
    parts.push(digits.slice(i, i + 4));
    i += 4;
  }
  if (digits.length > 10) {
    parts.push(digits.slice(i));
  }

  const joined = parts.filter(Boolean).join(" ");
  return hasPlus ? `+${joined}` : joined;
}

async function createReservationApi(input: {
  fullName: string;
  email: string;
  phone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomPreference?: string;
  message?: string;
}) {
  const res = await fetch("http://localhost:4000/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(
      data?.message || `Failed to create reservation (${res.status}).`,
    );
  }

  return res.json();
}

function SuccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={[
            "w-full max-w-md rounded-3xl border border-black/10 bg-white shadow-2xl",
            "transition-all duration-300",
            open ? "opacity-100 scale-100" : "opacity-0 scale-95",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 sm:p-7">
            <div className="text-xs tracking-[0.25em] text-[rgb(var(--gold))] uppercase">
              Reservation Sent
            </div>

            <h3 className="mt-3 font-cinzel uppercase tracking-[0.08em] text-xl text-[rgb(var(--ink))]">
              Thank you for your request
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-black/65">
              Our staff will contact you shortly to confirm the details of your
              reservation.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="#top"
                onClick={onClose}
                className="w-full text-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black/80 shadow-sm hover:bg-black/[0.03]"
              >
                Okay
              </a>
            </div>

            <div className="mt-4 text-xs text-black/45">
              Tip: Please keep your email available for our confirmation
              message.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "sending" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  const [successOpen, setSuccessOpen] = useState(false);

  // Controlled values
  const [phone, setPhone] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [guestsValue, setGuestsValue] = useState("1");

  // ✅ render-safe flags
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof Errors, boolean>>
  >({});

  const lastCheckInRef = useRef<string>("");

  const errorText = useMemo(() => {
    return state.kind === "error" ? state.message : null;
  }, [state]);

  // useEffect(() => {
  //   return onRoomAction((detail) => {
  //     if (detail.type === "reserve") {
  //       setSelectedRoom(detail.room.name);

  //       const extracted = extractGuestsFromMeta(detail.room.meta);
  //       if (extracted) setGuestsValue(String(extracted));

  //       document
  //         .getElementById("contact")
  //         ?.scrollIntoView({ behavior: "smooth" });
  //     }
  //   });
  // }, []);

  function setFieldTouched(name: keyof Errors) {
    setTouched((p) => ({ ...p, [name]: true }));
  }

  function shouldShowError(key: keyof Errors) {
    return !!errors[key] && (submittedOnce || !!touched[key]);
  }

  function validateFromValues(values: {
    name: string;
    email: string;
    phone: string;
    checkin: string;
    checkout: string;
    guests: string;
    room: string;
  }) {
    const next: Errors = {};

    const fullName = values.name.trim();
    const email = values.email.trim();
    const phoneValue = values.phone.trim();
    const checkIn = values.checkin;
    const checkOut = values.checkout;
    const roomPreference = values.room.trim();

    const guestsNum = Number(values.guests || "1");

    if (!fullName) next.name = "Full name is required.";
    else if (fullName.length < 2) next.name = "Please enter your full name.";

    if (!email) next.email = "Email is required.";
    else if (!isValidEmail(email))
      next.email = "Please enter a valid email (e.g. name@email.com).";

    if (!phoneValue) next.phone = "Contact number is required.";
    else if (!isValidPhone(phoneValue))
      next.phone = "Enter a valid phone number (10–15 digits).";

    const inD = parseDate(checkIn);
    const outD = parseDate(checkOut);

    if (!checkIn) next.checkin = "Check-in date is required.";
    else if (!inD) next.checkin = "Invalid check-in date.";

    if (!checkOut) next.checkout = "Check-out date is required.";
    else if (!outD) next.checkout = "Invalid check-out date.";

    if (inD && outD) {
      if (startOfDay(outD).getTime() <= startOfDay(inD).getTime()) {
        next.checkout = "Check-out must be after check-in.";
      }
    }

    if (!Number.isFinite(guestsNum) || guestsNum < 1)
      next.guests = "Guests must be at least 1.";
    else if (guestsNum > 20) next.guests = "Please enter 20 guests or fewer.";

    if (roomPreference && roomPreference.length > 60)
      next.room = "Room preference is too long.";

    return next;
  }

  function validateAll(form: HTMLFormElement) {
    const fd = new FormData(form);

    return validateFromValues({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone,
      checkin: String(fd.get("checkin") ?? ""),
      checkout: String(fd.get("checkout") ?? ""),
      guests: guestsValue,
      room: String(fd.get("room") ?? ""),
    });
  }

  function focusFirstInvalid(next: Errors, form: HTMLFormElement) {
    const order: Array<keyof Errors> = [
      "name",
      "email",
      "phone",
      "checkin",
      "checkout",
      "guests",
      "room",
    ];
    const first = order.find((k) => next[k]);
    if (!first) return;

    const el = form.querySelector<HTMLInputElement>(`[name="${first}"]`);
    el?.focus();
  }

  return (
    <section className="relative overflow-hidden" id="contact">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] contact-wash"
        aria-hidden="true"
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* LEFT */}
          <motion.div
            className="lg:col-span-5"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 text-[rgb(var(--gold))] text-[11px] tracking-[0.35em] uppercase">
              <span className="h-px w-10 bg-[rgb(var(--gold))]/60" />
              CONTACT
              <span className="h-px w-10 bg-[rgb(var(--gold))]/60" />
            </div>

            <h2 className="mt-6 font-cinzel uppercase tracking-[0.10em] leading-[1.05] text-3xl sm:text-4xl text-[rgb(var(--ink))]">
              Reserve your stay
            </h2>

            <p className="mt-4 text-[15px] leading-relaxed text-black/65 max-w-prose">
              For reservations, private events, or special requests, our team is
              available to assist you with discreet, five-star service.
            </p>

            <div className="mt-8 grid gap-5 text-[15px] text-black/70">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-black/45">
                  Phone
                </div>
                <a
                  href="tel:+10000000000"
                  className="mt-1 inline-block hover:text-black transition"
                >
                  +1 (000) 000-0000
                </a>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-black/45">
                  Email
                </div>
                <a
                  href="mailto:concierge@timeless.com"
                  className="mt-1 inline-block hover:text-black transition"
                >
                  concierge@timeless.com
                </a>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-black/45">
                  Address
                </div>
                <div className="mt-1">
                  100 Oceanfront Avenue, Los Angeles, CA
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.div
            className="lg:col-span-7"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.form
              variants={{ hidden: {}, show: { opacity: 1 } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
              className="
                rounded-(--radius-card)
                bg-white/70
                border border-black/10
                shadow-(--shadow-card)
                backdrop-blur
                p-5 sm:p-7
              "
              onSubmit={async (e) => {
                e.preventDefault();
                if (state.kind === "sending") return;

                const form = e.currentTarget;

                setState({ kind: "idle" });
                setSubmittedOnce(true);

                // Mark all touched after submit
                setTouched({
                  name: true,
                  email: true,
                  phone: true,
                  checkin: true,
                  checkout: true,
                  guests: true,
                  room: true,
                });

                const next = validateAll(form);
                setErrors(next);

                if (Object.keys(next).length > 0) {
                  focusFirstInvalid(next, form);
                  return;
                }

                const fd = new FormData(form);

                const fullName = String(fd.get("name") ?? "").trim();
                const email = String(fd.get("email") ?? "").trim();
                const checkIn = String(fd.get("checkin") ?? "");
                const checkOut = String(fd.get("checkout") ?? "");
                const roomPreference = String(fd.get("room") ?? "").trim();
                const message = String(fd.get("message") ?? "").trim();

                const guestsNum = Math.max(1, Number(guestsValue || "1"));
                const phoneValue = phone.trim();

                setState({ kind: "sending" });

                try {
                  await createReservationApi({
                    fullName,
                    email,
                    phone: phoneValue,
                    checkIn,
                    checkOut,
                    guests: guestsNum,
                    roomPreference: roomPreference || undefined,
                    message: message || undefined,
                  });

                  form.reset();
                  setPhone("");
                  setSelectedRoom("");
                  setGuestsValue("1");
                  setErrors({});
                  setTouched({});
                  setSubmittedOnce(false);

                  setState({ kind: "idle" });
                  setSuccessOpen(true);
                } catch (err) {
                  const msg =
                    err instanceof Error
                      ? err.message
                      : "Something went wrong. Please try again.";
                  setState({ kind: "error", message: msg });
                }
              }}
            >
              {errorText ? (
                <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {errorText}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  onBlur={() => setFieldTouched("name")}
                  error={shouldShowError("name") ? (errors.name ?? null) : null}
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                  onBlur={() => setFieldTouched("email")}
                  hint="We’ll send the confirmation here."
                  error={
                    shouldShowError("email") ? (errors.email ?? null) : null
                  }
                />

                <Field
                  label="Contact Number"
                  name="phone"
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  autoComplete="tel"
                  required
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    const nextPhone = formatPhoneInput(e.target.value);
                    setPhone(nextPhone);

                    // revalidate if touched/submitted
                    if (submittedOnce || touched.phone) {
                      setErrors((p) => ({
                        ...p,
                        phone: !nextPhone.trim()
                          ? "Contact number is required."
                          : isValidPhone(nextPhone)
                            ? undefined
                            : "Enter a valid phone number (10–15 digits).",
                      }));
                    }
                  }}
                  onBlur={() => setFieldTouched("phone")}
                  error={
                    shouldShowError("phone") ? (errors.phone ?? null) : null
                  }
                />

                <Field
                  label="Check-in"
                  name="checkin"
                  type="date"
                  autoComplete="off"
                  required
                  onBlur={() => setFieldTouched("checkin")}
                  onChange={(e) => {
                    const nextIn = e.target.value;

                    // if user changes check-in, clear checkout error until revalidated
                    if (nextIn !== lastCheckInRef.current) {
                      lastCheckInRef.current = nextIn;
                      if (
                        submittedOnce ||
                        touched.checkin ||
                        touched.checkout
                      ) {
                        // minimal revalidate for dates
                        setErrors((p) => {
                          const next = { ...p };
                          next.checkin = undefined;
                          next.checkout = undefined;
                          return next;
                        });
                      }
                    }
                  }}
                  error={
                    shouldShowError("checkin") ? (errors.checkin ?? null) : null
                  }
                />

                <Field
                  label="Check-out"
                  name="checkout"
                  type="date"
                  autoComplete="off"
                  required
                  onBlur={() => setFieldTouched("checkout")}
                  error={
                    shouldShowError("checkout")
                      ? (errors.checkout ?? null)
                      : null
                  }
                />

                <Field
                  label="Guests"
                  name="guests"
                  type="number"
                  placeholder="2"
                  autoComplete="off"
                  min="1"
                  required
                  value={guestsValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGuestsValue(v);

                    if (submittedOnce || touched.guests) {
                      const n = Number(v || "1");
                      setErrors((p) => ({
                        ...p,
                        guests:
                          !Number.isFinite(n) || n < 1
                            ? "Guests must be at least 1."
                            : n > 20
                              ? "Please enter 20 guests or fewer."
                              : undefined,
                      }));
                    }
                  }}
                  onBlur={() => setFieldTouched("guests")}
                  error={
                    shouldShowError("guests") ? (errors.guests ?? null) : null
                  }
                />

                <Field
                  label="Room Preference"
                  name="room"
                  placeholder="Suite, Ocean View..."
                  autoComplete="off"
                  value={selectedRoom}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedRoom(v);

                    if (submittedOnce || touched.room) {
                      setErrors((p) => ({
                        ...p,
                        room:
                          v.trim().length > 60
                            ? "Room preference is too long."
                            : undefined,
                      }));
                    }
                  }}
                  onBlur={() => setFieldTouched("room")}
                  hint="Optional"
                  error={shouldShowError("room") ? (errors.room ?? null) : null}
                />
              </div>

              <motion.label variants={fadeUp} className="grid gap-2 mt-4">
                <span className="text-sm text-black/70">Message</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Anything we should prepare for your stay?"
                  autoComplete="off"
                  className="contact-textarea"
                />
              </motion.label>

              <motion.div
                variants={fadeUp}
                className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
              >
                <p className="text-sm text-black/55">
                  By submitting, you agree to be contacted regarding your
                  reservation.
                </p>

                <motion.button
                  type="submit"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="contact-submit"
                  disabled={state.kind === "sending"}
                >
                  {state.kind === "sending" ? "Sending..." : "Reserve"}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </Container>

      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </section>
  );
}
