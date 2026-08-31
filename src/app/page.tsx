import Link from "next/link";
import Image from "next/image";
import { KineticHero } from "@/components/portfolio/kinetic-hero";
import { StudioBadge } from "@/components/portfolio/studio-badge";
import {
  homeSpotlightProject,
  portfolioProjects,
  labsProjects,
  inProgressProjects,
} from "@/lib/content";

export default function Home() {
  const spotlight = homeSpotlightProject();
  const prodProjects = portfolioProjects();
  const labs = labsProjects();
  const wipProjects = inProgressProjects();
  const latestWip = wipProjects[0];

  return (
    <>
      <KineticHero latestWipTitle={latestWip?.title} />

      {/* Single Featured / Latest Work Spotlight */}
      {spotlight && (
        <section className="work-section" id="work">
          <div className="section-header">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-eyebrow">01 / Latest Work Spotlight</p>
                <h2 className="section-title">Featured Project</h2>
              </div>
              <Link href="/projects" className="btn-secondary text-sm">
                <span>View Full Portfolio ({prodProjects.length})</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="section-subtitle">
              Selected highlight from the studio. All other production builds, web platforms, and applications live in the full portfolio.
            </p>
          </div>

          {/* Spotlight Hero Card */}
          <div className="relative group rounded-3xl bg-surface border border-border overflow-hidden shadow-card hover:border-border-hover transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Cover Media */}
              <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[340px] bg-bg-subtle border-b lg:border-b-0 lg:border-r border-border overflow-hidden flex items-center justify-center">
                {spotlight.cover ? (
                  <Image
                    src={spotlight.cover}
                    alt={spotlight.coverAlt || spotlight.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div
                    className="size-full flex items-center justify-center p-8 text-center"
                    style={{
                      background: `radial-gradient(circle at center, ${spotlight.accent}15, transparent 70%)`,
                    }}
                  >
                    <span className="text-4xl sm:text-6xl font-bold font-mono tracking-tight text-fg/20">
                      {spotlight.title}
                    </span>
                  </div>
                )}

                {/* Kind & Status Badge Overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="badge-kind uppercase tracking-wider text-[11px] font-mono shadow-sm">
                    {spotlight.kind}
                  </span>
                  {spotlight.status === "in-progress" && (
                    <span className="badge-wip text-[11px] font-mono shadow-sm">
                      ● Building Now
                    </span>
                  )}
                </div>
              </div>

              {/* Spotlight Content & Details */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-muted">
                      {spotlight.date.slice(0, 4)} · 1Zero9 Studio
                    </span>
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: spotlight.accent }}
                      title={`Accent: ${spotlight.accent}`}
                    />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-fg tracking-tight mb-3">
                    {spotlight.title}
                  </h3>

                  <p className="text-sm sm:text-base text-muted leading-relaxed mb-6">
                    {spotlight.summary}
                  </p>

                  {/* Highlights if present */}
                  {spotlight.highlights && spotlight.highlights.length > 0 && (
                    <ul className="space-y-1.5 mb-6 text-xs text-muted font-sans">
                      {spotlight.highlights.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-signal font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {spotlight.techStack.map((tech) => (
                      <span key={tech} className="tech-tag text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border">
                  <Link
                    href={`/projects/${spotlight.slug}`}
                    className="btn-primary flex-1 text-center justify-center text-sm"
                  >
                    <span>Read Full Case Study</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  {spotlight.url && (
                    <a
                      href={spotlight.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      <span>Live Site</span>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Nav Explore Footer */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/projects"
              className="p-5 rounded-2xl bg-surface border border-border hover:border-border-hover transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-mono text-signal uppercase tracking-wider block mb-1">
                  Full Catalog
                </span>
                <span className="text-base font-bold text-fg group-hover:text-signal transition-colors">
                  Explore All Portfolio Projects ({prodProjects.length}) →
                </span>
              </div>
            </Link>

            <Link
              href="/labs"
              className="p-5 rounded-2xl bg-surface border border-border hover:border-border-hover transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-mono text-wip-amber uppercase tracking-wider block mb-1">
                  Active Labs
                </span>
                <span className="text-base font-bold text-fg group-hover:text-wip-amber transition-colors">
                  Explore Active Experiments & Tools ({labs.length}) →
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Studio Verification Footprint */}
      <StudioBadge />
    </>
  );
}
