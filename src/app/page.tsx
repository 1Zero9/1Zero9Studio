import Image from "next/image";
import Link from "next/link";
import { KineticHero } from "@/components/portfolio/kinetic-hero";
import { Reveal, RevealLink } from "@/components/motion/reveal";
import { allProjects, type Project } from "@/lib/content";

const categories = [
  {
    kind: "website" as const,
    label: "Websites",
    description: "Clear, responsive sites built around a real audience and a real outcome.",
  },
  {
    kind: "pwa" as const,
    label: "PWA Apps",
    description: "Installable web products that bring app-like utility to any device.",
  },
  {
    kind: "app" as const,
    label: "Apps",
    description: "Purpose-built tools, product experiments and end-to-end software.",
  },
];

function ProjectTile({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="portfolio-project"
      style={{ "--project": project.accent } as React.CSSProperties}
    >
      <div className="portfolio-project__image">
        {project.cover ? (
          <Image
            src={project.cover}
            alt={project.coverAlt ?? ""}
            width={1200}
            height={750}
            sizes="(min-width: 900px) 46vw, 100vw"
            priority={priority}
          />
        ) : (
          <span aria-hidden="true">{project.title.charAt(0)}</span>
        )}
      </div>
      <div className="portfolio-project__meta">
        <div>
          <p>{project.year}</p>
          <h3>{project.title}</h3>
        </div>
        <span aria-hidden="true">↗</span>
      </div>
      <p className="portfolio-project__summary">{project.summary}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <KineticHero />

      <Reveal as="section" className="portfolio-context">
        <div className="portfolio-context__label">
          <p className="portfolio-eyebrow">What this work shows</p>
          <span>02</span>
        </div>
        <div className="portfolio-context__copy">
          <h2>The work covers product thinking, interface design and development.</h2>
          <p>
            These are independently made projects rather than visual concepts. Each
            case study records the problem, the choices I made and how the finished
            product was built.
          </p>
        </div>
        <dl className="portfolio-context__facts">
          <div><dt>Projects</dt><dd>{allProjects.length}</dd></div>
          <div><dt>Websites</dt><dd>{allProjects.filter((project) => project.kind === "website").length}</dd></div>
          <div><dt>PWA Apps</dt><dd>{allProjects.filter((project) => project.kind === "pwa").length}</dd></div>
          <div><dt>Apps</dt><dd>{allProjects.filter((project) => project.kind === "app").length}</dd></div>
        </dl>
      </Reveal>

      <section className="portfolio-work" id="work">
        <Reveal as="header" className="portfolio-work__header">
          <p className="portfolio-eyebrow">03 / Selected work</p>
          <h2>Websites, PWA apps<br />and software.</h2>
        </Reveal>

        <nav className="portfolio-categories" aria-label="Project categories">
          {categories.map((category, index) => {
            const count = allProjects.filter((project) => project.kind === category.kind).length;
            return (
              <RevealLink
                href={`#${category.kind}`}
                key={category.kind}
                delay={index * 60}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{category.label}</strong>
                <p>{category.description}</p>
                <small>{count} {count === 1 ? "project" : "projects"}</small>
              </RevealLink>
            );
          })}
        </nav>

        <div className="portfolio-groups">
          {categories.map((category) => {
            const projects = allProjects
              .filter((project) => project.kind === category.kind)
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
              .slice(0, 2);

            return (
              <Reveal as="section" className={`portfolio-group portfolio-group--${category.kind}`} id={category.kind} key={category.kind}>
                <header className="portfolio-group__header">
                  <div>
                    <p className="portfolio-eyebrow">{category.label}</p>
                    <h2>{category.description}</h2>
                  </div>
                  <Link href={`/projects#${category.kind}`}>View all <span aria-hidden="true">↗</span></Link>
                </header>
                <div className="portfolio-group__grid">
                  {projects.map((project, index) => (
                    <ProjectTile key={project.slug} project={project} priority={category.kind === "website" && index === 0} />
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <Reveal as="section" className="portfolio-close">
        <p className="portfolio-eyebrow">04 / Beyond the side projects</p>
        <h2>By day, I work in governance, security and AI enablement within enterprise IT.</h2>
        <Link href="/about">More about how I work <span aria-hidden="true">↗</span></Link>
      </Reveal>
    </>
  );
}
