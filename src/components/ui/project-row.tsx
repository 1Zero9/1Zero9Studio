import Image from "next/image";
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
        className="group grid gap-x-10 gap-y-5 py-10 sm:grid-cols-[3.5rem_1fr] md:grid-cols-[3.5rem_1fr_18rem] md:items-center"
      >
        <span
          aria-hidden="true"
          className="hidden font-mono text-sm text-faint sm:block"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="sm:col-start-2">
          <Heading className="font-display text-3xl tracking-tight transition-colors group-hover:text-muted sm:text-4xl">
            {project.title}
          </Heading>
          <p className="mt-3 max-w-2xl text-muted">{project.summary}</p>
          <Meta className="mt-4">
            {project.year} · {project.tags.join(" · ")}
          </Meta>
        </div>
        {project.cover && (
          <div className="overflow-hidden rounded-lg border border-border sm:col-start-2 md:col-start-3">
            <Image
              src={project.cover}
              alt={project.coverAlt ?? ""}
              width={1600}
              height={1000}
              sizes="(min-width: 768px) 18rem, 100vw"
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </Link>
    </li>
  );
}
