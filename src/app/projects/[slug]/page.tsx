import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx/mdx";
import { Reveal, RevealLink } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { Prose } from "@/components/ui/prose";
import { allProjects, getProject, getProjectLinks, getProjectMedia, getProjectOutcomes } from "@/lib/content";
import { projectJsonLd } from "@/lib/jsonld";
import { createMetadata } from "@/lib/metadata";

type Params = { slug: string };
export const revalidate = 3600;

export function generateStaticParams(): Params[] {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return createMetadata({ title: project.title, description: project.summary, path: `/projects/${slug}` });
}

const kindLabel = { app: "App", website: "Website", experiment: "Experiment" };

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const [media, links, outcomes] = await Promise.all([
    getProjectMedia(slug),
    getProjectLinks(slug),
    getProjectOutcomes(slug),
  ]);
  const index = allProjects.findIndex((item) => item.slug === slug);
  const next = allProjects[(index + 1) % allProjects.length];

  return (
    <article className="story" style={{ "--project": project.accent } as React.CSSProperties}>
      <JsonLd data={projectJsonLd(project)} />
      <Reveal as="header" className="story-hero" glow="light">
        <Link href="/projects" className="story-hero__back">All work ←</Link>
        <div className="story-hero__intro">
          <p>{kindLabel[project.kind]} / {project.year}</p>
          <h1>{project.title}</h1>
          <div>
            <p>{project.summary}</p>
            {(project.url || project.repo || links.length > 0) && (
              <nav aria-label="Project links">
                {project.url && <a href={project.url}>Visit the live project ↗</a>}
                {project.repo && <a href={project.repo}>See the source ↗</a>}
                {links.map((link) => <a key={link.id} href={link.url}>{link.label} ↗</a>)}
              </nav>
            )}
          </div>
        </div>
        {project.cover ? (
          <div className="story-hero__image">
            <Image src={project.cover} alt={project.coverAlt ?? ""} width={1600} height={1000} priority sizes="100vw" />
          </div>
        ) : (
          <div className="story-hero__letter">{project.title.charAt(0)}</div>
        )}
        <div className="story-hero__facts">
          <p><span>Made by</span>Stephen Cranfield</p>
          <p><span>Role</span>Idea, design & build</p>
          <p><span>Focus</span>{project.tags.join(" · ")}</p>
          <p><span>Read</span>{project.readingTime} minutes</p>
        </div>
      </Reveal>

      <section className="story-body">
        <aside><span>The story</span><p>From the first thought to the working product.</p></aside>
        <div className="story-body__content">
          {outcomes.length > 0 && (
            <section className="story-outcomes" aria-label="What the project achieved">
              {outcomes.map((outcome, outcomeIndex) => (
                <Reveal as="div" key={outcome.id} delay={outcomeIndex * 60}>
                  <span>{String(outcomeIndex + 1).padStart(2, "0")}</span>
                  <p>{outcome.text}</p>
                </Reveal>
              ))}
            </section>
          )}
          <Prose><Mdx code={project.mdx} /></Prose>
        </div>
      </section>

      {media.length > 0 && (
        <Reveal as="section" className="story-gallery" glow="dark">
          {media.map((item, mediaIndex) => (
            <Reveal
              as="figure"
              key={item.id}
              className={`story-gallery__item story-gallery__item--${(mediaIndex % 3) + 1}`}
              delay={mediaIndex * 70}
            >
              <Image src={item.url} alt={item.alt} width={1600} height={1000} sizes="(min-width: 900px) 70vw, 100vw" />
              <figcaption>{item.alt}</figcaption>
            </Reveal>
          ))}
        </Reveal>
      )}

      {next && (
        <RevealLink href={`/projects/${next.slug}`} className="story-next" style={{ "--next": next.accent } as React.CSSProperties} glow="light">
          <p>Next thing</p>
          <span>{next.title}</span>
          <b aria-hidden="true">↗</b>
        </RevealLink>
      )}
    </article>
  );
}
