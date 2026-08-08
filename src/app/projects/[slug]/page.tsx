import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Mdx } from "@/components/mdx/mdx";
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
  const projectIndex = allProjects.findIndex((item) => item.slug === slug);
  const nextProject = allProjects[(projectIndex + 1) % allProjects.length];

  return (
    <article className="project-page" style={{ "--project-accent": project.accent } as React.CSSProperties}>
      <JsonLd data={projectJsonLd(project)} />
      <Container className="project-page__hero">
        <Link href="/projects" className="project-page__back">← All work</Link>
        <div className="project-page__title-row">
          <div>
            <p>{kindLabel[project.kind]} · {project.year}</p>
            <h1>{project.title}</h1>
          </div>
          <p>{project.summary}</p>
        </div>
        <div className="project-page__meta">
          <p><span>Focus</span>{project.tags.join(" / ")}</p>
          <p><span>Status</span>{project.status === "featured" ? "Selected work" : "Built & shipped"}</p>
          <p><span>Role</span>Idea · design · build</p>
          {(project.url || project.repo || links.length > 0) && (
            <div>
              {project.url && <a href={project.url}>Open live project ↗</a>}
              {project.repo && <a href={project.repo}>View source ↗</a>}
              {links.map((link) => <a key={link.id} href={link.url}>{link.label} ↗</a>)}
            </div>
          )}
        </div>
      </Container>

      {project.cover ? (
        <Container className="project-page__cover-wrap">
          <div className="project-page__cover">
            <div className="project-page__cover-chrome"><span /><span /><span /><p>{project.slug}.1zero9.com</p></div>
            <Image src={project.cover} alt={project.coverAlt ?? ""} width={1600} height={1000} priority sizes="100vw" />
          </div>
        </Container>
      ) : (
        <div className="project-page__colour-field"><span>{project.title.charAt(0)}</span></div>
      )}

      <Container className="project-page__story">
        <aside>
          <p>Project story</p>
          <span>{project.readingTime} minute read</span>
        </aside>
        <div>
          {outcomes.length > 0 && (
            <section className="project-page__outcomes" aria-label="Outcomes">
              {outcomes.map((outcome, index) => (
                <div key={outcome.id}><span>{String(index + 1).padStart(2, "0")}</span><p>{outcome.text}</p></div>
              ))}
            </section>
          )}
          <Prose><Mdx code={project.mdx} /></Prose>
        </div>
      </Container>

      {media.length > 0 && (
        <Container className="project-page__gallery">
          {media.map((item, index) => (
            <figure key={item.id} className={index % 3 === 0 ? "project-page__gallery-wide" : ""}>
              <Image src={item.url} alt={item.alt} width={1600} height={1000} sizes="(min-width: 900px) 70vw, 100vw" />
              <figcaption>{String(index + 1).padStart(2, "0")} / {item.alt}</figcaption>
            </figure>
          ))}
        </Container>
      )}

      {nextProject && (
        <Link href={`/projects/${nextProject.slug}`} className="project-page__next">
          <Container>
            <p>Next project</p>
            <div><span>{nextProject.title}</span><b>↗</b></div>
          </Container>
        </Link>
      )}
    </article>
  );
}
