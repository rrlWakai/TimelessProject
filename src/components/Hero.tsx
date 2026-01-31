import { motion, useReducedMotion } from "framer-motion";
import { Container } from "./Container";
import { Navbar } from "./Navbar";
import { FeatureStrip } from "./FeatureStrip";
import heroImage from "../images/hero.png";

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Hero() {
  const reduce = useReducedMotion();

  const wrap = {
    hidden: {},
    show: {
      transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.18 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.9, ease: easeLuxury },
    },
  };

  return (
    <section className="relative min-h-[92svh] text-white overflow-hidden">
      <Navbar />

      {/* Background */}
      <div
        className="absolute inset-0 bg-[#0b1220]"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          animation: reduce ? undefined : "slowZoom 14s ease-out forwards",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      {/* Overlays */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, rgba(11,18,32,0.55), rgba(11,18,32,0.20), rgba(11,18,32,0.82))",
        }}
      />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(1100px 620px at 50% 35%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(900px 520px at 50% 80%, rgba(0,0,0,0.40), transparent 65%)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E)",
        }}
      />

      {/* Content */}
      <Container className="relative">
        <div className="pt-18 sm:pt-20 md:pt-18 lg:pt-20 pb-44 sm:pb-44 md:pb-44">
          <motion.div
            className="mx-auto max-w-5xl text-center px-1"
            variants={wrap}
            initial="hidden"
            animate="show"
          >
            {/* gold label */}
            <motion.div
              variants={item}
              className="inline-flex items-center gap-3 text-[rgb(var(--gold))] text-[10px] sm:text-[11px] tracking-[0.35em] uppercase"
            >
              <span className="h-px w-10 sm:w-12 bg-[rgb(var(--gold))]/70" />
              5-STAR HOTEL
              <span className="h-px w-10 sm:w-12 bg-[rgb(var(--gold))]/70" />
            </motion.div>

            {/* headline */}
            <motion.h1
              variants={item}
              className="
                mt-6 sm:mt-7
                font-cinzel font-regular uppercase
                text-[#f5f2ed]
                [text-shadow:0_2px_34px_rgba(0,0,0,0.45)]
                leading-[0.96] sm:leading-[0.92]
                tracking-[0.12em] sm:tracking-[0.14em] lg:tracking-[0.15em]
                [font-size:clamp(44px,7vw,112px)]
              "
            >
              EXPERIENCE
              <br />
              TIMELESS
              <br />
              LUXURY
            </motion.h1>

            {/* subtitle */}
            <motion.p
              variants={item}
              className="mt-3 sm:mt-4 mx-auto max-w-2xl text-white/78 text-[14px] sm:text-[16px] lg:text-[17px] leading-relaxed"
            >
              Where elegance meets comfort in an unforgettable sanctuary
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={item}
              className="mt-7 sm:mt-9 flex justify-center"
            >
              <motion.a
                href="#contact"
                className="
                  inline-flex items-center justify-center
                  w-full max-w-[280px] sm:w-auto
                  rounded-full bg-[rgb(var(--gold))]
                  px-10 py-4 text-sm font-semibold text-[#0b1220]
                  shadow-[0_16px_40px_rgba(0,0,0,0.28)]
                  transition
                "
                whileHover={reduce ? {} : { y: -1 }}
                whileTap={reduce ? {} : { scale: 0.99 }}
                transition={{ duration: 0.35, ease: easeLuxury }}
              >
                Reserve Your Stay
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      <FeatureStrip />
    </section>
  );
}
