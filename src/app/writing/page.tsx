import Link from "next/link";
import { Container } from "@/components/layout/container";
import { allWriting } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Notes & Writing",
  description: "Notes, reflections, and insights from designing and building software at 1Zero9 Studio.",
  path: "/writing",
});

export default function WritingPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <header className="mb-12">
        <p className="font-mono text-xs text-signal uppercase tracking-wider mb-3">
          Notes / Thinking by Making
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight">
          Field notes & reflections.
        </h1>
        <p className="text-muted text-base sm:text-lg mt-3 max-w-xl">
          Observations on software design, AI systems, developer tooling, and independent product craft.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {allWriting.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="p-6 rounded-2xl bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div>
              <span className="font-mono text-xs text-muted block mb-1">
                {post.date} · {post.readingTime} min read
              </span>
              <h2 className="text-xl font-bold text-fg group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted line-clamp-2 mt-1">
                {post.summary}
              </p>
            </div>
            <span className="text-muted group-hover:text-fg group-hover:translate-x-1 transition-all text-xl font-mono">
              →
            </span>
          </Link>
        ))}

        {allWriting.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-surface border border-border text-muted">
            No notes published yet.
          </div>
        )}
      </div>
    </Container>
  );
}
