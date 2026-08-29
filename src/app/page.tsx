import Link from "next/link";
import { KineticHero } from "@/components/portfolio/kinetic-hero";
import { LabsSpotlight } from "@/components/portfolio/labs-spotlight";
import { ProjectFilter } from "@/components/portfolio/project-filter";
import { StudioBadge } from "@/components/portfolio/studio-badge";
import { inProgressProjects, portfolioProjects } from "@/lib/content";

export default function Home() {
  const wipProjects = inProgressProjects();
  const prodProjects = portfolioProjects();
  const latestWip = wipProjects[0];

  return (
    <>
      <KineticHero latestWipTitle={latestWip?.title} />

      {/* Production Portfolio Showcase */}
      <section className="work-section" id="work">
        <div className="section-header">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-eyebrow">01 / Selected Portfolio & Production Work</p>
              <h2 className="section-title">Websites, PWAs & software</h2>
            </div>
            <Link href="/projects" className="btn-secondary text-sm">
              <span>View All Portfolio</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="section-subtitle">
            Production-grade client platforms, community websites, and standalone applications engineered for performance and real users.
          </p>
        </div>

        <ProjectFilter projects={prodProjects} showFilterTabs={true} />
      </section>

      {/* Active Labs & Experiments */}
      {wipProjects.length > 0 && (
        <LabsSpotlight inProgressProjects={wipProjects} />
      )}

      {/* Studio Verification & Backlink Destination */}
      <StudioBadge />
    </>
  );
}
