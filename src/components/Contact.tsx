import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "./Container";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <motion.label
      className="grid gap-2"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <span className="text-sm text-black/70">{label}</span>

      {/* shimmer wrapper */}
      <span className="shimmer-focus block rounded-xl">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="
            h-12 w-full rounded-xl
            bg-white/70
            border border-black/10
            px-4 text-[15px] text-[rgb(var(--ink))]
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
  );
}

type SubmitState = "idle" | "loading" | "success";

export function Contact() {
  const [status, setStatus] = useState<SubmitState>("idle");

  const easing = useMemo<[number, number, number, number]>(
    () => [0.16, 1, 0.3, 1],
    [],
  );

  const sectionVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: easing },
    },
  };

  const rightCardVariants = {
    hidden: { opacity: 0, y: 22, scale: 0.985 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.0, ease: easing },
    },
  };

  const staggerWrap = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.08,
      },
    },
  };

  const onSubmit = () => {
    if (status !== "idle") return;

    setStatus("loading");

    // Simulated submit: replace later with real API call
    window.setTimeout(() => {
      setStatus("success");
      window.setTimeout(() => setStatus("idle"), 1800);
    }, 900);
  };

  return (
    <div className="relative overflow-hidden">
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
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
                <Field
                  label="Check-in"
                  name="checkin"
                  type="date"
                  autoComplete="off"
                />
                <Field
                  label="Check-out"
                  name="checkout"
                  type="date"
                  autoComplete="off"
                />
                <Field
                  label="Guests"
                  name="guests"
                  type="number"
                  placeholder="2"
                  autoComplete="off"
                />
                <Field
                  label="Room Preference"
                  name="room"
                  placeholder="Suite, Ocean View..."
                  autoComplete="off"
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
                  disabled={status === "loading"}
                  whileHover={
                    status === "idle"
                      ? {
                          y: -1,
                          boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
                        }
                      : undefined
                  }
                  whileTap={status === "idle" ? { scale: 0.985 } : undefined}
                  animate={
                    status === "success"
                      ? {
                          boxShadow: "0 0 0 rgba(0,0,0,0.0)",
                        }
                      : undefined
                  }
                  transition={{ duration: 0.45, ease: easing }}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-full
                    bg-[rgb(var(--gold))]
                    px-8 py-3
                    text-sm font-semibold
                    text-[#0b1220]
                    shadow-[0_16px_40px_rgba(0,0,0,0.16)]
                    hover:opacity-95
                    transition
                    disabled:opacity-70
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/60
                    focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]
                  "
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
    </div>
  );
}
