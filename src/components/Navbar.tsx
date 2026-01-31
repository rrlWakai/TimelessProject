import { useEffect, useState } from "react";
import { Container } from "./Container";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // lock scroll when menu open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const chrome = scrolled
    ? "bg-[linear-gradient(180deg,rgba(10,18,34,0.78),rgba(9,16,30,0.62))] backdrop-blur border-b border-white/10"
    : "bg-transparent";

  return (
    <header
      className={`
        sticky top-0 z-50
        transition-colors duration-300
        ${chrome}
      `}
      style={{ animation: "navReveal 0.9s ease-out forwards" }}
    >
      <Container className="h-16 flex items-center">
        {/* LOGO */}
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 group"
        >
          <img
            src="/icon.png"
            alt="Timeless Resort"
            draggable={false}
            className={`
              transition-all duration-300
              select-none
              ${scrolled ? "h-7 sm:h-8 opacity-95" : "h-9 sm:h-10 opacity-100"}
            `}
          />
          <span className="font-semibold tracking-wide text-[rgb(var(--gold))]">
            Timeless Resort
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-10">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="
                relative text-sm tracking-wide text-white/80 hover:text-white
                after:absolute after:left-0 after:-bottom-1
                after:h-px after:w-0 after:bg-[rgb(var(--gold))]
                after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="ml-auto hidden md:flex">
          <a
            href="#contact"
            className="
              rounded-full px-6 py-2 text-sm font-semibold
              border border-[rgb(var(--gold))]/80
              text-white
              hover:bg-[rgb(var(--gold))]/10
              transition
            "
          >
            Reserve Now
          </a>
        </div>

        {/* Mobile Button */}
        <button
          className="
            ml-auto md:hidden rounded-full
            px-3 py-2 text-sm text-white
            border border-white/25
            hover:bg-white/10 transition
          "
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </Container>

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
          />

          <div
            className="
              absolute left-1/2 top-4 -translate-x-1/2
              w-[min(92vw,420px)]
              rounded-[var(--radius-card)]
              bg-[#0b1220]/92
              backdrop-blur-xl
              border border-white/12
              shadow-[0_22px_70px_rgba(0,0,0,0.55)]
            "
            style={{ animation: "navMenuReveal 0.45s ease-out forwards" }}
          >
            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Logo" className="h-7" />
                <span className="text-xs tracking-[0.25em] text-white/70">
                  MENU
                </span>
              </div>

              <button
                className="text-sm text-white/80 hover:text-white transition"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <nav className="p-3 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-white/85 hover:bg-white/10 transition"
                >
                  {l.label}
                </a>
              ))}

              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="
                  mt-2 rounded-full px-6 py-3 text-sm font-semibold
                  text-white border border-[rgb(var(--gold))]/80
                  hover:bg-[rgb(var(--gold))]/10
                  transition text-center
                "
              >
                Reserve Now
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
