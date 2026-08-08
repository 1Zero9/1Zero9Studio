import Image from "next/image";
import Link from "next/link";
import { KineticHero } from "@/components/portfolio/kinetic-hero";
import { allProjects, featuredProjects } from "@/lib/content";

const kindLabel = { app: "App", website: "Website", experiment: "Experiment" };

export default function Home() {
  const featured = featuredProjects().slice(0, 5);
  const more = allProjects.filter((project) => !featured.some((item) => item.slug === project.slug));

  return (
    <>
      <KineticHero />

      <section className="elsewhere-strip">
        <p>Elsewhere</p>
        <h2>I lead governance, security and AI enablement work in enterprise IT. Here, I build the tools myself.</h2>
        <Link href="/about">More about the day job <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="work-overture" id="work">
        <p>Things I’ve made</p>
        <h2>
          Every project starts with a small itch—<em>something that could work better,</em>
          something I want to understand, or something that simply ought to exist.
        </h2>
      </section>

      <div className="project-chapters">
        {featured.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className={`project-chapter project-chapter--${(index % 5) + 1}`}
            style={{ "--project": project.accent } as React.CSSProperties}
          >
            <div className="project-chapter__number">{String(index + 1).padStart(2, "0")}</div>
            <div className="project-chapter__title">
              <p>{kindLabel[project.kind]} · {project.year}</p>
              <h2>{project.title}</h2>
            </div>
            <div className="project-chapter__visual">
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt={project.coverAlt ?? ""}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 900px) 68vw, 100vw"
                  priority={index === 0}
                />
              ) : (
                <span>{project.title.charAt(0)}</span>
              )}
            </div>
            <div className="project-chapter__summary">
              <p>{project.summary}</p>
              <span>Open the project ↗</span>
            </div>
            <div className="project-chapter__word" aria-hidden="true">{project.kind}</div>
          </Link>
        ))}
      </div>

      <section className="more-work">
        <div className="more-work__intro">
          <p>Also in the workshop</p>
          <h2>More products, sites and experiments.</h2>
        </div>
        <div className="more-work__list">
          {more.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              <span style={{ backgroundColor: project.accent }} aria-hidden="true" />
              <strong>{project.title}</strong>
              <small>{kindLabel[project.kind]} / {project.year}</small>
              <b aria-hidden="true">↗</b>
            </Link>
          ))}
        </div>
        <Link href="/projects" className="more-work__all">The complete project index <span>↗</span></Link>
      </section>

      <section className="maker-statement">
        <p>Behind 1Zero9</p>
        <h2>I’m Stephen. I make the idea, the interface and the thing underneath it.</h2>
        <div>
          <p>
            I care about the entire path from a half-formed thought to a product
            someone can actually use. This portfolio is the record of that process.
          </p>
          <Link href="/about">A little more about me ↗</Link>
        </div>
      </section>
    </>
  );
}
