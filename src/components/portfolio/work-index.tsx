"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type WorkPreview = {
  slug: string;
  title: string;
  summary: string;
  kind: "app" | "website" | "experiment";
  year: string;
  accent: string;
  cover?: string;
  coverAlt?: string;
};

const label = { app: "App", website: "Website", experiment: "Experiment" };

export function WorkIndex({ projects }: { projects: WorkPreview[] }) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug ?? "");
  const active = projects.find((project) => project.slug === activeSlug) ?? projects[0];

  if (!active) return null;

  return (
    <div className="work-browser" style={{ "--work-accent": active.accent } as React.CSSProperties}>
      <div className="work-browser__list">
        {projects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            onPointerEnter={() => setActiveSlug(project.slug)}
            onFocus={() => setActiveSlug(project.slug)}
            className={project.slug === active.slug ? "is-active" : ""}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{project.title}</strong>
            <small>{label[project.kind]} / {project.year}</small>
            <b aria-hidden="true">↗</b>
            {project.cover && (
              <Image
                src={project.cover}
                alt=""
                width={800}
                height={500}
                className="work-browser__mobile-image"
              />
            )}
          </Link>
        ))}
      </div>
      <Link href={`/projects/${active.slug}`} className="work-browser__preview" aria-label={`View ${active.title}`}>
        {active.cover ? (
          <Image
            key={active.cover}
            src={active.cover}
            alt={active.coverAlt ?? ""}
            width={1600}
            height={1000}
            sizes="45vw"
            className="work-browser__preview-image"
          />
        ) : (
          <span>{active.title.charAt(0)}</span>
        )}
        <p>{active.summary}</p>
      </Link>
    </div>
  );
}
