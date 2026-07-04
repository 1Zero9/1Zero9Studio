import type {
  Article,
  CreativeWork,
  Person,
  WebSite,
  WithContext,
} from "schema-dts";
import type { Post, Project } from "@/lib/content";
import { site } from "@/lib/site";

export const personJsonLd: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.author.name,
  url: site.url,
  email: site.author.email,
};

export const webSiteJsonLd: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  author: { "@type": "Person", name: site.author.name },
};

export function articleJsonLd(post: Post): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    ...(post.updated ? { dateModified: post.updated } : {}),
    url: new URL(`/writing/${post.slug}`, site.url).toString(),
    author: { "@type": "Person", name: site.author.name },
    keywords: post.tags.join(", "),
  };
}

export function projectJsonLd(project: Project): WithContext<CreativeWork> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    dateCreated: project.date,
    ...(project.updated ? { dateModified: project.updated } : {}),
    url: new URL(`/projects/${project.slug}`, site.url).toString(),
    author: { "@type": "Person", name: site.author.name },
    keywords: project.tags.join(", "),
  };
}
