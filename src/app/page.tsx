import { KineticHero } from "@/components/portfolio/kinetic-hero";
import { LabsSpotlight } from "@/components/portfolio/labs-spotlight";
import { ProjectFilter } from "@/components/portfolio/project-filter";
import { StudioBadge } from "@/components/portfolio/studio-badge";
import { allProjects, inProgressProjects } from "@/lib/content";

export default function Home() {
  const wipProjects = inProgressProjects();
  const latestWip = wipProjects[0];

  return (
    <>
      <KineticHero latestWipTitle={latestWip?.title} />

      {wipProjects.length > 0 && (
        <LabsSpotlight inProgressProjects={wipProjects} />
      )}

      <section className="work-section" id="work">
        <div className="section-header">
          <p className="section-eyebrow">03 / Selected Work & Portfolio</p>
          <h2 className="section-title">Websites, apps & software</h2>
          <p className="section-subtitle">
            A curated record of independent products, client websites, and full-stack applications.
          </p>
        </div>

        <ProjectFilter projects={allProjects} />
      </section>

      <StudioBadge />
    </>
  );
}
