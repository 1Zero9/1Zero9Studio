// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { z } from "zod";
var isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
var kebabTag = z.string().regex(/^[a-z0-9-]+$/, "Tags are lowercase kebab-case");
var mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [
      rehypePrettyCode,
      {
        theme: { dark: "github-dark-default", light: "github-light-default" },
        keepBackground: false
      }
    ]
  ]
};
function readingTime(text) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}
var projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "*/index.mdx",
  schema: z.object({
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
    order: z.number().optional()
  }).refine((doc) => !doc.cover || Boolean(doc.coverAlt), {
    message: "coverAlt is required when cover is set"
  }),
  transform: async (doc, ctx) => {
    const mdx = await compileMDX(ctx, doc, mdxOptions);
    return {
      ...doc,
      slug: doc._meta.directory,
      year: doc.date.slice(0, 4),
      readingTime: readingTime(doc.content),
      mdx
    };
  }
});
var writing = defineCollection({
  name: "writing",
  directory: "content/writing",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string().min(1).max(80),
    summary: z.string().min(1).max(200),
    date: isoDate,
    updated: isoDate.optional(),
    tags: z.array(kebabTag).default([]),
    status: z.enum(["featured", "published", "archived"]).default("published"),
    canonical: z.url().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false)
  }).refine((doc) => !doc.cover || Boolean(doc.coverAlt), {
    message: "coverAlt is required when cover is set"
  }),
  transform: async (doc, ctx) => {
    const mdx = await compileMDX(ctx, doc, mdxOptions);
    const fileName = doc._meta.fileName.replace(/\.mdx$/, "");
    return {
      ...doc,
      slug: fileName,
      year: doc.date.slice(0, 4),
      readingTime: readingTime(doc.content),
      mdx
    };
  }
});
var content_collections_default = defineConfig({
  collections: [projects, writing]
});
export {
  content_collections_default as default
};
