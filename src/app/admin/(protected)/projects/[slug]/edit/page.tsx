import { notFound } from "next/navigation";
import { Meta } from "@/components/ui/meta";
import { TextLink } from "@/components/ui/text-link";
import { getProjectFile } from "@/lib/github-content";
import { ProjectForm } from "../../project-form";
import { updateProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const file = await getProjectFile(slug);
  if (!file) notFound();

  return (
    <div>
      <TextLink href={`/admin/projects/${slug}`}>back to project</TextLink>
      <h1 className="mt-4 font-display text-3xl tracking-tight">
        Edit {file.frontmatter.title}
      </h1>
      <Meta className="mt-1">{slug}</Meta>
      <ProjectForm
        action={updateProject.bind(null, slug)}
        defaults={{ ...file.frontmatter, body: file.body }}
        sha={file.sha}
        submitLabel="save changes"
      />
    </div>
  );
}
