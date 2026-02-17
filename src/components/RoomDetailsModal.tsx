// src/components/RoomDetailsModal.tsx
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Room } from "../data/rooms";
import { emitRoomAction } from "../admin/lib/roomActions";

export function RoomDetailsModal({
  open,
  room,
  onClose,
}: {
  open: boolean;
  room: Room | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Optional: lock body scroll when modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // If click happens outside the panel
  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target as Node)) onClose();
  };

  return (
    <AnimatePresence>
      {open && room && (
        <motion.div
          className="fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={onBackdropMouseDown}
            aria-hidden="true"
          />

          {/* Responsive Panel
              - Mobile: bottom-sheet (full width)
              - Desktop: centered modal
          */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className={[
              "absolute bg-white shadow-2xl border border-black/10 overflow-hidden",
              "w-full",
              // Mobile sheet
              "left-0 right-0 bottom-0 rounded-t-3xl",
              "max-h-[92dvh]",
              // Desktop centered modal
              "md:left-1/2 md:top-1/2 md:bottom-auto md:w-[min(980px,92vw)]",
              "md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:max-h-[90dvh]",
            ].join(" ")}
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.99,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 14,
              scale: 0.99,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scroll container */}
            <div className="max-h-[92dvh] md:max-h-[90dvh] overflow-y-auto">
              {/* Grab handle (mobile) */}
              <div className="md:hidden flex justify-center pt-3">
                <div className="h-1 w-12 rounded-full bg-black/20" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
                {/* Left: gallery */}
                <div className="bg-black/[0.02]">
                  {/* Thumbnails
                      - Mobile: horizontal scroll
                      - Desktop+: grid
                  */}
                  <div className="p-3">
                    <div className="md:grid md:grid-cols-3 md:gap-2 flex gap-2 overflow-x-auto md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {(room.gallery?.length ? room.gallery : [room.image])
                        .slice(0, 6)
                        .map((src) => (
                          <div
                            key={src}
                            className="shrink-0 w-36 md:w-auto overflow-hidden rounded-2xl border border-black/10 bg-white"
                          >
                            <img
                              src={src}
                              alt={room.name}
                              className="h-24 w-full object-cover sm:h-28 md:h-32"
                              loading="lazy"
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Main image */}
                  <div className="px-3 pb-3">
                    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[420px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: content */}
                <div className="p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs tracking-[0.25em] text-black/50 uppercase">
                        {room.type}
                      </div>
                      <h3 className="mt-2 font-[var(--font-serif)] text-xl sm:text-2xl text-[rgb(var(--ink))]">
                        {room.name}
                      </h3>
                      <p className="mt-2 text-sm text-black/60">{room.meta}</p>
                    </div>

                    <button
                      onClick={onClose}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:bg-black/[0.03]"
                    >
                      Close
                    </button>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-black/70">
                    {room.description}
                  </p>

                  <div className="mt-5">
                    <div className="text-xs tracking-[0.2em] text-black/50 uppercase">
                      Highlights
                    </div>
                    <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-black/70">
                      {room.features.slice(0, 6).map((f) => (
                        <li
                          key={f}
                          className="rounded-xl bg-black/[0.03] px-3 py-2"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {room.policies?.length ? (
                    <div className="mt-5">
                      <div className="text-xs tracking-[0.2em] text-black/50 uppercase">
                        Policies
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-black/60">
                        {room.policies.map((p) => (
                          <li key={p}>• {p}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Sticky action bar (mobile), normal (desktop) */}
                  <div
                    className={[
                      "mt-7",
                      "md:static md:mt-7",
                      "sticky bottom-0 -mx-5 sm:-mx-7 px-5 sm:px-7",
                      "pb-4 pt-4",
                      "bg-white/90 backdrop-blur border-t border-black/10",
                      "md:bg-transparent md:backdrop-blur-0 md:border-t-0 md:px-0 md:pb-0 md:pt-0 md:mx-0",
                      "pb-[calc(16px+env(safe-area-inset-bottom))] md:pb-0",
                    ].join(" ")}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-lg font-semibold">
                        ${room.price}{" "}
                        <span className="text-sm font-normal text-black/50">
                          / night
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          emitRoomAction("reserve", {
                            id: room.id,
                            type: room.type,
                            name: room.name,
                            image: room.image,
                            price: room.price,
                            badge: room.badge,
                            meta: room.meta,
                          });
                          onClose();
                        }}
                        className="rounded-2xl bg-[rgb(var(--gold))] px-5 py-3 text-sm font-semibold text-[#0b1220] hover:opacity-90 transition"
                      >
                        Reserve this room
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
