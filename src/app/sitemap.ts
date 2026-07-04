import type { MetadataRoute } from "next";
import { allProjects, allWriting } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/projects",
    "/writing",
    "/about",
    "/colophon",
  ].map(
    (path) => ({
      url: new URL(path, site.url).toString(),
      lastModified: new Date(),
    }),
  );

  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: new URL(`/projects/${project.slug}`, site.url).toString(),
    lastModified: new Date(project.updated ?? project.date),
  }));

  const writingRoutes: MetadataRoute.Sitemap = allWriting.map((post) => ({
    url: new URL(`/writing/${post.slug}`, site.url).toString(),
    lastModified: new Date(post.updated ?? post.date),
  }));

  return [...staticRoutes, ...projectRoutes, ...writingRoutes];
}
