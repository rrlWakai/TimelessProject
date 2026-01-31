import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "./Section";

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AmenitiesReviews() {
  const reduce = useReducedMotion();

  const [spaLoaded, setSpaLoaded] = useState(false);
  const [spaError, setSpaError] = useState(false);

  const card = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.9, ease: easeLuxury },
    },
  };

  const stagger = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.12, delayChildren: 0.04 },
    },
  };

  return (
    <Section
      id="amenities"
      title="Amenities & Comfort"
      subtitle="Indulge in curated experiences designed for relaxation, wellness, and refined living."
    >
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22, margin: "0px 0px -12% 0px" }}
      >
        {/* LEFT: Spa card */}
        <motion.div
          variants={card}
          className="group relative rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)]"
        >
          {/* Placeholder base (always visible) */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0b1220,#151c2e)]" />

          {/* Gold shimmer placeholder (only while loading and no error) */}
          {!reduce && !spaLoaded && !spaError && (
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 opacity-60"
              style={{
                background:
                  "linear-gradient(110deg, transparent 0%, rgba(197,168,108,0.28) 48%, transparent 100%)",
              }}
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Subtle gold sheen on hover */}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              className="
                pointer-events-none absolute -inset-10
                bg-[radial-gradient(closest-side,rgba(197,168,108,0.22),rgba(197,168,108,0))]
                blur-2xl
              "
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: easeLuxury }}
            />
          )}

          {/* Spa image (blur-up reveal). Hide if error */}
          {!spaError && (
            <motion.img
              src="/images/spa.jpg"
              alt="Signature spa and wellness retreat"
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={() => setSpaLoaded(true)}
              onError={() => setSpaError(true)}
              initial={false}
              animate={
                reduce
                  ? { opacity: 1 }
                  : spaLoaded
                    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                    : { opacity: 0, scale: 1.02, filter: "blur(12px)" }
              }
              transition={{ duration: 1.15, ease: easeLuxury }}
              whileHover={reduce ? {} : { scale: 1.04 }}
            />
          )}

          {/* Fallback label if image missing */}
          {spaError && (
            <div className="absolute inset-0 flex items-end p-6 sm:p-8">
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-4 py-3 text-white/85 text-sm">
                Add{" "}
                <span className="text-[rgb(var(--gold))]">/images/spa.jpg</span>{" "}
                to show the spa photo.
              </div>
            </div>
          )}

          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.68))]" />

          {/* Content */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
            <motion.h3
              className="font-[var(--font-serif)] text-2xl sm:text-3xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: easeLuxury, delay: 0.05 }}
            >
              Signature Spa & Wellness Retreat
            </motion.h3>

            <motion.p
              className="mt-2 text-white/80 max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: easeLuxury, delay: 0.12 }}
            >
              Restore balance with bespoke treatments, serene spaces, and
              world-class therapists.
            </motion.p>

            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: easeLuxury, delay: 0.18 }}
            >
              <a
                href="#spa"
                className="
                  inline-flex items-center rounded-full border border-white/30
                  px-5 py-2 text-sm hover:bg-white/10 transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/60
                  focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                "
              >
                Discover More
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT: Reviews card */}
        <motion.div
          variants={card}
          className="rounded-[var(--radius-card)] bg-white p-6 sm:p-8 shadow-[var(--shadow-card)] border border-black/5 flex flex-col"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl font-semibold">4.8</div>
            <div className="text-sm text-[rgb(var(--muted))]">
              Based on 2,341 verified guests
            </div>
          </div>

          <div className="mt-2 text-[rgb(var(--gold))] text-lg">★★★★★</div>

          <div className="mt-6 space-y-4 flex-1">
            <p className="text-[rgb(var(--muted))] italic">
              “An unforgettable stay. Every detail felt intentional, calm, and
              refined.”
            </p>
            <p className="text-[rgb(var(--muted))] italic">
              “The service, the rooms, the spa — everything exceeded our
              expectations.”
            </p>
          </div>

          <div className="pt-4 border-t border-black/10">
            <a
              href="#reviews"
              className="inline-flex items-center gap-2 text-sm font-medium text-[rgb(var(--gold))] hover:underline"
            >
              Read all reviews <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
