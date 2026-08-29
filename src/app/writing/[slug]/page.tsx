import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Mdx } from "@/components/mdx/mdx";
import { JsonLd } from "@/components/seo/json-ld";
import { Prose } from "@/components/ui/prose";
import { allWriting, getPost } from "@/lib/content";
import { articleJsonLd } from "@/lib/jsonld";
import { createMetadata } from "@/lib/metadata";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allWriting.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const metadata = createMetadata({
    title: post.title,
    description: post.summary,
    path: `/writing/${post.slug}`,
  });
  if (post.canonical) {
    metadata.alternates = { canonical: post.canonical };
  }
  return metadata;
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <JsonLd data={articleJsonLd(post)} />

      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg mb-8 transition-colors"
      >
        <span aria-hidden="true">←</span>
        <span>Back to all notes</span>
      </Link>

      <header className="mb-10">
        <span className="font-mono text-xs text-signal uppercase tracking-wider block mb-2">
          {post.date} · {post.readingTime} min read
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-lg sm:text-xl text-muted leading-relaxed">
          {post.summary}
        </p>
      </header>

      <div className="border-t border-border pt-10">
        <Prose>
          <Mdx code={post.mdx} />
        </Prose>
      </div>
    </Container>
  );
}
