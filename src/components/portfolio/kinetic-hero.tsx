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
              : "1Zero9 Studio · Stephen Cranfield"}
          </span>
        </div>

        <h1 className="hero-headline">
          Leading technology—<em>still building hands-on.</em>
        </h1>

        <p className="hero-lead">
          By day, I work in enterprise governance, security, and AI enablement. Outside work, 1Zero9 is my creative engineering studio—designing and building websites, PWAs, and full-stack software from first spark to launch.
        </p>

        <div className="hero-actions">
          <Link href="#work" className="btn-primary">
            <span>Explore Work</span>
            <span aria-hidden="true">↓</span>
          </Link>
          <Link href="#labs" className="btn-secondary">
            <span>Active Labs</span>
            <span className="pulse-dot wip" />
          </Link>
          <Link href="/about" className="btn-secondary">
            <span>About Me</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {/* Brand Waveform Showcase Card */}
      <div className="brand-waveform-card">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto text-fg" />
            <div>
              <span className="text-xs font-mono text-signal uppercase tracking-wider block">
                Signal Active · 1Zero9
              </span>
              <span className="text-sm font-semibold text-fg">
                Product Design · Creative Engineering · Working Software
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-muted hidden sm:inline-block">
            Hover to modulate frequency
          </span>
        </div>

        <WaveformVisualizer bars={52} active={true} />
      </div>
    </section>
  );
}
