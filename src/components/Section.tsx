import type { ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="py-14 sm:py-18 lg:py-24">
      <Container>
        {(title || subtitle) && (
          <header className="mb-8 sm:mb-10">
            {title && (
              <h2 className="font-[var(--font-serif)] text-3xl sm:text-4xl leading-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 max-w-2xl text-[rgb(var(--muted))]">
                {subtitle}
              </p>
            )}
          </header>
        )}

        {children}
      </Container>
    </section>
  );
}
