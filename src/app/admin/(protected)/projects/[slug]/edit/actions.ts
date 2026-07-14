"use server";

import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { uploadProjectImage } from "@/lib/blob";
import { saveProjectFile } from "@/lib/github-content";
import type { ProjectFormState } from "../../project-form";
import { parseProjectForm, saveErrorMessage } from "../../parse-project-form";

export async function updateProject(
  slug: string,
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdminSession();

  const sha = String(formData.get("sha") ?? "");
  if (!sha) return { error: "Missing file version — reopen this form and try again." };

  const parsed = parseProjectForm(formData);
  if (!parsed.ok) return { error: parsed.error };

  const { frontmatter, body, coverFile } = parsed;
  if (coverFile) {
    frontmatter.cover = await uploadProjectImage(slug, coverFile);
  }

  try {
    await saveProjectFile({
      slug,
      frontmatter,
      body,
      sha,
      message: `Update ${frontmatter.title} case study from admin`,
    });
  } catch (err) {
    return { error: saveErrorMessage(err) };
  }

  redirect(`/admin/projects/${slug}?saved=1`);
}
