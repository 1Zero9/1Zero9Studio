import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";
import { allWriting } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Writing",
  description: "Essays and build notes — what the work taught me.",
  path: "/writing",
});

export default function WritingPage() {
  const byYear = new Map<string, typeof allWriting>();
  for (const post of allWriting) {
    const list = byYear.get(post.year) ?? [];
    list.push(post);
    byYear.set(post.year, list);
  }

  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl tracking-tight">writing</h1>
      <p className="mt-4 max-w-prose text-muted">
        Essays and build notes — what the work taught me.
      </p>

      {[...byYear.entries()].map(([year, posts]) => (
        <section key={year} className="mt-16" aria-labelledby={`year-${year}`}>
          <h2
            id={`year-${year}`}
            className="mb-4 font-mono text-xs tracking-wide text-faint"
          >
            {year}
          </h2>
          <ul>
            {posts.map((post) => (
              <li key={post.slug} className="border-t border-border">
                <Link
                  href={`/writing/${post.slug}`}
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span className="font-display text-xl tracking-tight transition-colors group-hover:text-muted">
                    {post.title}
                  </span>
                  <Meta>{post.date}</Meta>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
