import Link from "next/link";
import type { Project } from "@/lib/content";
import { Meta } from "@/components/ui/meta";

export function ProjectRow({
  project,
  index,
  headingLevel = "h3",
}: {
  project: Project;
  index: number;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;

  return (
    <li className="border-t border-border">
      <Link
        href={`/projects/${project.slug}`}
        className="group grid gap-x-8 gap-y-3 py-10 sm:grid-cols-[3.5rem_1fr_auto] sm:items-baseline"
      >
        <span
          aria-hidden="true"
          className="hidden font-mono text-sm text-faint sm:block"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <Heading className="font-display text-3xl tracking-tight transition-colors group-hover:text-muted sm:text-4xl">
            {project.title}
          </Heading>
          <p className="mt-3 max-w-2xl text-muted">{project.summary}</p>
          <Meta className="mt-4">
            {project.year} · {project.tags.join(" · ")}
          </Meta>
        </div>
        <span
          aria-hidden="true"
          className="hidden font-mono text-lg text-faint transition-all group-hover:translate-x-1 group-hover:text-accent sm:block"
        >
          &rarr;
        </span>
      </Link>
    </li>
  );
}
