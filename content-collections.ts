import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX, type Options } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { projectFrontmatterSchema } from "./src/lib/project-schema";

const mdxOptions: Options = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: "wrap" }],
    [
      rehypePrettyCode,
      {
        theme: {
          dark: "github-dark-default",
          light: "github-light-high-contrast",
        },
        keepBackground: false,
      },
    ],
  ],
};

function readingTime(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}

const projects = defineCollection({
  name: "projects",
  directory: "content/projects",
  include: "*/index.mdx",
  schema: projectFrontmatterSchema,
  transform: async (doc, ctx) => {
    const mdx = await compileMDX(ctx, doc, mdxOptions);
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
