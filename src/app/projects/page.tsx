import { Container } from "@/components/layout/container";
import { ProjectRow } from "@/components/ui/project-row";
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
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
        projects
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Real work, told as complete stories — the problem, the thinking, the
        build, and what it taught me.
      </p>

      <ul className="mt-16">
        {allProjects.map((project, i) => (
          <ProjectRow
            key={project.slug}
            project={project}
            index={i}
            headingLevel="h2"
          />
        ))}
      </ul>
    </Container>
  );
}
