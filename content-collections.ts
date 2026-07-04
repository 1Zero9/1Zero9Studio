import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const kebabTag = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Tags are lowercase kebab-case");

function readingTime(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "*/index.mdx",
  schema: z
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
    }),
  transform: async (doc, ctx) => {
    const mdx = await compileMDX(ctx, doc);
    return {
      ...doc,
      slug: doc._meta.directory,
      year: doc.date.slice(0, 4),
      readingTime: readingTime(doc.content),
      mdx,
    };
  },
});

export default defineConfig({
  collections: [projects],
});
