import Link from "next/link";
import { Container } from "@/components/layout/container";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Collaborating with 1Zero9",
  description: "How 1Zero9 Studio collaborates on web software, apps, and digital products.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <header className="mb-12">
        <p className="font-mono text-xs text-signal-text uppercase tracking-wider mb-3">
          Studio / Collaborating
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight">
          Good collaborations start with an <span className="text-signal-text">interesting problem.</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="flex flex-col gap-3">
          <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-2 font-mono text-xs text-muted">
            <span className="text-fg font-semibold">Direct Collaboration</span>
            <span className="text-muted">No Agency Overhead</span>
            <span className="text-muted">Idea to Production</span>
          </div>
        </aside>

        <div className="md:col-span-2 flex flex-col gap-6 text-base sm:text-lg text-muted leading-relaxed">
          <p className="text-fg font-medium text-lg sm:text-xl leading-snug">
            1Zero9 is a private workshop, not a template farm. I partner with founders, teams, and community organizations when the problem and fit align.
          </p>

          <p>
            That often means crafting an audience-first website that loads instantly and serves real users, architecting an AI-assisted product workflow with guardrails, or building a standalone Progressive Web App.
          </p>

          <p>
            I work directly across product vision, UI/UX design, and production engineering. The best way to evaluate fit is to check the projects—and simply get in touch to discuss what you’re planning.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border">
            <Link href="/projects" className="btn-primary">
              <span>View Selected Work</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className="btn-secondary">
              <span>Start a Conversation</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
