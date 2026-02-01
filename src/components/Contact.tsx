import { Container } from "./Container";
import { motion } from "framer-motion";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    opacity: 1, // Add a dummy animatable property
  },
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <motion.label variants={fadeUp} className="grid gap-2">
      <span className="text-sm text-black/70">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="contact-field"
      />
    </motion.label>
  );
}

export function Contact() {
  return (
    <section className="relative overflow-hidden" id="contact">
      {/* background wash */}
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
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                staggerChildren: 0.08,
                delayChildren: 0.1,
              }}
              className="
                rounded-[var(--radius-card)]
                bg-white/70
                border border-black/10
                shadow-[var(--shadow-card)]
                backdrop-blur
                p-5 sm:p-7
              "
              onSubmit={(e) => e.preventDefault()}
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
                >
                  Request Reservation
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
