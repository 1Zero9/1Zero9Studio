import { Reveal, RevealLink } from "@/components/motion/reveal";
import { allWriting } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Notes",
  description: "Notes from making products, websites and software.",
  path: "/writing",
});

export default function WritingPage() {
  return (
    <div className="notes-page">
      <Reveal as="header">
        <p>Notes from the workshop</p>
        <h1>Thinking by<br /><em>making.</em></h1>
      </Reveal>
      <div className="notes-page__list">
        {allWriting.map((post, index) => (
          <RevealLink key={post.slug} href={`/writing/${post.slug}`} delay={index * 45}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{post.title}</strong>
            <small>{post.date} · {post.readingTime} min</small>
            <b aria-hidden="true">↗</b>
          </RevealLink>
        ))}
      </div>
    </div>
  );
}
