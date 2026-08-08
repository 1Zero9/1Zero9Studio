import { WorkIndex, type WorkPreview } from "@/components/portfolio/work-index";
import { allProjects } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Work",
  description: "Apps, websites and experiments imagined, designed and built by Stephen Cranfield.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects: WorkPreview[] = allProjects.map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    kind: project.kind,
    year: project.year,
    accent: project.accent,
    cover: project.cover,
    coverAlt: project.coverAlt,
  }));

  return (
    <div className="work-page">
      <header className="work-page__hero">
        <p>Project index / {projects.length} things so far</p>
        <h1>Made from curiosity.<br /><em>Finished with intent.</em></h1>
        <span>Move through the list to explore ↓</span>
      </header>
      <WorkIndex projects={projects} />
    </div>
  );
}
