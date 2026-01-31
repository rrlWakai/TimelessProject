type Review = {
  name: string;
  avatar: string; // /images/guest1.jpg
  review: string;
  nights: number;
  rating: number; // e.g. 4.9
  verified?: boolean;
};

type Props = {
  review: Review;
};

export function ReviewCard({ review }: Props) {
  return (
    <article
      className="
        group relative w-full overflow-hidden
        rounded-[24px]
        border border-black/5
        bg-[#eef0f2]
        shadow-[0_18px_55px_rgba(0,0,0,0.12)]
        transition
        hover:-translate-y-0.5
        hover:shadow-[0_26px_70px_rgba(0,0,0,0.16)]
        h-[460px] sm:h-[440px] lg:h-[420px]
      "
    >
      {/* Image */}
      <img
        src={review.avatar}
        alt={`${review.name} guest portrait`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* Readability overlays: subtle top glow + bottom-heavy gradient */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            // soft highlight near top (luxury glow)
            "radial-gradient(900px 520px at 50% 10%, rgba(255,255,255,0.14), transparent 60%)," +
            // bottom-heavy cinematic gradient (main readability)
            "linear-gradient(to bottom, rgba(11,18,32,0.08) 0%, rgba(11,18,32,0.18) 45%, rgba(11,18,32,0.70) 78%, rgba(11,18,32,0.88) 100%)",
        }}
      />

      {/* Bottom content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* We keep top area empty so image remains clean */}
        <div className="flex-1" />

        {/* Bottom panel inside image (soft glass) */}
        <div className="p-5 sm:p-6">
          <div
            className="
              rounded-[18px]
              bg-white/10
              backdrop-blur
              border border-white/15
              shadow-[0_16px_40px_rgba(0,0,0,0.18)]
              p-5 sm:p-6
              text-white
            "
          >
            {/* Name + verified */}
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] sm:text-[20px] font-semibold tracking-tight">
                {review.name}
              </h3>

              {review.verified && (
                <span
                  className="
                    inline-flex h-5 w-5 items-center justify-center
                    rounded-full bg-emerald-500
                    shadow-[0_10px_22px_rgba(16,185,129,0.35)]
                  "
                  aria-label="Verified guest"
                  title="Verified guest"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="white"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>

            {/* Review text — clamped */}
            <p className="mt-2 text-[14px] sm:text-[15px] leading-relaxed text-white/85 line-clamp-3 sm:line-clamp-2">
              “{review.review}”
            </p>

            {/* Stats + CTA */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-[13px] text-white/75">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-block h-4 w-4 rounded-full bg-white/15 border border-white/20" />
                  <span className="tabular-nums">{review.nights}</span>
                  <span className="hidden sm:inline">nights</span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <span className="text-[rgb(var(--gold))]">★</span>
                  <span className="tabular-nums">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="
                  inline-flex items-center gap-2
                  rounded-full
                  bg-white/12
                  border border-white/18
                  px-4 py-2
                  text-[13px] sm:text-[14px] font-medium text-white
                  transition
                  hover:bg-white/18
                  focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/70
                  focus-visible:ring-offset-2 focus-visible:ring-offset-black/40
                "
              >
                Read Review
                <span
                  className="
                    inline-flex h-5 w-5 items-center justify-center
                    rounded-full bg-white/15 border border-white/20
                    text-[12px]
                  "
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
