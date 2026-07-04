import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Mdx } from "@/components/mdx/mdx";
import { JsonLd } from "@/components/seo/json-ld";
import { Meta } from "@/components/ui/meta";
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
    <Container className="py-16">
      <JsonLd data={articleJsonLd(post)} />
      <header className="max-w-3xl">
        <Meta>
          {post.date} · {post.readingTime} min read
        </Meta>
        <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight sm:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 text-lg text-muted">{post.summary}</p>
      </header>

      <div className="mt-12 border-t border-border pt-12">
        <Prose>
          <Mdx code={post.mdx} />
        </Prose>
      </div>
    </Container>
  );
}
