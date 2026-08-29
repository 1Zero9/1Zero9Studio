import type { MetadataRoute } from "next";
import { allProjects } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/projects",
    "/labs",
    "/about",
    "/contact",
    "/services",
    "/colophon",
  ].map((path) => ({
    url: new URL(path, site.url).toString(),
    lastModified: new Date(),
  }));

  const projectRoutes: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: new URL(`/projects/${project.slug}`, site.url).toString(),
    lastModified: new Date(project.updated ?? project.date),
  }));

  return [...staticRoutes, ...projectRoutes];
}
