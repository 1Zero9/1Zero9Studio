import { ProjectFilter } from "@/components/portfolio/project-filter";
import { allProjects } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Work & Projects",
  description:
    "Websites, progressive web apps, tools, and software designed and built by Stephen Cranfield at 1Zero9 Studio.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="work-section">
      <header className="section-header">
        <p className="section-eyebrow">Index · {allProjects.length} Projects</p>
        <h1 className="section-title">All Projects & Software</h1>
        <p className="section-subtitle">
          From full-scale community websites and client products to AI workflow tools and experimental software.
        </p>
      </header>

      <ProjectFilter projects={allProjects} />
    </div>
  );
}
