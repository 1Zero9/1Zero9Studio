import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { Logo } from "@/components/brand/logo";
import { Meta } from "@/components/ui/meta";

export function ProjectCard({
  project,
  lead = false,
}: {
  project: Project;
  lead?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/60 ${
        lead ? "sm:col-span-2" : ""
      }`}
    >
      {project.cover ? (
        <div className="overflow-hidden border-b border-border">
          <Image
            src={project.cover}
            alt={project.coverAlt ?? ""}
            width={1600}
            height={1000}
            sizes={
              lead ? "(min-width: 1100px) 64rem, 100vw" : "(min-width: 1024px) 32rem, 100vw"
            }
            className={`w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] ${
              lead ? "aspect-[21/9]" : "aspect-[16/10]"
            }`}
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center border-b border-border text-border transition-colors group-hover:text-faint">
          <Logo className="h-14 w-auto" title="" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>
        <Meta className="mt-5 flex items-center justify-between">
          <span>
            {project.year} · {project.tags.join(" · ")}
          </span>
          <span
            aria-hidden="true"
            className="transition-all group-hover:translate-x-1 group-hover:text-accent"
          >
            &rarr;
          </span>
        </Meta>
      </div>
    </Link>
  );
}
