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

export const projectFrontmatterSchema = z
  .object({
    title: z.string().min(1).max(80),
    summary: z.string().min(1).max(200),
    date: isoDate,
    updated: isoDate.optional(),
    tags: z.array(kebabTag).default([]),
    status: z.enum(["featured", "active", "archived"]).default("active"),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    url: z.url().optional(),
    repo: z.url().optional(),
    draft: z.boolean().default(false),
    order: z.number().optional(),
  })
  .refine((doc) => !doc.cover || Boolean(doc.coverAlt), {
    message: "coverAlt is required when cover is set",
  });

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
