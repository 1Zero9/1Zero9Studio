/*
 * The only import surface for content collections. If the loader ever
 * needs replacing, this file is the swap point — routes and components
 * stay untouched.
 */
import { allProjects as generatedProjects } from "content-collections";

const hideDrafts = process.env.NODE_ENV === "production";

export const allProjects = generatedProjects
  .filter((project) => !hideDrafts || !project.draft)
  .filter((project) => project.status !== "archived")
  .sort((a, b) => b.date.localeCompare(a.date));

export function featuredProjects() {
  return allProjects
    .filter((project) => project.status === "featured")
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getProject(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}

export type Project = (typeof allProjects)[number];
