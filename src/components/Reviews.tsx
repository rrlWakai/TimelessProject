import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Section } from "./Section";
import { ReviewCard } from "./ReviewCard";

type Review = {
  name: string;
  avatar: string;
  review: string;
  nights: number;
  rating: number;
  verified?: boolean;
};

const REVIEWS: Review[] = [
  {
    name: "Sarah Swift",
    avatar: "/images/guest1.jpg",
    verified: true,
    review:
      "Every detail felt intentional — the room was immaculate, the service was discreet, and the atmosphere was beautifully calm.",
    nights: 3,
    rating: 4.9,
  },
  {
    name: "Paul Benson",
    avatar: "/images/guest2.jpg",
    verified: true,
    review:
      "A timeless luxury experience. Dining was exceptional and the spa treatment was one of the best I’ve had anywhere.",
    nights: 2,
    rating: 4.8,
  },
  {
    name: "Sophie Martin",
    avatar: "/images/guest3.jpg",
    verified: true,
    review:
      "Elegant, serene, and unforgettable. The staff anticipated everything before we even asked — truly five-star.",
    nights: 4,
    rating: 4.9,
  },
];

function getCardsPerView() {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w >= 1024) return 3;
  if (w >= 640) return 2;
  return 1;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function Reviews() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Dots wrap + dot refs for precise alignment
  const dotsWrapRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [cardsPerView, setCardsPerView] = useState(() => getCardsPerView());
  const [activePage, setActivePage] = useState(0);

  // X position of indicator relative to dot row
  const [indicatorX, setIndicatorX] = useState(0);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(REVIEWS.length / cardsPerView));
  }, [cardsPerView]);

  const scrollToPage = (pageIndex: number) => {
    const el = trackRef.current;
    if (!el) return;

    const pageWidth = el.clientWidth;
    el.scrollTo({ left: pageIndex * pageWidth, behavior: "smooth" });
  };

  // Resize -> cards per view changes
  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView());
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Option A: update active page discretely
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const updateActive = () => {
      const pageWidth = el.clientWidth || 1;
      const raw = el.scrollLeft / pageWidth;

      const next = clamp(Math.round(raw), 0, pageCount - 1);
      setActivePage((prev) => (prev === next ? prev : next));
    };

    updateActive();
    el.addEventListener("scroll", updateActive, { passive: true });

    const ro = new ResizeObserver(updateActive);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateActive);
      ro.disconnect();
    };
  }, [pageCount]);

  // Measure the active dot center and set indicatorX
  const syncIndicatorToActiveDot = () => {
    const wrap = dotsWrapRef.current;
    const dot = dotRefs.current[activePage];
    if (!wrap || !dot) return;

    const wrapRect = wrap.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();

    const dotCenterX = dotRect.left - wrapRect.left + dotRect.width / 2;

    // indicator is h-2.5 w-2.5 => 10px
    const INDICATOR_SIZE = 10;
    setIndicatorX(dotCenterX - INDICATOR_SIZE / 2);
  };

  // Use layout effect to avoid 1-frame lag / misalignment
  useLayoutEffect(() => {
    syncIndicatorToActiveDot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, pageCount]);

  // Also resync on resize (dot row may shift)
  useEffect(() => {
    const onResize = () => syncIndicatorToActiveDot();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, pageCount]);

  return (
    <Section
      id="reviews"
      title="Guest Reviews"
      subtitle="Stories from verified guests around the world"
    >
      {/* Summary */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="text-4xl font-semibold tabular-nums text-[rgb(var(--ink))]">
            4.8
          </div>
          <div className="text-[rgb(var(--muted))]">
            Based on 2,341 verified guests
          </div>
        </div>
        <div className="text-[rgb(var(--gold))] text-xl">★★★★★</div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={trackRef}
          className="
            flex gap-6 lg:gap-8
            overflow-x-auto
            scroll-smooth
            snap-x snap-mandatory
            pb-2
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="
                snap-start shrink-0
                w-full
                sm:w-[calc(50%-12px)]
                lg:w-[calc(33.333%-21.333px)]
              "
            >
              <ReviewCard review={r} />
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

      {/* Dots */}
      <div className="mt-8 flex items-center justify-center">
        <div
          ref={dotsWrapRef}
          className="relative flex items-center justify-center gap-2"
        >
          {/* Active circle indicator (single element) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className="
                h-2.5 w-2.5 rounded-full
                bg-[rgb(var(--gold))]
                shadow-[0_14px_34px_rgba(0,0,0,0.10)]
                transition-[transform,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)]
                will-change-transform
              "
              style={{
                transform: `translate3d(${indicatorX}px, 0, 0)`,
                opacity: 0.95,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Clickable dots */}
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              ref={(node) => {
                dotRefs.current[i] = node;
              }}
              type="button"
              onClick={() => scrollToPage(i)}
              aria-label={`Go to reviews page ${i + 1}`}
              aria-current={i === activePage ? "true" : undefined}
              className="
                relative z-10
                h-2.5 w-2.5 rounded-full
                bg-black/15 hover:bg-black/25
                transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/70
                focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]
              "
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
