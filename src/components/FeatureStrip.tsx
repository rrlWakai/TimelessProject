import { Container } from "./Container";

type Feature = {
  title: string;
  icon: React.ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: "5-STAR SERVICE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l2.3 6.9H21l-5.6 4 2.2 7.1L12 16.9 6.4 21l2.2-7.1L3 9.9h6.7L12 3z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
  {
    title: "OCEANFRONT",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 18c3 0 3-2 6-2s3 2 6 2 3-2 6-2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M6 14l2-3 2 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 14l2-4 2 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "MICHELIN",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 3v8M6 3v8M10 3v8M7 11v10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16 3v8c0 2 2 2 2 0V3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M18 11v10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function FeatureStrip() {
  return (
    <div className="absolute left-0 right-0 bottom-0 z-20">
      <Container className="relative">
        <div
          className="
            mx-auto
            -translate-y-3 sm:-translate-y-7
            rounded-[var(--radius-card)]
            border border-white/12
            bg-[#0b1220]/60
            backdrop-blur-md
            shadow-[0_18px_60px_rgba(0,0,0,0.35)]
          "
        >
          <div className="px-4 py-3 sm:px-8 sm:py-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              {FEATURES.map((f, idx) => (
                <div
                  key={f.title}
                  className="
                    flex items-center justify-center gap-2
                    text-center
                    py-2
                    sm:py-0
                  "
                >
                  <div className="text-[rgb(var(--gold))]">{f.icon}</div>
                  <div className="text-[10px] sm:text-xs tracking-[0.22em] text-white/85">
                    {f.title}
                  </div>

                  {/* subtle dividers for mobile */}
                  {idx !== FEATURES.length - 1 && (
                    <span className="hidden sm:hidden" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-white/10" aria-hidden="true" />
        </div>
      </Container>
    </div>
  );
}
