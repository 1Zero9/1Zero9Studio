import { Container } from "@/components/layout/container";
import { Prose } from "@/components/ui/prose";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Colophon",
  description: "How 1Zero9 Studio is designed and engineered.",
  path: "/colophon",
});

export default function ColophonPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <header className="mb-12">
        <p className="font-mono text-xs text-signal uppercase tracking-wider mb-3">
          Colophon / Behind the Studio
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight">
          A studio platform built for <span className="text-signal">speed and clarity.</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="flex flex-col gap-3">
          <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-2 font-mono text-xs text-muted">
            <div>
              <span className="text-faint block">Design & Code</span>
              <span className="text-fg font-semibold">Stephen Cranfield</span>
            </div>
            <div>
              <span className="text-faint block">Framework</span>
              <span className="text-fg font-semibold">Next.js 16 (App Router)</span>
            </div>
            <div>
              <span className="text-faint block">Styling</span>
              <span className="text-fg font-semibold">Tailwind CSS 4</span>
            </div>
            <div>
              <span className="text-faint block">Content System</span>
              <span className="text-fg font-semibold">Static MDX Collections</span>
            </div>
          </div>
        </aside>

        <div className="md:col-span-2">
          <Prose>
            <h2>Design Philosophy</h2>
            <p>
              The 1Zero9 mark is the signature anchor. Everything around it is designed as a focused editorial canvas: high-contrast dark and light modes, typography, interactive audio waveforms, and responsive cards that showcase each project’s unique personality.
            </p>

            <h2>Architecture & Performance</h2>
            <p>
              The site is built with Next.js and pure static generation (SSG). There is zero database overhead or serverless cold starts. Every case study and note is validated via typed Zod schemas and compiled at build time.
            </p>

            <h2>Accessibility & Motion</h2>
            <p>
              Layouts fluidly adapt from ultra-wide monitors to handheld screens. High-contrast typography ensures readability across devices, and system-level <code>prefers-reduced-motion</code> settings are respected throughout all animations.
            </p>
          </Prose>
        </div>
      </div>
    </Container>
  );
}
