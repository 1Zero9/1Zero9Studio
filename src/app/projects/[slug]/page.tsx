import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx/mdx";
import { JsonLd } from "@/components/seo/json-ld";
import { Prose } from "@/components/ui/prose";
import { allProjects, getLiveProject, getLiveProjects } from "@/lib/content";
import { projectJsonLd } from "@/lib/jsonld";
import { createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getLiveProject(slug);
  if (!project) return {};
  return createMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${slug}`,
  });
}

const kindLabels: Record<string, string> = {
  app: "Full-Stack App",
  pwa: "Progressive Web App",
  website: "Website",
  tool: "Developer Tool",
  experiment: "Lab Experiment",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getLiveProject(slug);
  if (!project) notFound();

  const liveList = await getLiveProjects();
  const index = liveList.findIndex((item) => item.slug === slug);
  const nextProject = liveList[(index + 1) % liveList.length];

  const isLive =
    project.status === "live" ||
    project.status === "featured" ||
    project.status === "active";
  const isWip = project.status === "in-progress";

  return (
    <article
      className="case-study"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      <JsonLd data={projectJsonLd(project)} />

      <Link href="/projects" className="case-study__back">
        <span aria-hidden="true">←</span>
        <span>Back to all projects</span>
      </Link>

      <header className="case-study__header">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="badge-kind">
            {kindLabels[project.kind] || project.kind}
          </span>
          <span className="font-mono text-xs text-muted">{project.year}</span>
          {isWip ? (
            <span className="badge-status-wip">
              <span className="pulse-dot wip" />
              Building Now
            </span>
          ) : isLive ? (
            <span className="badge-status-live">
              <span className="pulse-dot" />
              Live Product
            </span>
          ) : null}
        </div>

        <h1 className="case-study__title">{project.title}</h1>
        <p className="case-study__summary">{project.summary}</p>

        {/* Project Links */}
        {(project.url || project.repo || (project.links && project.links.length > 0)) && (
          <div className="case-study__links">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <span>Visit Live Project</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <span>Source Code</span>
                <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.links?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <span>{link.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}

        {/* Project Meta Bar */}
        <dl className="case-study__meta-bar">
          <div className="case-study__meta-item">
            <dt>Maker & Role</dt>
            <dd>1Zero9 Studio · Idea, Design & Build</dd>
          </div>
          <div className="case-study__meta-item">
            <dt>Focus & Tags</dt>
            <dd>{project.tags?.join(" · ") || "Web Software"}</dd>
          </div>
          {project.techStack && project.techStack.length > 0 && (
            <div className="case-study__meta-item">
              <dt>Tech Stack</dt>
              <dd>{project.techStack.join(", ")}</dd>
            </div>
          )}
          <div className="case-study__meta-item">
            <dt>Reading Time</dt>
            <dd>{project.readingTime || 3} min read</dd>
          </div>
        </dl>

        {/* Cover Screenshot */}
        {project.cover && (
          <div className="case-study__cover-wrapper">
            <Image
              src={project.cover}
              alt={project.coverAlt || project.title}
              width={1600}
              height={1000}
              priority
              sizes="(min-width: 1000px) 1000px, 100vw"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </header>

      {/* Highlights / Outcomes */}
      {project.highlights && project.highlights.length > 0 && (
        <section className="case-study__highlights" aria-label="Key highlights">
          <h3>Key Features & Outcomes</h3>
          <ul>
            {project.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {/* MDX Body Content */}
      <section className="mb-16">
        <Prose>
          {project.mdx ? (
            <Mdx code={project.mdx} />
          ) : (
            <div className="whitespace-pre-wrap">{project.content || project.summary}</div>
          )}
        </Prose>
      </section>

      {/* Image Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mb-16 flex flex-col gap-8" aria-label="Project Gallery">
          <h2 className="text-2xl font-bold text-fg">Gallery & Previews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((img, i) => (
              <figure key={i} className="rounded-xl overflow-hidden border border-border">
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                {img.caption && (
                  <figcaption className="p-3 text-xs text-muted font-mono bg-surface">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Next Project Navigator */}
      {nextProject && nextProject.slug !== project.slug && (
        <aside className="p-6 md:p-8 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4 mt-12 hover:border-border-hover transition-colors">
          <div>
            <span className="font-mono text-xs text-muted uppercase">Next Project</span>
            <h4 className="text-xl font-bold text-fg mt-1">
              <Link href={`/projects/${nextProject.slug}`} className="hover:underline">
                {nextProject.title}
              </Link>
            </h4>
            <p className="text-sm text-muted line-clamp-1 mt-0.5">{nextProject.summary}</p>
          </div>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="btn-secondary whitespace-nowrap"
          >
            <span>View</span>
            <span aria-hidden="true">→</span>
          </Link>
        </aside>
      )}
    </article>
  );
}
