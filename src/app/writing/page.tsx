import Link from "next/link";
import { allWriting } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Notes",
  description: "Notes from making products, websites and experiments.",
  path: "/writing",
});

export default function WritingPage() {
  return (
    <div className="notes-page">
      <header>
        <p>Notes from the workshop</p>
        <h1>Thinking by<br /><em>making.</em></h1>
      </header>
      <div className="notes-page__list">
        {allWriting.map((post, index) => (
          <Link key={post.slug} href={`/writing/${post.slug}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{post.title}</strong>
            <small>{post.date} · {post.readingTime} min</small>
            <b aria-hidden="true">↗</b>
          </Link>
        ))}
      </div>
    </div>
  );
}
