import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";
import { Reveal } from "@/components/motion/reveal";
import { allProjects } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Projects",
  description:
    "Real work, told as complete stories — the problem, the thinking, the build, and what it taught me.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl tracking-tight">projects</h1>
      <p className="mt-4 max-w-prose text-muted">
        Real work, told as complete stories — the problem, the thinking, the
        build, and what it taught me.
      </p>

      <ul className="mt-16">
        {allProjects.map((project, i) => (
          <li key={project.slug} className="border-t border-border">
            <Reveal delay={i * 0.05}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block py-8"
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h2 className="font-display text-2xl tracking-tight transition-colors group-hover:text-muted">
                    {project.title}
                  </h2>
                  <Meta>{project.year}</Meta>
                </div>
                <p className="mt-2 max-w-prose text-sm text-muted">
                  {project.summary}
                </p>
                <Meta className="mt-4">{project.tags.join(" · ")}</Meta>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  );
}
