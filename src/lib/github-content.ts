import "server-only";
import YAML from "yaml";
import {
  projectFrontmatterSchema,
  projectSlug,
  type ProjectFrontmatter,
} from "@/lib/project-schema";

const REPO = "1Zero9/1Zero9Studio";
const API = "https://api.github.com";

function token() {
  const value = process.env.GITHUB_CONTENT_TOKEN;
  if (!value) {
    throw new Error(
      "GITHUB_CONTENT_TOKEN is not configured — add a fine-grained GitHub token with Contents read/write access.",
    );
  }
  return value;
}

function projectPath(slug: string) {
  projectSlug.parse(slug);
  return `content/projects/${slug}/index.mdx`;
}

async function github(path: string, init?: RequestInit) {
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

export type ProjectFile = {
  frontmatter: ProjectFrontmatter;
  body: string;
  sha: string;
};

export async function getProjectFile(slug: string): Promise<ProjectFile | null> {
  const res = await github(`/repos/${REPO}/contents/${projectPath(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { content: string; sha: string };
  const raw = Buffer.from(data.content, "base64").toString("utf8");

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`Could not parse frontmatter in ${projectPath(slug)}`);
  }

  const frontmatter = projectFrontmatterSchema.parse(YAML.parse(match[1]!));
  return { frontmatter, body: match[2]!.replace(/^\r?\n/, ""), sha: data.sha };
}

export function serializeProjectFile(
  frontmatter: ProjectFrontmatter,
  body: string,
) {
  // Strip undefined/empty-optional keys so the YAML stays clean.
  const ordered: Record<string, unknown> = {};
  for (const key of [
    "title",
    "summary",
    "date",
    "updated",
    "tags",
    "status",
    "order",
    "url",
    "repo",
    "cover",
    "coverAlt",
    "draft",
  ] as const) {
    const value = frontmatter[key];
    if (value !== undefined) ordered[key] = value;
  }

  const yaml = YAML.stringify(ordered, { lineWidth: 0 }).trimEnd();
  return `---\n${yaml}\n---\n\n${body.replace(/\r\n/g, "\n").trim()}\n`;
}

export async function saveProjectFile(options: {
  slug: string;
  frontmatter: ProjectFrontmatter;
  body: string;
  sha?: string;
  message: string;
  branch?: string;
}) {
  const { slug, frontmatter, body, sha, message, branch } = options;
  const content = serializeProjectFile(frontmatter, body);

  const res = await github(`/repos/${REPO}/contents/${projectPath(slug)}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      ...(sha ? { sha } : {}),
      ...(branch ? { branch } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
  }
}
