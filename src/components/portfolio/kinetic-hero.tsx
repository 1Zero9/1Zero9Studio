"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { KineticSignalField } from "@/components/brand/kinetic-signal-field";

export function KineticHero({
  latestWipTitle,
}: {
  latestWipTitle?: string;
}) {
  return (
    <section className="relative w-full overflow-hidden border-b border-border/30">
      {/* Full-Bleed Edge-to-Edge Waveform Canvas across the entire screen */}
      <div className="pointer-events-none absolute inset-0 size-full overflow-hidden select-none z-0">
        <KineticSignalField className="size-full" />
      </div>

      {/* Hero Content Container (Centered with max-width) */}
      <div className="hero-section relative z-10">
        <div className="flex flex-col items-start gap-6">
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

          {/* Sleek Wide Active Site & Studio Signal Bar */}
          <div className="w-full mt-2 p-4 sm:px-6 rounded-2xl bg-surface/80 backdrop-blur-md border border-border shadow-card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Logo className="h-6 w-auto text-fg shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-signal animate-pulse shrink-0" />
                  <span className="text-xs font-mono font-bold text-signal uppercase tracking-wider">
                    Signal Active · 1Zero9 Studio
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-fg block mt-0.5">
                  Product Architecture · Interface Design · Working Software
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted bg-bg-subtle/80 px-3 py-1.5 rounded-xl border border-border shrink-0">
              <span className="text-signal font-bold">●</span>
              <span>Workshop Online</span>
              <span className="opacity-40">·</span>
              <span>Dublin, IE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
