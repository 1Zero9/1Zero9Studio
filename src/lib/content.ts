/*
 * The only import surface for content collections. If the loader ever
 * needs replacing, this file is the swap point — routes and components
 * stay untouched.
 */
import {
  allProjects as generatedProjects,
  allWritings as generatedWriting,
} from "content-collections";
import { prisma } from "@/lib/db";

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

// Admin-managed screenshots/links per project, stored in Postgres and keyed
// by MDX slug. Kept separate from getProject() so build-time-only call sites
// (generateMetadata, opengraph-image) never touch the database.
export function getProjectMedia(slug: string) {
  return prisma.projectMedia.findMany({
    where: { projectSlug: slug },
    orderBy: { order: "asc" },
  });
}

export function getProjectLinks(slug: string) {
  return prisma.projectLink.findMany({
    where: { projectSlug: slug },
    orderBy: { order: "asc" },
  });
}

export const allWriting = generatedWriting
  .filter((post) => !hideDrafts || !post.draft)
  .filter((post) => post.status !== "archived")
  .sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string) {
  return allWriting.find((post) => post.slug === slug);
}

export type Post = (typeof allWriting)[number];
