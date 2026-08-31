import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { getAllAdminProjects } from "@/lib/admin-content";

interface DiscoveredProject {
  source: "github" | "workspace";
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

function cleanTitleFromName(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
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

    const githubToken = process.env.GITHUB_TOKEN;

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

    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

    // Fetch user repos from GitHub API
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=50`,
      {
        headers,
        next: { revalidate: 60 },
      }
    );

    let rawRepos: any[] = [];
    if (res.ok) {
      rawRepos = await res.json();
    } else {
      console.warn(`GitHub API returned ${res.status}: ${await res.text()}`);
    }

    const discovered: DiscoveredProject[] = [];

    for (const repo of rawRepos) {
      // Ignore archived or template repos if desired
      const slug = generateSlug(repo.name);
      const repoUrl = repo.html_url;
      const isAlreadyManaged =
        existingSlugs.has(slug) ||
        existingRepoUrls.has(repoUrl?.toLowerCase().trim()) ||
        existingProjects.some(
          (p) =>
            p.frontmatter.title?.toLowerCase() === repo.name.toLowerCase() ||
            p.frontmatter.title?.toLowerCase() === cleanTitleFromName(repo.name).toLowerCase()
        );

      const matchingManaged = existingProjects.find(
        (p) =>
          p.slug.toLowerCase() === slug ||
          p.frontmatter.repo?.toLowerCase().trim() === repoUrl?.toLowerCase().trim()
      );

      const topics: string[] = Array.isArray(repo.topics) ? repo.topics : [];
      const language: string = repo.language || "";

      const techStack: string[] = [];
      if (language) techStack.push(language);
      if (topics.includes("nextjs") || topics.includes("next")) techStack.push("Next.js");
      if (topics.includes("react")) techStack.push("React");
      if (topics.includes("typescript") && !techStack.includes("TypeScript"))
        techStack.push("TypeScript");
      if (topics.includes("tailwindcss") || topics.includes("tailwind"))
        techStack.push("Tailwind CSS");
      if (topics.includes("python") && !techStack.includes("Python")) techStack.push("Python");
      if (topics.includes("ai") || topics.includes("gemini") || topics.includes("openai"))
        techStack.push("AI");

      // Infer kind & section
      let suggestedKind: "website" | "app" | "pwa" | "tool" | "experiment" = "app";
      if (topics.includes("website") || topics.includes("portfolio")) {
        suggestedKind = "website";
      } else if (topics.includes("pwa")) {
        suggestedKind = "pwa";
      } else if (topics.includes("tool") || topics.includes("cli")) {
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
        topics.includes("experiment")
      ) {
        suggestedSection = "labs";
      }

      discovered.push({
        source: "github",
        id: String(repo.id),
        name: repo.name,
        slug,
        title: cleanTitleFromName(repo.name),
        summary: repo.description || `${cleanTitleFromName(repo.name)} software project and repository.`,
        repoUrl: repo.html_url,
        liveUrl: repo.homepage || undefined,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        primaryLanguage: language,
        topics,
        techStack: techStack.length > 0 ? techStack : ["TypeScript", "Next.js"],
        suggestedKind,
        suggestedSection,
        suggestedStatus: repo.homepage ? "live" : "in-progress",
        isAlreadyManaged,
        managedSlug: matchingManaged?.slug,
      });
    }

    return NextResponse.json({
      username,
      totalDiscovered: discovered.length,
      pendingVetting: discovered.filter((d) => !d.isAlreadyManaged),
      alreadyManaged: discovered.filter((d) => d.isAlreadyManaged),
      all: discovered,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to discover projects" },
      { status: 500 }
    );
  }
}
