import { Container } from "./Container";

type MapStripProps = {
  location?: string;
};

export function MapStrip({ location = "Los Angeles, CA" }: MapStripProps) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-[var(--radius-card)]
        border border-black/10
        shadow-[var(--shadow-card)]
      "
    >
      {/* Map iframe */}
      <iframe
        title="Hotel location"
        src="https://maps.google.com/maps?q=Los%20Angeles%20CA&t=m&z=13&ie=UTF8&iwloc=&output=embed"
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Muted luxury overlay */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, rgba(250,248,244,0.90), rgba(250,248,244,0.55), rgba(250,248,244,0.15))",
        }}
      />

      {/* Soft vignette for depth */}
      <div
        className="absolute inset-0 opacity-[0.45]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(900px 320px at 25% 50%, rgba(197,167,110,0.18), transparent 60%), radial-gradient(900px 420px at 75% 50%, rgba(0,0,0,0.10), transparent 60%)",
        }}
      />

      <Container className="relative">
        <div className="min-h-[180px] sm:min-h-[220px] flex items-center py-8">
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Location label */}
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span
                className="
                  inline-flex h-10 w-10 items-center justify-center
                  rounded-full bg-white/70
                  border border-black/10
                  shadow-[0_10px_26px_rgba(0,0,0,0.08)]
                  backdrop-blur
                "
                aria-hidden="true"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22s7-4.5 7-12a7 7 0 1 0-14 0c0 7.5 7 12 7 12Z"
                    stroke="rgb(var(--gold))"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M12 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                    stroke="rgb(var(--gold))"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>

              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-black/45">
                  Location
                </div>
                <div className="mt-1 font-cinzel uppercase tracking-[0.10em] text-[rgb(var(--ink))] text-lg">
                  {location}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center sm:justify-end">
              <a
                href="https://maps.google.com/?q=Los+Angeles+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  rounded-full bg-white/70
                  border border-black/10
                  px-6 py-3 text-sm font-medium
                  text-[rgb(var(--ink))]
                  shadow-[0_12px_28px_rgba(0,0,0,0.08)]
                  hover:bg-white/80 hover:translate-y-[-1px]
                  transition
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/60
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]
                "
              >
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
