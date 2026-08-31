"use client";

import Link from "next/link";
import { KineticSignalField } from "@/components/brand/kinetic-signal-field";

export function KineticHero({
  latestWipTitle,
}: {
  latestWipTitle?: string;
}) {
  return (
    <section className="hero-section relative overflow-hidden">
      {/* Ambient Interactive Mouse-Following Signal Field */}
      <KineticSignalField className="opacity-90" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-start gap-5">
        <div className="hero-status-pill group backdrop-blur-sm bg-surface/80 border-border/80 hover:border-signal/50 transition-colors">
          <div className="flex items-center gap-1.5 py-0.5">
            <span className="size-2 rounded-full bg-signal animate-pulse" />
            <div className="flex items-center gap-0.5 h-3 px-1">
              <span className="w-0.5 h-2 bg-signal/70 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-0.5 h-3 bg-signal rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-0.5 h-1.5 bg-signal/80 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-0.5 h-2.5 bg-signal/90 rounded-full animate-bounce [animation-delay:75ms]" />
            </div>
          </div>
          <span className="font-mono text-xs text-fg font-medium tracking-tight">
            {latestWipTitle
              ? `Signal Active · Building ${latestWipTitle}`
              : "Signal Active · 1Zero9 Studio"}
          </span>
        </div>

        <h1 className="hero-headline">
          Leading technology—<em>still building hands-on.</em>
        </h1>

        <p className="hero-lead">
          By day, I work across governance, security, and AI enablement in enterprise IT. Outside work, 1Zero9 is my creative engineering workshop—designing and building websites, PWAs, and full-stack software from idea to launch.
        </p>

        <div className="hero-actions">
          <Link href="#work" className="btn-primary">
            <span>Explore Spotlight</span>
            <span aria-hidden="true">↓</span>
          </Link>
          <Link href="/projects" className="btn-secondary">
            <span>Portfolio</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/labs" className="btn-secondary">
            <span>Active Labs</span>
            <span className="pulse-dot wip" />
          </Link>
          <Link href="/about" className="btn-secondary">
            <span>About</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
