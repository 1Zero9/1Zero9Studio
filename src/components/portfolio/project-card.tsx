import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const isLive = project.status === "live" || project.status === "featured" || project.status === "active";
  const isWip = project.status === "in-progress";

  return (
    <article
      className="project-card group"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      <div className="project-card__image-wrap">
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.coverAlt || project.title}
            width={720}
            height={450}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="project-card__image"
          />
        ) : (
          <div className="project-card__image-placeholder">
            <span style={{ color: project.accent }}>{project.title.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="project-card__content">
        <div className="project-card__top">
          <span className="badge-kind">{project.kind}</span>
          {isWip ? (
            <span className="badge-status-wip">
              <span className="pulse-dot wip" />
              Building Now
            </span>
          ) : isLive ? (
            <span className="badge-status-live">
              <span className="pulse-dot" />
              Live
            </span>
          ) : null}
        </div>

        <h2 className="project-card__title">
          <Link href={`/projects/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h2>

        <p className="project-card__summary">{project.summary}</p>

        {project.techStack && project.techStack.length > 0 ? (
          <div className="project-card__tech-stack">
            {project.techStack.map((tech) => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        ) : project.tags && project.tags.length > 0 ? (
          <div className="project-card__tech-stack">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tech-tag">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="project-card__actions">
          <Link href={`/projects/${project.slug}`} className="link-case-study">
            <span>Read Story</span>
            <span aria-hidden="true">→</span>
          </Link>

          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-live-site"
            >
              <span>Visit Site</span>
              <span aria-hidden="true">↗</span>
            </a>
          ) : project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="link-live-site"
            >
              <span>GitHub</span>
              <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
