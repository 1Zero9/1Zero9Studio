"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { uploadProjectImage } from "@/lib/blob";
import { getProjectFile, saveProjectFile } from "@/lib/github-content";
import { projectSlug } from "@/lib/project-schema";
import type { ProjectFormState } from "../project-form";
import { parseProjectForm, saveErrorMessage } from "../parse-project-form";

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdminSession();

  const slugResult = projectSlug.safeParse(String(formData.get("slug") ?? "").trim());
  if (!slugResult.success) {
    return { error: "Slug must be lowercase kebab-case — letters, numbers and hyphens only." };
  }
  const slug = slugResult.data;

  const parsed = parseProjectForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const existing = await getProjectFile(slug);
  if (existing) return { error: `A project with the slug “${slug}” already exists.` };

  const { frontmatter, body, coverFile } = parsed;
  if (coverFile) {
    frontmatter.cover = await uploadProjectImage(slug, coverFile);
  }

  try {
    await saveProjectFile({
      slug,
      frontmatter,
      body,
      message: `Add ${frontmatter.title} case study from admin`,
    });
  } catch (err) {
    return { error: saveErrorMessage(err) };
  }

  redirect(`/admin?created=${slug}`);
}
