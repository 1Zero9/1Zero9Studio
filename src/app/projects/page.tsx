import { Container } from "@/components/layout/container";
import { ProjectExplorer, type ProjectPreview } from "@/components/portfolio/project-explorer";
import { allProjects } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Work",
  description: "Apps, websites and experiments designed and built by Stephen Cranfield.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects: ProjectPreview[] = allProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    year: project.year,
    kind: project.kind,
    accent: project.accent,
    cover: project.cover,
    coverAlt: project.coverAlt,
    tags: project.tags,
    status: project.status,
  }));

  return (
    <>
      <Container className="work-index-hero">
        <p>Work / {projects.length} projects</p>
        <h1>A growing index of ideas made real.</h1>
        <div>
          <p>
            Personal products, client websites and small experiments. Each one
            started with a question and ended as something people could use.
          </p>
          <span>Browse by type ↓</span>
        </div>
      </Container>
      <Container className="pb-32">
        <ProjectExplorer projects={projects} headingLevel="h2" />
      </Container>
    </>
  );
}
