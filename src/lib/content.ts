/*
 * The single source of truth for content data.
 * Pure static, type-safe, and zero database overhead.
 */
import {
  allProjects as generatedProjects,
  allWritings as generatedWriting,
} from "content-collections";

const hideDrafts = process.env.NODE_ENV === "production";

export const allProjects = generatedProjects
  .filter((project) => project.slug !== "_template")
  .filter((project) => !hideDrafts || !project.draft)
  .filter((project) => project.status !== "archived")
  .sort((a, b) => {
    // Priority order if specified, else sort by date descending
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

export function liveProjects() {
  return allProjects.filter(
    (project) =>
      project.status === "live" ||
      project.status === "featured" ||
      project.status === "active",
  );
}

export function getProject(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}

export type Project = (typeof allProjects)[number];

export const allWriting = generatedWriting
  .filter((post) => !hideDrafts || !post.draft)
  .filter((post) => post.status !== "archived")
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string) {
  return allWriting.find((post) => post.slug === slug);
}

export type Post = (typeof allWriting)[number];
