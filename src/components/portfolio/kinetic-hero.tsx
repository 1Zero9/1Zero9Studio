"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { WaveformVisualizer } from "@/components/brand/waveform-visualizer";

export function KineticHero({
  latestWipTitle,
}: {
  latestWipTitle?: string;
}) {
  return (
    <section className="hero-section">
      <div className="flex flex-col items-start gap-4">
        <div className="hero-status-pill">
          <span className="pulse-dot" />
          <span>
            {latestWipTitle
              ? `Currently building: ${latestWipTitle}`
              : "1Zero9 Studio · Creative Engineering"}
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
            <span>Explore Portfolio</span>
            <span aria-hidden="true">↓</span>
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

      {/* Brand Waveform Showcase Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-card flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-auto text-fg" />
            <div>
              <span className="text-xs font-mono text-signal uppercase tracking-wider block">
                Signal Active · 1Zero9 Studio
              </span>
              <span className="text-xs sm:text-sm font-semibold text-fg">
                Product Architecture · Interface Design · Working Software
              </span>
            </div>
          </div>
        </div>

        <WaveformVisualizer active={true} />
      </div>
    </section>
  );
}
