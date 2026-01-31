import { useEffect, useState } from "react";

type Choice = "accepted" | "declined";
const STORAGE_KEY = "timeless_cookie_choice_v1";

function safeGetLocalStorage(key: string) {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLocalStorage(key: string, value: string) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  } catch {
    // ignore (private mode / blocked storage)
  }
}

function usePrefersReducedMotion() {
  // ✅ initial value computed without an effect (prevents lint warning)
  const [reduce, setReduce] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  });

  // ✅ effect only subscribes to external changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches);

    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduce;
}

export function CookieNotice() {
  const reduceMotion = usePrefersReducedMotion();

  // ✅ initialize from localStorage directly (no effect setState)
  const [visible, setVisible] = useState(() => {
    const saved = safeGetLocalStorage(STORAGE_KEY) as Choice | null;
    return !saved;
  });

  const [customize, setCustomize] = useState(false);

  // Optional granular toggles (only shown in Customize)
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const persist = (choice: Choice) => {
    safeSetLocalStorage(STORAGE_KEY, choice);
    setVisible(false);
    setCustomize(false);
  };

  const acceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    persist("accepted");
  };

  const declineAll = () => {
    setAnalytics(false);
    setMarketing(false);
    persist("declined");
  };

  const savePrefs = () => {
    persist(analytics || marketing ? "accepted" : "declined");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] p-3 sm:p-4">
      <div
        className="
          mx-auto max-w-4xl
          rounded-[22px]
          border border-white/12
          bg-[linear-gradient(180deg,rgba(10,18,34,0.90),rgba(9,16,30,0.78))]
          backdrop-blur-xl
          shadow-[0_28px_90px_rgba(0,0,0,0.55)]
          overflow-hidden
        "
        style={{
          animation: reduceMotion
            ? "none"
            : "cookieUp 520ms cubic-bezier(.16,1,.3,1) both",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Cookie notice"
      >
        {/* subtle gold hairline */}
        <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(197,168,108,0.65),transparent)]" />

        <div className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* Copy */}
            <div className="min-w-0">
              <div className="inline-flex items-center gap-3 text-[rgb(var(--gold))] text-[10px] tracking-[0.35em] uppercase">
                <span className="h-px w-8 bg-[rgb(var(--gold))]/60" />
                Cookies
              </div>

              <h3 className="mt-3 font-[var(--font-serif)] text-[17px] sm:text-xl text-white">
                We respect your privacy
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/70 max-w-2xl">
                We use essential cookies to keep the site working. With your
                permission, we may also use analytics and marketing cookies to
                improve performance and relevance.
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 flex-col sm:flex-row gap-2 sm:gap-3 sm:pt-1">
              <button
                type="button"
                onClick={() => setCustomize((v) => !v)}
                className="
                  rounded-full px-4 py-2 text-sm font-medium
                  text-white/85 border border-white/18
                  hover:bg-white/10 transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/60
                  focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                "
              >
                {customize ? "Hide options" : "Customize"}
              </button>

              <button
                type="button"
                onClick={declineAll}
                className="
                  rounded-full px-4 py-2 text-sm font-semibold
                  text-white border border-white/18
                  hover:bg-white/10 transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/60
                  focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                "
              >
                Decline
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="
                  rounded-full px-5 py-2 text-sm font-semibold
                  bg-[rgb(var(--gold))] text-[#0b1220]
                  shadow-[0_16px_40px_rgba(0,0,0,0.22)]
                  hover:opacity-95 hover:-translate-y-[1px] transition
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--gold))]/60
                  focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                "
              >
                Accept
              </button>
            </div>
          </div>

          {/* Customize panel */}
          {customize && (
            <div className="mt-4 rounded-2xl border border-white/12 bg-white/5 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="mt-1 h-4 w-4 accent-[rgb(var(--gold))]"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      Essential
                    </div>
                    <div className="text-xs text-white/65">
                      Required for site functionality. Always on.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[rgb(var(--gold))]"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      Analytics
                    </div>
                    <div className="text-xs text-white/65">
                      Helps us understand usage to improve the experience.
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[rgb(var(--gold))]"
                  />
                  <div>
                    <div className="text-sm font-medium text-white">
                      Marketing
                    </div>
                    <div className="text-xs text-white/65">
                      Used to personalize offers and measure campaign
                      performance.
                    </div>
                  </div>
                </label>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setCustomize(false)}
                  className="
                    rounded-full px-4 py-2 text-sm font-medium
                    text-white/85 border border-white/18
                    hover:bg-white/10 transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={savePrefs}
                  className="
                    rounded-full px-5 py-2 text-sm font-semibold
                    bg-[rgb(var(--gold))] text-[#0b1220]
                    shadow-[0_14px_34px_rgba(0,0,0,0.18)]
                    hover:opacity-95 hover:-translate-y-[1px] transition
                  "
                >
                  Save preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cookieUp {
          from { opacity: 0; transform: translateY(14px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
