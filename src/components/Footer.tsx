import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-[#faf9f7]">
      <Container>
        <div className="py-10 sm:py-12 flex flex-col gap-6">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Brand */}
            <div className="font-cinzel text-sm uppercase tracking-[0.32em] text-[rgb(var(--ink))]">
              Timeless
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2 text-sm text-black/60">
              <a href="#rooms" className="hover:text-black transition">
                Rooms
              </a>
              <a href="#amenities" className="hover:text-black transition">
                Amenities
              </a>
              <a href="#spa" className="hover:text-black transition">
                Spa
              </a>
              <a href="#contact" className="hover:text-black transition">
                Contact
              </a>
            </nav>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-black/45">
            <div>© {new Date().getFullYear()} Timeless Hotel</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-black transition">
                Privacy
              </a>
              <a href="#" className="hover:text-black transition">
                Terms
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
