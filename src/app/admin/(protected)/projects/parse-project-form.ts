import "server-only";
import {
  projectFrontmatterSchema,
  type ProjectFrontmatter,
} from "@/lib/project-schema";

export type ParsedProjectForm =
  | { ok: true; frontmatter: ProjectFrontmatter; body: string; coverFile: File | null }
  | { ok: false; error: string };

export function parseProjectForm(formData: FormData): ParsedProjectForm {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const optional = (name: string) => text(name) || undefined;

  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n").trim();
  if (!body) return { ok: false, error: "The case study body is required." };

  const coverFileValue = formData.get("coverFile");
  const coverFile =
    coverFileValue instanceof File && coverFileValue.size > 0 ? coverFileValue : null;
  if (coverFile && !optional("coverAlt")) {
    return { ok: false, error: "Cover alt text is required when uploading a cover image." };
  }

  const orderText = text("order");
  const parsed = projectFrontmatterSchema.safeParse({
    title: text("title"),
    summary: text("summary"),
    date: text("date"),
    updated: optional("updated"),
    tags: text("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    status: text("status") || "active",
    order: orderText ? Number(orderText) : undefined,
    url: optional("url"),
    repo: optional("repo"),
    cover: optional("cover"),
    coverAlt: optional("coverAlt"),
    draft: formData.get("draft") === "on",
  });

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`)
      .join(" · ");
    return { ok: false, error: issues };
  }

  return { ok: true, frontmatter: parsed.data, body, coverFile };
}

export function saveErrorMessage(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("(409)")) {
    return "This project changed on GitHub since you opened the form — reopen it and re-apply your edits.";
  }
  return message;
}
