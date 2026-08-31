import { z } from "zod";

export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const kebabTag = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Tags are lowercase kebab-case");

export const projectSlug = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Slugs are lowercase kebab-case");

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const projectMediaSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
});

export const projectFrontmatterSchema = z
  .object({
    title: z.string().min(1).max(100),
    summary: z.string().min(1).max(300),
    date: isoDate,
    updated: isoDate.optional(),
    tags: z.array(z.string()).default([]),
    techStack: z.array(z.string()).default([]),
    kind: z.enum(["website", "app", "pwa", "tool", "experiment"]).default("app"),
    accent: z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex colour")
      .default("#3855d6"),
    status: z
      .enum(["live", "in-progress", "featured", "active", "concept", "archived"])
      .default("live"),
    section: z.enum(["portfolio", "labs", "hidden"]).optional(),
    featured: z.boolean().default(false),
    featuredOnHome: z.boolean().default(false).optional(),
    wipProgress: z.string().optional(), // e.g. "Phase 2 · Active Beta"
    wipNote: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    links: z.array(projectLinkSchema).default([]),
    gallery: z.array(projectMediaSchema).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    url: z.string().url().optional().or(z.literal("")),
    repo: z.string().url().optional().or(z.literal("")),
    draft: z.boolean().default(false),
    order: z.number().optional(),
  })
  .refine((doc) => !doc.cover || Boolean(doc.coverAlt), {
    message: "coverAlt is required when cover is set",
  });

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type ProjectLink = z.infer<typeof projectLinkSchema>;
export type ProjectMedia = z.infer<typeof projectMediaSchema>;
