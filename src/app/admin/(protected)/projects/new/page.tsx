import { TextLink } from "@/components/ui/text-link";
import { ProjectForm } from "../project-form";
import { createProject } from "./actions";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <TextLink href="/admin">back to projects</TextLink>
      <h1 className="mt-4 font-display text-3xl tracking-tight">New project</h1>
      <p className="mt-2 text-sm text-muted">
        Creates a new case study — it appears on the site once the deploy finishes.
      </p>
      <ProjectForm
        action={createProject}
        defaults={{ date: today }}
        withSlugField
        submitLabel="create project"
      />
    </div>
  );
}
