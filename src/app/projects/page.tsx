import { WorkIndex, type WorkPreview } from "@/components/portfolio/work-index";
import { Reveal } from "@/components/motion/reveal";
import { allProjects } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Work",
  description: "Websites, progressive web apps and software imagined, designed and built by Stephen Cranfield.",
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
      <Reveal as="header" className="work-page__hero">
        <p>Project index · {projects.length} projects</p>
        <h1>A record of things<br /><em>I’ve made.</em></h1>
        <span>Websites · PWA Apps · Apps</span>
      </Reveal>
      <WorkIndex projects={projects} />
    </div>
  );
}
