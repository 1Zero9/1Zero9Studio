"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import { ProjectCard } from "@/components/portfolio/project-card";

type FilterKey = "all" | "live" | "wip" | "websites" | "apps" | "ai";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "live") {
      return (
        project.status === "live" ||
        project.status === "featured" ||
        project.status === "active"
      );
    }
    if (filter === "wip") {
      return project.status === "in-progress";
    }
    if (filter === "websites") {
      return project.kind === "website";
    }
    if (filter === "apps") {
      return project.kind === "app" || project.kind === "pwa";
    }
    if (filter === "ai") {
      return (
        project.tags?.some((t) => t.toLowerCase().includes("ai")) ||
        project.kind === "tool"
      );
    }
    return true;
  });

  const filterButtons: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All Projects", count: projects.length },
    {
      key: "live",
      label: "Live Sites",
      count: projects.filter(
        (p) =>
          p.status === "live" ||
          p.status === "featured" ||
          p.status === "active",
      ).length,
    },
    {
      key: "wip",
      label: "Building Now",
      count: projects.filter((p) => p.status === "in-progress").length,
    },
    {
      key: "websites",
      label: "Websites",
      count: projects.filter((p) => p.kind === "website").length,
    },
    {
      key: "apps",
      label: "Apps & PWAs",
      count: projects.filter((p) => p.kind === "app" || p.kind === "pwa").length,
    },
    {
      key: "ai",
      label: "AI & Tools",
      count: projects.filter(
        (p) =>
          p.tags?.some((t) => t.toLowerCase().includes("ai")) ||
          p.kind === "tool",
      ).length,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="work-filter-bar" role="tablist" aria-label="Project filter">
        {filterButtons.map((btn) => (
          <button
            key={btn.key}
            type="button"
            role="tab"
            aria-selected={filter === btn.key}
            onClick={() => setFilter(btn.key)}
            className={`filter-btn ${filter === btn.key ? "active" : ""}`}
          >
            <span>{btn.label}</span>
            <span className="ml-1.5 opacity-60 text-xs font-mono">
              ({btn.count})
            </span>
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            priority={index < 3}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl bg-surface border border-border">
          <p className="text-muted">No projects found in this category.</p>
        </div>
      )}
    </div>
  );
}
