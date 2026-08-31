import Link from "next/link";
import { ProjectFilter } from "@/components/portfolio/project-filter";
import { portfolioProjects } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Portfolio — Production Work & Platforms",
  description:
    "Production-grade websites, progressive web apps, and software engineered by 1Zero9 Studio.",
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = portfolioProjects();

  return (
    <div className="work-section">
      <header className="section-header">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-eyebrow">Portfolio · {projects.length} Projects</p>
            <h1 className="section-title">Production Work & Platforms</h1>
          </div>
          <Link href="/labs" className="btn-secondary text-sm">
            <span>Explore Active Labs</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="section-subtitle">
          Live client websites, community platforms, and standalone products built from concept to launch with clean UX, responsive design, and solid engineering.
        </p>
      </header>

      <ProjectFilter projects={projects} showFilterTabs={true} />
    </div>
  );
}
