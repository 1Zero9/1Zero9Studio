import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Mdx } from "@/components/mdx/mdx";
import { JsonLd } from "@/components/seo/json-ld";
import { Meta } from "@/components/ui/meta";
import { Prose } from "@/components/ui/prose";
import { Tag } from "@/components/ui/tag";
import { TextLink } from "@/components/ui/text-link";
import {
  allProjects,
  getProject,
  getProjectLinks,
  getProjectMedia,
  getProjectOutcomes,
} from "@/lib/content";
import { projectJsonLd } from "@/lib/jsonld";
import { createMetadata } from "@/lib/metadata";

type Params = { slug: string };

export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return createMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const [media, links, outcomes] = await Promise.all([
    getProjectMedia(slug),
    getProjectLinks(slug),
    getProjectOutcomes(slug),
  ]);

  return (
    <Container className="py-16">
      <JsonLd data={projectJsonLd(project)} />
      <header className="max-w-3xl">
        <Meta>
          {project.year} · {project.readingTime} min read
        </Meta>
        <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 text-lg text-muted">{project.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        {(project.url ?? project.repo ?? links.length > 0) && (
          <p className="mt-6 flex flex-wrap gap-6 text-sm">
            {project.url && <TextLink href={project.url}>visit</TextLink>}
            {project.repo && <TextLink href={project.repo}>source</TextLink>}
            {links.map((link) => (
              <TextLink key={link.id} href={link.url}>
                {link.label}
              </TextLink>
            ))}
          </p>
        )}
      </header>

      {project.cover && (
        <div className="mt-12 overflow-hidden rounded-xl border border-border">
          <Image
            src={project.cover}
            alt={project.coverAlt ?? ""}
            width={1600}
            height={1000}
            sizes="(min-width: 1024px) 60rem, 100vw"
            priority
            className="w-full"
          />
        </div>
      )}

      {outcomes.length > 0 && (
        <section
          aria-label="Outcomes"
          className="mt-12 rounded-md border border-border p-6 sm:p-8"
        >
          <h2 className="flex items-center gap-3 font-mono text-xs tracking-wide text-faint">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
            outcomes
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {outcomes.map((outcome) => (
              <li key={outcome.id} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-fg">{outcome.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 border-t border-border pt-12">
        <Prose>
          <Mdx code={project.mdx} />
        </Prose>
      </div>

      {media.length > 0 && (
        <div className="mt-12 grid gap-4 border-t border-border pt-12 sm:grid-cols-2">
          {media.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-border"
            >
              <Image
                src={item.url}
                alt={item.alt}
                width={1200}
                height={750}
                sizes="(min-width: 1024px) 30rem, 100vw"
                className="w-full"
              />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
