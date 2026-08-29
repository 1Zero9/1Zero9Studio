/*
 * The single source of truth for content data.
 * Pure static, type-safe, and zero database overhead.
 */
import { allProjects as generatedProjects } from "content-collections";

const hideDrafts = process.env.NODE_ENV === "production";

export const allProjects = generatedProjects
  .filter((project) => project.slug !== "_template")
  .filter((project) => !hideDrafts || !project.draft)
  .filter((project) => project.status !== "archived")
  .sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return b.date.localeCompare(a.date);
  });

export function featuredProjects() {
  return allProjects.filter(
    (project) => project.featured || project.status === "featured",
  );
}

export function inProgressProjects() {
  return allProjects.filter((project) => project.status === "in-progress");
}

export function portfolioProjects() {
  // Production portfolio: live websites, client platforms, and standalone applications
  return allProjects.filter(
    (project) =>
      project.kind === "website" ||
      (project.status !== "in-progress" &&
        !project.tags.includes("experiment") &&
        project.kind !== "experiment" &&
        project.kind !== "tool"),
  );
}

export function labsProjects() {
  // Active labs: in-progress work, game experiments, AI workflow prototypes, and utility tools
  return allProjects.filter(
    (project) =>
      project.status === "in-progress" ||
      project.tags.includes("experiment") ||
      project.kind === "experiment" ||
      project.kind === "tool" ||
      project.slug === "swgoh" ||
      project.slug === "prompt-builder" ||
      project.slug === "jobjar" ||
      project.slug === "holiday-concierge",
  );
}

export function getProject(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}

export type Project = (typeof allProjects)[number];
