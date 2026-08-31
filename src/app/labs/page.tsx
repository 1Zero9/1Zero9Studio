import { ProjectFilter } from "@/components/portfolio/project-filter";
import { getLiveLabsProjects } from "@/lib/content";
import { createMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Labs & Experiments",
  description:
    "Active workbench, in-progress products, AI workflows, and software experiments designed and built by 1Zero9 Studio.",
  path: "/labs",
});

export default async function LabsPage() {
  const projects = await getLiveLabsProjects();

  return (
    <div className="work-section">
      <header className="section-header">
        <p className="section-eyebrow">
          <span className="pulse-dot wip" />
          Labs & Active Workbench · {projects.length} Projects
        </p>
        <h1 className="section-title">Experimental Tools & Prototypes</h1>
        <p className="section-subtitle">
          In-progress products, AI workflows, game engines, and proof-of-concepts built to test hypotheses and learn through building.
        </p>
      </header>

      <ProjectFilter projects={projects} showFilterTabs={false} />
    </div>
  );
}
