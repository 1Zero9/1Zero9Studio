import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About Stephen Cranfield",
  description:
    "About Stephen Cranfield — technology leader, enterprise AI enablement, and hands-on builder at 1Zero9 Studio.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <header className="mb-12">
        <p className="font-mono text-xs text-signal uppercase tracking-wider mb-3">
          About / Stephen Cranfield
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight">
          Taking an idea all the way to{" "}
          <span className="text-signal">working software.</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quick Facts Sidebar */}
        <aside className="flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3">
            <Logo className="h-7 w-auto text-signal" />
            <div className="border-t border-border pt-3 flex flex-col gap-2 font-mono text-xs text-muted">
              <div>
                <span className="text-faint block">Location</span>
                <span className="text-fg font-semibold">Dublin, Ireland</span>
              </div>
              <div>
                <span className="text-faint block">Day Role</span>
                <span className="text-fg font-semibold">Governance & AI Enablement</span>
              </div>
              <div>
                <span className="text-faint block">Workshop</span>
                <span className="text-fg font-semibold">1Zero9 Studio</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Narrative Copy */}
        <div className="md:col-span-2 flex flex-col gap-6 text-base sm:text-lg text-muted leading-relaxed">
          <p className="text-fg font-medium text-lg sm:text-xl leading-snug">
            I’m Stephen. 1Zero9 is my personal studio and public record of the things I design, build, test, and learn from.
          </p>

          <p>
            Alongside 1Zero9, I work in enterprise governance, security, and AI enablement—helping large organizations adopt AI responsibly and turning ambiguous, high-risk frontiers into structured, workable practice. This studio is where that same instinct plays out hands-on: building the product, not just governing it.
          </p>

          <p>
            My projects often begin with practical questions: How can a community football club operate seamlessly on a rainy Tuesday? How can an AI security assistant help teams draft realistic simulations without hallucinations? How can everyday tasks be made simpler through installable web apps?
          </p>

          <p>
            I care about the complete arc of product creation: shaping the core concept, architecting the system, designing accessible interfaces, and polishing the engineering until it runs reliably in production.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-border">
            <Link href="/projects" className="btn-primary">
              <span>Explore Portfolio</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/labs" className="btn-secondary">
              <span>Explore Labs</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/contact" className="btn-secondary">
              <span>Get in touch</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
