"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ProjectPreview = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  kind: "app" | "website" | "experiment";
  accent: string;
  cover?: string;
  coverAlt?: string;
  tags: string[];
  status: "featured" | "active" | "archived";
};

const labels = {
  app: "App",
  website: "Website",
  experiment: "Experiment",
};

export function ProjectStage({ projects }: { projects: ProjectPreview[] }) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const project = projects.find((item) => item.slug === activeSlug) ?? projects[0];

  if (!project) return null;

  return (
    <section className="project-stage" style={{ "--project-accent": project.accent } as React.CSSProperties}>
      <div className="project-stage__rail" role="tablist" aria-label="Selected projects">
        {projects.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={item.slug === project.slug}
            onClick={() => setActiveSlug(item.slug)}
            className="project-stage__tab"
          >
            <span className="project-stage__index">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{labels[item.kind]}</small>
            </span>
            <span className="project-stage__tab-arrow" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>

      <Link href={`/projects/${project.slug}`} className="project-stage__display">
        <div className="project-stage__chrome" aria-hidden="true">
          <span /><span /><span />
          <p>{project.kind} / {project.slug}</p>
          <b>live signal</b>
        </div>
        <div className="project-stage__screen">
          {project.cover ? (
            <Image
              key={project.cover}
              src={project.cover}
              alt={project.coverAlt ?? ""}
              width={1600}
              height={1000}
              sizes="(min-width: 1024px) 62vw, 100vw"
              priority
              loading="eager"
              className="project-stage__image"
            />
          ) : (
            <div className="project-stage__fallback">{project.title}</div>
          )}
          <div className="project-stage__scan" aria-hidden="true" />
        </div>
        <div className="project-stage__caption">
          <div>
            <p>{labels[project.kind]} · {project.year}</p>
            <h2>{project.title}</h2>
          </div>
          <p>{project.summary}</p>
          <span aria-hidden="true">Explore project ↗</span>
        </div>
      </Link>
    </section>
  );
}

type Filter = "all" | ProjectPreview["kind"];

export function ProjectExplorer({
  projects,
  headingLevel = "h3",
}: {
  projects: ProjectPreview[];
  headingLevel?: "h2" | "h3";
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(
    () => filter === "all" ? projects : projects.filter((project) => project.kind === filter),
    [filter, projects],
  );

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "Everything" },
    { value: "app", label: "Apps" },
    { value: "website", label: "Websites" },
    { value: "experiment", label: "Experiments" },
  ];
  const Heading = headingLevel;

  return (
    <div>
      <div className="project-filter" aria-label="Filter projects">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
            <span>
              {item.value === "all" ? projects.length : projects.filter((p) => p.kind === item.value).length}
            </span>
          </button>
        ))}
      </div>

      <div className="project-grid" aria-live="polite">
        {visible.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`project-tile project-tile--${(index % 3) + 1}`}
            style={{ "--project-accent": project.accent } as React.CSSProperties}
          >
            <div className="project-tile__media">
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt={project.coverAlt ?? ""}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="project-tile__image"
                />
              ) : (
                <span className="project-tile__letter">{project.title.charAt(0)}</span>
              )}
              <span className="project-tile__kind">{labels[project.kind]}</span>
            </div>
            <div className="project-tile__body">
              <div>
                <Heading>{project.title}</Heading>
                <p>{project.summary}</p>
              </div>
              <footer>
                <span>{project.year} · {project.tags.slice(0, 2).join(" / ")}</span>
                <span aria-hidden="true">View project ↗</span>
              </footer>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
