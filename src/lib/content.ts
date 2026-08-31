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
  .filter((project) => project.section !== "hidden")
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

export function homeSpotlightProject() {
  // 1. Check for explicit homepage spotlight
  const explicit = allProjects.find((project) => project.featuredOnHome);
  if (explicit) return explicit;

  // 2. Check for featured project
  const featured = allProjects.find((project) => project.featured || project.status === "featured");
  if (featured) return featured;

  // 3. Fallback to newest portfolio project
  return portfolioProjects()[0] || allProjects[0];
}

export function inProgressProjects() {
  return allProjects.filter((project) => project.status === "in-progress");
}

export function portfolioProjects() {
  // Production portfolio: live websites, client platforms, and standalone applications
  return allProjects.filter((project) => {
    if (project.section === "portfolio") return true;
    if (project.section === "labs" || project.section === "hidden") return false;

    return (
      project.kind === "website" ||
      (project.status !== "in-progress" &&
        !project.tags.includes("experiment") &&
        project.kind !== "experiment" &&
        project.kind !== "tool")
    );
  });
}

export function labsProjects() {
  // Active labs: in-progress work, game experiments, AI workflow prototypes, and utility tools
  return allProjects.filter((project) => {
    if (project.section === "labs") return true;
    if (project.section === "portfolio" || project.section === "hidden") return false;

    return (
      project.status === "in-progress" ||
      project.tags.includes("experiment") ||
      project.kind === "experiment" ||
      project.kind === "tool" ||
      project.slug === "swgoh" ||
      project.slug === "prompt-builder" ||
      project.slug === "jobjar" ||
      project.slug === "holiday-concierge"
    );
  });
}

export function getProject(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}

export type Project = (typeof allProjects)[number];
