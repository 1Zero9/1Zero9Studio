import Link from "next/link";
import { Meta } from "@/components/ui/meta";
import { TextLink } from "@/components/ui/text-link";
import { allProjects } from "@/lib/content";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-tight">Projects</h1>
        <TextLink href="/admin/projects/new">+ new project</TextLink>
      </div>
      <p className="mt-2 text-sm text-muted">
        Edit case studies, screenshots, outcomes and links for each project.
      </p>
      {created && (
        <p className="mt-4 rounded-md border border-border p-3 text-sm text-muted" role="status">
          “{created}” committed — it appears here and on the site once the
          deploy finishes (~2–3 minutes).
        </p>
      )}
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {allProjects.map((project) => (
          <li key={project.slug} className="flex items-center justify-between py-4">
            <div>
              <Link
                href={`/admin/projects/${project.slug}`}
                className="font-medium hover:text-muted"
              >
                {project.title}
              </Link>
              <Meta className="mt-1">{project.slug}</Meta>
            </div>
            <div className="flex gap-4">
              <TextLink href={`/admin/projects/${project.slug}/edit`}>edit</TextLink>
              <TextLink href={`/admin/projects/${project.slug}`}>manage</TextLink>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-10 flex flex-wrap gap-6 text-sm">
        <TextLink href="/admin/testimonials">testimonials</TextLink>
        <TextLink href="/admin/copy">site copy</TextLink>
        <TextLink href="/admin/calculator">quote calculator</TextLink>
      </p>
    </div>
  );
}
