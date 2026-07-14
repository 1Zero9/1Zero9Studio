import Link from "next/link";
import { Meta } from "@/components/ui/meta";
import { TextLink } from "@/components/ui/text-link";
import { allProjects } from "@/lib/content";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Projects</h1>
      <p className="mt-2 text-sm text-muted">
        Manage screenshots and links for each project.
      </p>
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
            <TextLink href={`/admin/projects/${project.slug}`}>manage</TextLink>
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
