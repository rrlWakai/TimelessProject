import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "./Container";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
};

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  value,
  error,
  onChange,
  onBlur,
}: FieldProps) {
  return (
    <motion.label
      className="grid gap-2"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <span className="text-sm text-black/70">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {/* shimmer wrapper */}
      <span
        className={`shimmer-focus block rounded-xl ${error ? "is-error" : ""}`}
      >
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`
            h-12 w-full rounded-xl
            bg-white/70
            border
            px-4 text-[15px] text-[rgb(var(--ink))]
            shadow-[0_8px_20px_rgba(0,0,0,0.06)]
            outline-none
            transition
            focus:-translate-y-[1px]
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-300/35"
                : "border-black/10 focus:border-[rgb(var(--gold))]/55 focus:ring-2 focus:ring-[rgb(var(--gold))]/20"
            }
          `}
        />
      </span>

      {error && (
        <motion.span
          id={`${name}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600"
        >
          {error}
        </motion.span>
      )}
    </motion.label>
  );
}

type SubmitState = "idle" | "loading" | "success";

type FormState = {
  name: string;
  email: string;
  checkin: string;
  checkout: string;
  guests: string;
  room: string;
  message: string;
};

export function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<SubmitState>("idle");

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    checkin: "",
    checkout: "",
    guests: "",
    room: "",
    message: "",
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    checkin: false,
    checkout: false,
    guests: false,
    room: false,
    message: false,
  });

  const easing = useMemo(() => easeLuxury, []);

  // --- Validation helpers ---
  const emailOk = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());

  const errors: Partial<Record<keyof FormState, string>> = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) e.name = "Please enter your full name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!emailOk(form.email)) e.email = "Please enter a valid email.";

    if (!form.checkin) e.checkin = "Select your check-in date.";
    if (!form.checkout) e.checkout = "Select your check-out date.";

    // Date relationship check (premium detail)
    if (form.checkin && form.checkout) {
      const inDate = new Date(form.checkin).getTime();
      const outDate = new Date(form.checkout).getTime();
      if (outDate <= inDate) e.checkout = "Check-out must be after check-in.";
    }

    if (!String(form.guests).trim()) e.guests = "Enter number of guests.";
    else {
      const n = Number(form.guests);
      if (!Number.isFinite(n) || n <= 0)
        e.guests = "Guests must be at least 1.";
    }

    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const sectionVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduce ? { duration: 0 } : { duration: 0.9, ease: easing },
    },
  };

  const rightCardVariants = {
    hidden: { opacity: 0, y: 22, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduce ? { duration: 0 } : { duration: 1.0, ease: easing },
    },
  };

  const staggerWrap = {
    hidden: {},
    show: {
      transition: reduce
        ? {}
        : {
            staggerChildren: 0.07,
            delayChildren: 0.08,
          },
    },
  };

  const markAllTouched = () => {
    setTouched((prev) => {
      const next = { ...prev };
      (Object.keys(next) as Array<keyof FormState>).forEach(
        (k) => (next[k] = true),
      );
      return next;
    });
  };

  const onSubmit = () => {
    if (status !== "idle") return;

    // If invalid → show errors + stop
    if (!isValid) {
      markAllTouched();
      return;
    }

    setStatus("loading");

    // Simulated submit: replace later with real API call
    window.setTimeout(() => {
      setStatus("success");
      window.setTimeout(() => setStatus("idle"), 1800);
    }, 900);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden scroll-mt-24"
      aria-label="Contact"
    >
      {/* soft background wash */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(900px 400px at 20% 20%, rgba(197,167,110,0.22), transparent 60%), radial-gradient(700px 380px at 80% 30%, rgba(0,0,0,0.05), transparent 60%)",
        }}
      />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-start">
          {/* Left */}
          <motion.div
            className="lg:col-span-5"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
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

          {/* Right: Form card */}
          <motion.div
            className="lg:col-span-7"
            variants={rightCardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.28 }}
          >
            <motion.form
              className="
                rounded-[var(--radius-card)]
                bg-white/70
                border border-black/10
                shadow-[var(--shadow-card)]
                backdrop-blur
                p-5 sm:p-7
              "
              variants={staggerWrap}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                  error={touched.name ? errors.name : undefined}
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  error={touched.email ? errors.email : undefined}
                />

                <Field
                  label="Check-in"
                  name="checkin"
                  type="date"
                  autoComplete="off"
                  required
                  value={form.checkin}
                  onChange={(v) => setForm((p) => ({ ...p, checkin: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, checkin: true }))}
                  error={touched.checkin ? errors.checkin : undefined}
                />

                <Field
                  label="Check-out"
                  name="checkout"
                  type="date"
                  autoComplete="off"
                  required
                  value={form.checkout}
                  onChange={(v) => setForm((p) => ({ ...p, checkout: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, checkout: true }))}
                  error={touched.checkout ? errors.checkout : undefined}
                />

                <Field
                  label="Guests"
                  name="guests"
                  type="number"
                  placeholder="2"
                  autoComplete="off"
                  required
                  value={form.guests}
                  onChange={(v) => setForm((p) => ({ ...p, guests: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, guests: true }))}
                  error={touched.guests ? errors.guests : undefined}
                />

                <Field
                  label="Room Preference"
                  name="room"
                  placeholder="Suite, Ocean View..."
                  autoComplete="off"
                  value={form.room}
                  onChange={(v) => setForm((p) => ({ ...p, room: v }))}
                  onBlur={() => setTouched((p) => ({ ...p, room: true }))}
                  error={undefined}
                />
              </div>

              {/* Message */}
              <motion.label
                className="grid gap-2 mt-4"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <span className="text-sm text-black/70">Message</span>

                <span className="shimmer-focus block rounded-xl">
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Anything we should prepare for your stay?"
                    value={form.message}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, message: e.target.value }))
                    }
                    className="
                      w-full rounded-xl
                      bg-white/70
                      border border-black/10
                      px-4 py-3 text-[15px] text-[rgb(var(--ink))]
                      shadow-[0_8px_20px_rgba(0,0,0,0.06)]
                      outline-none
                      transition
                      focus:border-[rgb(var(--gold))]/55
                      focus:ring-2 focus:ring-[rgb(var(--gold))]/20
                      focus:-translate-y-[1px]
                    "
                  />
                </span>
              </motion.label>

              <motion.div
                className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <p className="text-sm text-black/55">
                  By submitting, you agree to be contacted regarding your
                  reservation.
                </p>

                <motion.button
                  type="submit"
                  disabled={!isValid || status === "loading"}
                  whileHover={
                    !reduce && status === "idle" && isValid
                      ? { y: -1, boxShadow: "0 18px 45px rgba(0,0,0,0.18)" }
                      : undefined
                  }
                  whileTap={
                    !reduce && status === "idle" && isValid
                      ? { scale: 0.985 }
                      : undefined
                  }
                  animate={
                    !reduce && status === "success"
                      ? {
                          scale: [1, 1.01, 1],
                          boxShadow: [
                            "0 16px 40px rgba(0,0,0,0.16)",
                            "0 22px 70px rgba(197,168,108,0.35)",
                            "0 16px 40px rgba(0,0,0,0.16)",
                          ],
                        }
                      : undefined
                  }
                  transition={{ duration: 0.45, ease: easing }}
                  className={`
                    inline-flex items-center justify-center gap-2
                    rounded-full
                    px-8 py-3
                    text-sm font-semibold
                    shadow-[0_16px_40px_rgba(0,0,0,0.16)]
                    transition
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/60
                    focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]
                    ${
                      !isValid
                        ? "bg-black/15 text-black/40 cursor-not-allowed"
                        : "bg-[rgb(var(--gold))] text-[#0b1220] hover:opacity-95"
                    }
                    ${status === "loading" ? "opacity-80" : ""}
                  `}
                >
                  {status === "loading" && (
                    <span
                      className="h-4 w-4 rounded-full border-2 border-black/25 border-t-black/70 animate-spin"
                      aria-hidden="true"
                    />
                  )}

                  {status === "success" ? (
                    <>
                      Request Sent
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.35, ease: easing }}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/10"
                        aria-hidden="true"
                      >
                        ✓
                      </motion.span>
                    </>
                  ) : status === "loading" ? (
                    "Sending..."
                  ) : (
                    "Request Reservation"
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </Container>

      {/* Focus shimmer CSS (local) */}
      <style>{`
        .shimmer-focus { position: relative; }
        .shimmer-focus::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 12px;
          opacity: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg,
              rgba(197,168,108,0) 0%,
              rgba(197,168,108,0.35) 25%,
              rgba(197,168,108,0.0) 50%,
              rgba(197,168,108,0.35) 75%,
              rgba(197,168,108,0) 100%);
          filter: blur(6px);
          transform: translateX(-30%);
          transition: opacity .25s ease;
        }
        .shimmer-focus:focus-within::before {
          opacity: 1;
          animation: shimmerMove 1.15s ${reduce ? "linear" : "cubic-bezier(.16,1,.3,1)"} infinite;
        }
        /* Error: subtle red glow instead of gold shimmer */
        .shimmer-focus.is-error::before {
          background: linear-gradient(90deg,
              rgba(239,68,68,0) 0%,
              rgba(239,68,68,0.25) 25%,
              rgba(239,68,68,0.0) 50%,
              rgba(239,68,68,0.25) 75%,
              rgba(239,68,68,0) 100%);
        }
        @keyframes shimmerMove {
          from { transform: translateX(-35%); }
          to { transform: translateX(35%); }
        }
      `}</style>
    </section>
  );
}
