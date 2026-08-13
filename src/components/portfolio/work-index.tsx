import Image from "next/image";
import { Reveal, RevealLink } from "@/components/motion/reveal";

export type WorkPreview = {
  slug: string;
  title: string;
  summary: string;
  kind: "app" | "pwa" | "website";
  year: string;
  accent: string;
  cover?: string;
  coverAlt?: string;
};

const groups = [
  { kind: "website" as const, label: "Websites", note: "Audience-first sites with a clear job to do." },
  { kind: "pwa" as const, label: "PWA Apps", note: "Installable products built with the reach of the web." },
  { kind: "app" as const, label: "Apps", note: "Useful software, tools and product experiments." },
];

export function WorkIndex({ projects }: { projects: WorkPreview[] }) {
  return (
    <div className="work-groups">
      {groups.map((group) => {
        const groupProjects = projects.filter((project) => project.kind === group.kind);
        return (
          <section className="work-group" id={group.kind} key={group.kind}>
            <Reveal as="header" className="work-group__header">
              <div>
                <p>{String(groupProjects.length).padStart(2, "0")} projects</p>
                <h2>{group.label}</h2>
              </div>
              <p>{group.note}</p>
            </Reveal>
            <div className="work-group__grid">
              {groupProjects.map((project, index) => (
                <RevealLink
                  href={`/projects/${project.slug}`}
                  className="work-card"
                  style={{ "--project": project.accent } as React.CSSProperties}
                  key={project.slug}
                  delay={index * 45}
                >
                  <div className="work-card__image">
                    {project.cover ? (
                      <Image
                        src={project.cover}
                        alt={project.coverAlt ?? ""}
                        width={1000}
                        height={625}
                        sizes="(min-width: 1000px) 31vw, (min-width: 640px) 48vw, 100vw"
                      />
                    ) : (
                      <span aria-hidden="true">{project.title.charAt(0)}</span>
                    )}
                  </div>
                  <div className="work-card__title">
                    <h3>{project.title}</h3>
                    <span>{project.year} ↗</span>
                  </div>
                  <p>{project.summary}</p>
                </RevealLink>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
