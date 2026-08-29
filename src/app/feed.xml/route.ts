import { Feed } from "feed";
import { allProjects } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const feed = new Feed({
    title: site.name,
    description: site.description,
    id: site.url,
    link: site.url,
    language: "en",
    copyright: `© ${new Date().getFullYear()} ${site.author.name}`,
    feedLinks: {
      rss: new URL("/feed.xml", site.url).toString(),
    },
    author: {
      name: site.author.name,
      email: site.author.email,
      link: site.url,
    },
  });

  for (const project of allProjects) {
    const url = new URL(`/projects/${project.slug}`, site.url).toString();
    feed.addItem({
      title: project.title,
      id: url,
      link: url,
      description: project.summary,
      date: new Date(project.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
