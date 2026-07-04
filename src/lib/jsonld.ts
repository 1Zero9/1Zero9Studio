import type { CreativeWork, Person, WebSite, WithContext } from "schema-dts";
import type { Project } from "@/lib/content";
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
