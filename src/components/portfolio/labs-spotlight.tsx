import Link from "next/link";
import type { Project } from "@/lib/content";

export function LabsSpotlight({
  inProgressProjects,
}: {
  inProgressProjects: Project[];
}) {
  if (inProgressProjects.length === 0) return null;

  return (
    <section className="labs-section" id="labs">
      <div className="section-header">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-eyebrow">
              <span className="pulse-dot wip" />
              02 / Active Labs & In-Progress Work
            </p>
            <h2 className="section-title">What I’m building right now</h2>
          </div>
          <Link href="/labs" className="btn-secondary text-sm">
            <span>Explore All Labs</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="section-subtitle">
          Real-time record of active experiments, tools, and prototypes currently on the workbench.
        </p>
      </div>

      <div className="labs-grid">
        {inProgressProjects.map((project) => (
          <article
            key={project.slug}
            className="lab-card"
            style={{ "--card-accent": project.accent } as React.CSSProperties}
          >
            <div>
              <div className="lab-card__header">
                <h3 className="lab-card__title">
                  <Link href={`/projects/${project.slug}`} className="hover:underline">
                    {project.title}
                  </Link>
                </h3>
                <span className="lab-card__badge">
                  <span className="pulse-dot wip" />
                  Building
                </span>
              </div>

              <p className="lab-card__summary">{project.summary}</p>

              {project.wipProgress && (
                <div className="lab-card__progress">
                  <span className="font-mono text-xs text-signal-text">Status:</span>
                  <span className="text-xs text-muted">{project.wipProgress}</span>
                </div>
              )}
            </div>

            <div className="lab-card__footer">
              <div className="flex flex-wrap gap-1.5">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="tech-tag">
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/projects/${project.slug}`}
                className="link-case-study text-sm font-semibold"
              >
                <span>Read lab notes</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
