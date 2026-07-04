import { Feed } from "feed";
import { allWriting } from "@/lib/content";
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

  for (const post of allWriting) {
    const url = new URL(`/writing/${post.slug}`, site.url).toString();
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.summary,
      date: new Date(post.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
