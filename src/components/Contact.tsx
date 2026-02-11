import { Container } from "./Container";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createReservation } from "../admin/lib/mockApi";

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
};

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
}: FieldProps) {
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
        className="contact-field"
      />
    </motion.label>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  // Allows "+", spaces, dashes; requires 7–15 digits total
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;
  return /^\+?[0-9\s-]+$/.test(phone);
}

function parseDate(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// Simple formatter: keeps optional leading "+" then groups digits as 3-3-4-...
// (Not country-perfect, but clean and consistent.)
function formatPhoneInput(raw: string) {
  const hasPlus = raw.trim().startsWith("+");
  const digits = raw.replace(/\D/g, "");

  // Build grouped display: 3-3-4-... (rest)
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
              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-red-400 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-800"
              >
                Cancel
              </button>
              <a
                href="#top"
                onClick={onClose}
                className="w-full text-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black/80 shadow-sm hover:bg-black/[0.03]"
              >
                Confirmed
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

  // Controlled phone value so we can format as they type (UI stays same)
  const [phone, setPhone] = useState("");

  const errorText = useMemo(() => {
    return state.kind === "error" ? state.message : null;
  }, [state]);

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
                const fd = new FormData(form);

                const fullName = String(fd.get("name") ?? "").trim();
                const email = String(fd.get("email") ?? "").trim();
                const checkIn = String(fd.get("checkin") ?? "");
                const checkOut = String(fd.get("checkout") ?? "");
                const guestsRaw = String(fd.get("guests") ?? "1");
                const roomPreference = String(fd.get("room") ?? "").trim();
                const message = String(fd.get("message") ?? "").trim();

                const guests = Math.max(1, Number(guestsRaw || 1));
                const phoneValue = phone.trim();

                // Validation
                if (!fullName) {
                  setState({
                    kind: "error",
                    message: "Please enter your full name.",
                  });
                  return;
                }
                if (!email || !isValidEmail(email)) {
                  setState({
                    kind: "error",
                    message: "Please enter a valid email address.",
                  });
                  return;
                }
                if (!phoneValue || !isValidPhone(phoneValue)) {
                  setState({
                    kind: "error",
                    message: "Please enter a valid contact number.",
                  });
                  return;
                }
                const inD = parseDate(checkIn);
                const outD = parseDate(checkOut);
                if (!inD || !outD) {
                  setState({
                    kind: "error",
                    message:
                      "Please select valid check-in and check-out dates.",
                  });
                  return;
                }
                if (outD.getTime() <= inD.getTime()) {
                  setState({
                    kind: "error",
                    message: "Check-out must be after check-in.",
                  });
                  return;
                }
                if (!Number.isFinite(guests) || guests < 1) {
                  setState({
                    kind: "error",
                    message: "Guests must be at least 1.",
                  });
                  return;
                }

                setState({ kind: "sending" });

                try {
                  await createReservation({
                    fullName,
                    email,
                    phone: phoneValue,
                    checkIn,
                    checkOut,
                    guests,
                    roomPreference: roomPreference || undefined,
                    message: message || undefined,
                  });

                  form.reset();
                  setPhone("");
                  setState({ kind: "idle" });
                  setSuccessOpen(true);
                } catch {
                  setState({
                    kind: "error",
                    message: "Something went wrong. Please try again.",
                  });
                }
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                />

                {/* Contact Number (formatted as you type) */}
                <Field
                  label="Contact Number"
                  name="phone"
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  autoComplete="tel"
                  required
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                />

                <Field
                  label="Check-in"
                  name="checkin"
                  type="date"
                  autoComplete="off"
                  required
                />
                <Field
                  label="Check-out"
                  name="checkout"
                  type="date"
                  autoComplete="off"
                  required
                />
                <Field
                  label="Guests"
                  name="guests"
                  type="number"
                  placeholder="2"
                  autoComplete="off"
                  min="1"
                  required
                />
                <Field
                  label="Room Preference"
                  name="room"
                  placeholder="Suite, Ocean View..."
                  autoComplete="off"
                />
              </div>

              {/* message */}
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

              {/* Inline error */}
              {errorText && (
                <motion.div
                  variants={fadeUp}
                  className="mt-3 text-sm text-rose-700"
                  role="alert"
                  aria-live="polite"
                >
                  {errorText}
                </motion.div>
              )}
            </motion.form>
          </motion.div>
        </div>
      </Container>

      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </section>
  );
}
