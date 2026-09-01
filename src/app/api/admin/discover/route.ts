import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllAdminProjects } from "@/lib/admin-content";
import fs from "fs";
import path from "path";

export interface DiscoveredProject {
  source: "github" | "workspace" | "manual";
  id: string;
  name: string;
  slug: string;
  title: string;
  summary: string;
  repoUrl: string;
  liveUrl?: string;
  updatedAt: string;
  pushedAt: string;
  primaryLanguage?: string;
  topics: string[];
  techStack: string[];
  suggestedKind: "website" | "app" | "pwa" | "tool" | "experiment";
  suggestedSection: "portfolio" | "labs";
  suggestedStatus: "live" | "in-progress" | "featured";
  isAlreadyManaged: boolean;
  managedSlug?: string;
}

interface GitHubRepoItem {
  id: number;
  name: string;
  html_url: string;
  description?: string | null;
  homepage?: string | null;
  topics?: string[];
  language?: string | null;
  updated_at: string;
  pushed_at: string;
  private?: boolean;
}

function getGithubToken(): string | undefined {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (process.env.GITHUB_CONTENT_TOKEN) return process.env.GITHUB_CONTENT_TOKEN;
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/GITHUB_TOKEN=["']?([^"'\r\n]+)["']?/i) ||
                    content.match(/GH_TOKEN=["']?([^"'\r\n]+)["']?/i) ||
                    content.match(/GITHUB_CONTENT_TOKEN=["']?([^"'\r\n]+)["']?/i);
      if (match && match[1]) return match[1].trim();
    }
  } catch {
    // Ignore disk read error
  }
  return undefined;
}

function cleanTitleFromName(name: string): string {
  // Special abbreviations
  const upperWords = new Set(["api", "sdk", "cli", "ui", "pwa", "ai", "rvr", "fc", "app", "db", "seo"]);
  return name
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (upperWords.has(lower)) return lower.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .trim();
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-");
}

function inferProjectDetails(repo: {
  name: string;
  description?: string | null;
  homepage?: string | null;
  topics?: string[];
  language?: string | null;
  html_url: string;
  updated_at?: string;
  pushed_at?: string;
}) {
  const topics: string[] = Array.isArray(repo.topics) ? repo.topics : [];
  const language: string = repo.language || "";

  const techStack: string[] = [];
  if (language) techStack.push(language);
  if (topics.includes("nextjs") || topics.includes("next")) techStack.push("Next.js");
  if (topics.includes("react")) techStack.push("React");
  if (topics.includes("typescript") && !techStack.includes("TypeScript")) techStack.push("TypeScript");
  if (topics.includes("tailwindcss") || topics.includes("tailwind")) techStack.push("Tailwind CSS");
  if (topics.includes("python") && !techStack.includes("Python")) techStack.push("Python");
  if (topics.includes("ai") || topics.includes("gemini") || topics.includes("openai")) techStack.push("AI");
  if (topics.includes("node") || topics.includes("nodejs")) techStack.push("Node.js");

  let suggestedKind: "website" | "app" | "pwa" | "tool" | "experiment" = "app";
  const nameLower = repo.name.toLowerCase();
  const descLower = (repo.description || "").toLowerCase();

  if (
    topics.includes("website") ||
    topics.includes("portfolio") ||
    nameLower.includes("website") ||
    nameLower.includes("landing")
  ) {
    suggestedKind = "website";
  } else if (topics.includes("pwa") || descLower.includes("pwa")) {
    suggestedKind = "pwa";
  } else if (
    topics.includes("tool") ||
    topics.includes("cli") ||
    nameLower.includes("admin") ||
    nameLower.includes("builder") ||
    nameLower.includes("tool")
  ) {
    suggestedKind = "tool";
  } else if (topics.includes("experiment") || topics.includes("prototype") || topics.includes("poc")) {
    suggestedKind = "experiment";
  }

  let suggestedSection: "portfolio" | "labs" = "portfolio";
  if (
    suggestedKind === "tool" ||
    suggestedKind === "experiment" ||
    topics.includes("wip") ||
    topics.includes("labs") ||
    nameLower.includes("admin")
  ) {
    suggestedSection = "labs";
  }

  return {
    title: cleanTitleFromName(repo.name),
    slug: generateSlug(repo.name),
    summary:
      repo.description ||
      `${cleanTitleFromName(repo.name)} — custom platform developed with modern web architecture.`,
    techStack: techStack.length > 0 ? techStack : ["TypeScript", "React", "Next.js"],
    topics,
    suggestedKind,
    suggestedSection,
    suggestedStatus: repo.homepage ? ("live" as const) : ("in-progress" as const),
  };
}

export async function GET(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const username =
      searchParams.get("username") ||
      process.env.GITHUB_USERNAME ||
      "1Zero9";

    const token = searchParams.get("token") || getGithubToken();

    const existingProjects = await getAllAdminProjects();
    const existingSlugs = new Set(existingProjects.map((p) => p.slug.toLowerCase()));
    const existingRepoUrls = new Set(
      existingProjects
        .map((p) => p.frontmatter.repo?.toLowerCase().trim())
        .filter(Boolean)
    );

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "1Zero9Studio-ProjectScanner",
    };

    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    // Fetch user repos from GitHub API (check both user and org endpoints)
    const rawReposMap = new Map<string, GitHubRepoItem>();

    const fetchEndpoints = [
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
      `https://api.github.com/orgs/${username}/repos?sort=pushed&per_page=100`,
    ];

    if (token) {
      // If token is provided, also fetch authenticated user's repos (including private)
      fetchEndpoints.unshift(`https://api.github.com/user/repos?sort=pushed&per_page=100&affiliation=owner,organization_member`);
    }

    for (const endpoint of fetchEndpoints) {
      try {
        const res = await fetch(endpoint, { headers, next: { revalidate: 60 } });
        if (res.ok) {
          const list: GitHubRepoItem[] = await res.json();
          if (Array.isArray(list)) {
            for (const item of list) {
              rawReposMap.set(item.html_url.toLowerCase(), item);
            }
          }
        }
      } catch (err) {
        console.warn(`Could not fetch from ${endpoint}:`, err);
      }
    }

    const rawRepos = Array.from(rawReposMap.values());
    const discovered: DiscoveredProject[] = [];

    for (const repo of rawRepos) {
      const { title, slug, summary, techStack, topics, suggestedKind, suggestedSection, suggestedStatus } =
        inferProjectDetails(repo);

      const repoUrl = repo.html_url;
      const isAlreadyManaged =
        existingSlugs.has(slug) ||
        existingRepoUrls.has(repoUrl?.toLowerCase().trim()) ||
        existingProjects.some(
          (p) =>
            p.frontmatter.title?.toLowerCase() === repo.name.toLowerCase() ||
            p.frontmatter.title?.toLowerCase() === title.toLowerCase()
        );

      const matchingManaged = existingProjects.find(
        (p) =>
          p.slug.toLowerCase() === slug ||
          p.frontmatter.repo?.toLowerCase().trim() === repoUrl?.toLowerCase().trim()
      );

      discovered.push({
        source: "github",
        id: String(repo.id || slug),
        name: repo.name,
        slug,
        title,
        summary,
        repoUrl: repo.html_url,
        liveUrl: repo.homepage || undefined,
        updatedAt: repo.updated_at || new Date().toISOString(),
        pushedAt: repo.pushed_at || new Date().toISOString(),
        primaryLanguage: repo.language || undefined,
        topics,
        techStack,
        suggestedKind,
        suggestedSection,
        suggestedStatus,
        isAlreadyManaged,
        managedSlug: matchingManaged?.slug,
      });
    }

    return NextResponse.json({
      username,
      totalDiscovered: discovered.length,
      hasToken: Boolean(token),
      pendingVetting: discovered.filter((d) => !d.isAlreadyManaged),
      alreadyManaged: discovered.filter((d) => d.isAlreadyManaged),
      all: discovered,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to discover projects",
      },
      { status: 500 }
    );
  }
}

// POST: Direct Import of ANY GitHub Repository URL or manual repo path
export async function POST(req: NextRequest) {
  const isAuthed = await verifyAdminRequest(req);
  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const inputUrl = (body.url || body.repo || "").trim();

    if (!inputUrl) {
      return NextResponse.json({ error: "Repository URL or name is required" }, { status: 400 });
    }

    // Extract owner and repo from various URL formats
    // e.g. https://github.com/1Zero9/rvr-2014-teamadmin or 1Zero9/rvr-2014-teamadmin or rvr-2014-teamadmin
    let owner = "1Zero9";
    let repoName = inputUrl;

    if (inputUrl.includes("github.com/")) {
      const parts = inputUrl.replace(/^https?:\/\/github\.com\//, "").split("/");
      if (parts[0]) owner = parts[0];
      if (parts[1]) repoName = parts[1].replace(/\.git$/, "");
    } else if (inputUrl.includes("/")) {
      const parts = inputUrl.split("/");
      if (parts[0]) owner = parts[0];
      if (parts[1]) repoName = parts[1];
    }

    const token = body.token || getGithubToken();
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "1Zero9Studio-ProjectScanner",
    };
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    let repoData: Partial<GitHubRepoItem> = {
      name: repoName,
      html_url: `https://github.com/${owner}/${repoName}`,
    };
    let readmeText = "";

    const apiRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, { headers });
    if (apiRes.ok) {
      repoData = await apiRes.json();
    } else if (apiRes.status === 404) {
      return NextResponse.json(
        {
          error: token
            ? `"${owner}/${repoName}" was not found or this token doesn't have access to it.`
            : `"${owner}/${repoName}" was not found. If it's a private repository, paste a GitHub token with access to it above.`,
        },
        { status: 404 }
      );
    } else if (apiRes.status === 401 || apiRes.status === 403) {
      return NextResponse.json(
        { error: "GitHub token is invalid or lacks permission to view this repository." },
        { status: apiRes.status }
      );
    }

    // Try fetching README to extract rich context
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
        headers: { ...headers, Accept: "application/vnd.github.raw+json" },
      });
      if (readmeRes.ok) {
        readmeText = await readmeRes.text();
      }
    } catch {
      // Ignore
    }

    const { title, slug, summary, techStack, topics, suggestedKind, suggestedSection, suggestedStatus } =
      inferProjectDetails({
        name: repoData.name || repoName,
        description: repoData.description,
        homepage: repoData.homepage,
        topics: repoData.topics,
        language: repoData.language,
        html_url: repoData.html_url || `https://github.com/${owner}/${repoName}`,
      });

    // Check if already managed
    const existingProjects = await getAllAdminProjects();
    const matchingManaged = existingProjects.find(
      (p) =>
        p.slug.toLowerCase() === slug ||
        p.frontmatter.repo?.toLowerCase().trim() === (repoData.html_url || "").toLowerCase().trim()
    );

    const project: DiscoveredProject = {
      source: "github",
      id: String(repoData.id || slug),
      name: repoData.name || repoName,
      slug,
      title,
      summary,
      repoUrl: repoData.html_url || `https://github.com/${owner}/${repoName}`,
      liveUrl: repoData.homepage || undefined,
      updatedAt: repoData.updated_at || new Date().toISOString(),
      pushedAt: repoData.pushed_at || new Date().toISOString(),
      primaryLanguage: repoData.language || undefined,
      topics,
      techStack,
      suggestedKind,
      suggestedSection,
      suggestedStatus,
      isAlreadyManaged: Boolean(matchingManaged),
      managedSlug: matchingManaged?.slug,
    };

    return NextResponse.json({
      success: true,
      project,
      readmeSnippet: readmeText ? readmeText.slice(0, 1500) : undefined,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to import repository",
      },
      { status: 500 }
    );
  }
}
