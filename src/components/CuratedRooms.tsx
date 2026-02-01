import { useEffect, useMemo, useRef, useState } from "react";
import { Section } from "./Section";
import { RoomCard } from "./RoomCard";

type Room = {
  id: string;
  type: string;
  name: string;
  image: string;
  price: number;
  badge?: string;
  meta: string;
};

const ROOMS: Room[] = [
  {
    id: "1",
    type: "Premium Suite",
    name: "Deluxe Ocean Suite",
    image: "/images/room1.jpg",
    price: 450,
    meta: "King Bed · 2 Guests · Ocean View",
  },
  {
    id: "2",
    type: "Executive Suite",
    name: "Presidential Suite",
    image: "/images/room2.jpg",
    price: 850,
    badge: "MOST POPULAR",
    meta: "King Bed · 4 Guests · Panoramic View",
  },
  {
    id: "3",
    type: "Signature Suite",
    name: "Garden Villa Suite",
    image: "/images/room3.jpg",
    price: 550,
    meta: "King Bed · 3 Guests · Garden View",
  },
  {
    id: "4",
    type: "Luxury Suite",
    name: "Hillside Retreat Suite",
    image: "/images/room4.jpg",
    price: 600,
    meta: "Queen Bed · 2 Guests · Hillside View",
  },
  {
    id: "5",
    type: "Classic Suite",
    name: "Cityscape Suite",
    image: "/images/room5.jpg",
    price: 400,
    meta: "Queen Bed · 2 Guests · City View",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px", ...(opts ?? {}) },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [opts]);

  return { ref, inView };
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={
          dir === "left" ? "M14.5 5.5L8 12l6.5 6.5" : "M9.5 5.5L16 12l-6.5 6.5"
        }
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CuratedRooms() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const hasMultiple = useMemo(() => ROOMS.length > 1, []);

  const { ref: wrapRef, inView } = useInView<HTMLDivElement>();

  const updateControls = () => {
    const el = trackRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;

    const tol = 2;
    setCanLeft(current > tol);
    setCanRight(current < maxScrollLeft - tol);
  };

  useEffect(() => {
    updateControls();

    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => updateControls();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateControls());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const scrollByPage = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;

    const amount = el.clientWidth;
    const next =
      dir === "left" ? el.scrollLeft - amount : el.scrollLeft + amount;

    el.scrollTo({
      left: clamp(next, 0, el.scrollWidth),
      behavior: "smooth",
    });
  };

  return (
    <Section
      id="rooms"
      title="Curated Rooms"
      subtitle="Each suite is thoughtfully designed to balance privacy, comfort, and refined elegance."
      // NOTE: Section component already renders the heading;
      // we’ll add a luxury “gold sheen” + animations here around the carousel content.
    >
      <div ref={wrapRef} className="relative">
        {/* Gold sheen accent behind header area (subtle luxury) */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute -top-10 left-1/2 -translate-x-1/2",
            "h-24 w-[min(760px,92vw)]",
            "bg-[radial-gradient(closest-side,rgba(197,168,108,0.18),rgba(197,168,108,0))]",
            "blur-2xl",
            "transition-opacity duration-700",
            inView ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Controls */}
        {hasMultiple && (
          <button
            type="button"
            aria-label="Previous rooms"
            onClick={() => scrollByPage("left")}
            disabled={!canLeft}
            className={[
              "hidden lg:flex absolute left-[-18px] top-1/2 -translate-y-1/2 z-20",
              "h-12 w-12 items-center justify-center rounded-full",
              "bg-white/85 backdrop-blur border border-black/10",
              "shadow-[0_14px_34px_rgba(0,0,0,0.12)]",
              "text-black/70",
              "transition",
              "hover:scale-[1.04] hover:bg-white hover:text-black",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
              // gold highlight ring on hover (luxury touch)
              "hover:shadow-[0_18px_46px_rgba(0,0,0,0.16)]",
              !canLeft ? "opacity-40 cursor-not-allowed hover:scale-100" : "",
              // gentle entrance
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
              "duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
            ].join(" ")}
          >
            <span className="sr-only">Previous</span>
            <span className="grid place-items-center text-[rgb(var(--gold))]">
              <ChevronIcon dir="left" />
            </span>
          </button>
        )}

        {hasMultiple && (
          <button
            type="button"
            aria-label="Next rooms"
            onClick={() => scrollByPage("right")}
            disabled={!canRight}
            className={[
              "hidden lg:flex absolute right-[-18px] top-1/2 -translate-y-1/2 z-20",
              "h-12 w-12 items-center justify-center rounded-full",
              "bg-white/85 backdrop-blur border border-black/10",
              "shadow-[0_14px_34px_rgba(0,0,0,0.12)]",
              "text-black/70",
              "transition",
              "hover:scale-[1.04] hover:bg-white hover:text-black",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]",
              "hover:shadow-[0_18px_46px_rgba(0,0,0,0.16)]",
              !canRight ? "opacity-40 cursor-not-allowed hover:scale-100" : "",
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
              "duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
            ].join(" ")}
          >
            <span className="sr-only">Next</span>
            <span className="grid place-items-center text-[rgb(var(--gold))]">
              <ChevronIcon dir="right" />
            </span>
          </button>
        )}

        {/* Track */}
        <div
          ref={trackRef}
          className={[
            "relative z-10",
            "flex gap-6 lg:gap-8",
            "overflow-x-auto scroll-smooth snap-x snap-mandatory",
            "pb-2",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            // reveal animation
            "transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
          ].join(" ")}
        >
          {ROOMS.map((room, idx) => (
            <div
              key={room.id}
              className={[
                "snap-start shrink-0",
                "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-21.333px)]",
                // stagger feel (no JS timers needed)
                "transition-[transform,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)]",
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4",
              ].join(" ")}
              style={{ transitionDelay: `${80 + idx * 90}ms` }}
            >
              {/* Gold accent border glow wrapper */}
              <div className="group relative">
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute -inset-0.5 rounded-[var(--radius-card)]
                    bg-[radial-gradient(closest-side,rgba(197,168,108,0.20),rgba(197,168,108,0))]
                    opacity-0 blur
                    transition-opacity duration-500
                    group-hover:opacity-100
                  "
                />
                <RoomCard room={room} />
              </div>
            </div>
          ))}
        </div>

        {/* Soft edge fades */}
        <div
          className="
            pointer-events-none
            absolute inset-y-0 left-0 w-10
            bg-[linear-gradient(to_right,rgb(var(--bg)),rgba(250,248,244,0))]
            hidden sm:block
          "
          aria-hidden="true"
        />
        <div
          className="
            pointer-events-none
            absolute inset-y-0 right-0 w-10
            bg-[linear-gradient(to_left,rgb(var(--bg)),rgba(250,248,244,0))]
            hidden sm:block
          "
          aria-hidden="true"
        />
      </div>
    </Section>
  );
}
