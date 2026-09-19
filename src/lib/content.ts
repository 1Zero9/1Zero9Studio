/*
 * The single source of truth for content data.
 * Merges build-time static MDX collection with live database/disk overrides.
 */
import { allProjects as generatedProjects } from "content-collections";
import { getAllAdminProjects, getAdminProjectBySlug } from "./admin-content";

const hideDrafts = process.env.NODE_ENV === "production";

// Covers are either static files under /public/images/projects or served
// from the DB-backed /api/images/[slug] route (for images uploaded via the
// admin panel) — both are already same-origin relative paths, so no
// rewriting is needed. Kept as a passthrough so callers don't need to know
// which case they're in.
export function resolveCoverUrl(url?: string): string | undefined {
  return url || undefined;
}

// Synchronous base projects fallback
export const allProjects = generatedProjects
  .filter((project) => project.slug !== "_template")
  .filter((project) => !hideDrafts || !project.draft)
  .filter((project) => project.status !== "archived")
  .filter((project) => project.section !== "hidden")
  .sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return b.date.localeCompare(a.date);
  });

export type Project = (typeof allProjects)[number];

// Live asynchronous projects loader merging cloud/disk updates
// Applied on every path out of getLiveProjects, including the error
// fallback below - visibility rules (archived/hidden/draft) must never
// depend on the admin database being reachable. This used to be inlined
// only in the success path: when getAllAdminProjects() threw, the catch
// block returned the raw, unfiltered MDX list instead, which meant a
// database hiccup made archived projects, hidden-section content and
// drafts all reappear on the live site with no visible sign anything had
// gone wrong. Found 2026-09-19 reviewing the site after archiving eolas -
// its status change had no effect in production because of this.
function isVisible(project: Pick<Project, "slug" | "draft" | "status" | "section">): boolean {
  return (
    project.slug !== "_template" &&
    (!hideDrafts || !project.draft) &&
    project.status !== "archived" &&
    project.section !== "hidden"
  );
}

function applyVisibilityFilters(projects: Project[]): Project[] {
  return projects.filter(isVisible).sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return b.date.localeCompare(a.date);
  });
}

export async function getLiveProjects(): Promise<Project[]> {
  try {
    const adminProjects = await getAllAdminProjects();
    const mergedMap = new Map<string, Project>();

    for (const p of generatedProjects) {
      mergedMap.set(p.slug, {
        ...p,
        cover: resolveCoverUrl(p.cover),
      });
    }

    for (const ap of adminProjects) {
      const existing = mergedMap.get(ap.slug);
      if (existing) {
        const rawCover = ap.frontmatter.cover || existing.cover;
        mergedMap.set(ap.slug, {
          ...existing,
          ...ap.frontmatter,
          cover: resolveCoverUrl(rawCover),
          coverAlt: ap.frontmatter.coverAlt || existing.coverAlt,
          featuredOnHome: Boolean(ap.frontmatter.featuredOnHome),
          draft: Boolean(ap.frontmatter.draft),
          section: ap.frontmatter.section || existing.section,
          status: ap.frontmatter.status || existing.status,
          kind: ap.frontmatter.kind || existing.kind,
          title: ap.frontmatter.title || existing.title,
          summary: ap.frontmatter.summary || existing.summary,
          tags: ap.frontmatter.tags || existing.tags,
          techStack: ap.frontmatter.techStack || existing.techStack,
          highlights: ap.frontmatter.highlights || existing.highlights,
          url: ap.frontmatter.url || existing.url,
          repo: ap.frontmatter.repo || existing.repo,
        } as Project);
      } else {
        // Brand-new project created purely through the admin panel (manual
        // add or GitHub import) that hasn't been committed to the MDX
        // collection yet. Without this branch these projects were silently
        // dropped from every listing page (home/projects/labs) even though
        // they were saved successfully.
        const fm = ap.frontmatter;
        const rawCover = fm.cover;
        mergedMap.set(ap.slug, {
          slug: ap.slug,
          title: fm.title || ap.slug,
          summary: fm.summary || "",
          date: fm.date || new Date().toISOString().split("T")[0],
          year: (fm.date || "").slice(0, 4) || String(new Date().getFullYear()),
          updated: fm.updated,
          tags: fm.tags || [],
          techStack: fm.techStack || [],
          kind: fm.kind || "app",
          accent: fm.accent || "#3855d6",
          status: fm.status || "live",
          section: fm.section,
          featured: Boolean(fm.featured),
          featuredOnHome: Boolean(fm.featuredOnHome),
          wipProgress: fm.wipProgress,
          wipNote: fm.wipNote,
          highlights: fm.highlights || [],
          links: fm.links || [],
          gallery: fm.gallery || [],
          cover: resolveCoverUrl(rawCover),
          coverAlt: fm.coverAlt,
          url: fm.url,
          repo: fm.repo,
          draft: Boolean(fm.draft),
          order: fm.order,
          readingTime: 3,
          content: ap.content,
          mdx: undefined,
        } as unknown as Project);
      }
    }

    return applyVisibilityFilters(Array.from(mergedMap.values()));
  } catch (err) {
    console.error("Error loading live projects:", err);
    // Fail safe, not open: same visibility rules as the success path, just
    // without any admin-database overrides layered on top of the raw MDX
    // content. Never the unfiltered list - see the comment on
    // applyVisibilityFilters above for why this matters.
    return applyVisibilityFilters(allProjects);
  }
}

export async function getLiveHomeSpotlightProject(): Promise<Project | undefined> {
  const projects = await getLiveProjects();

  // 1. Check for explicit homepage spotlight
  const explicit = projects.find((project) => project.featuredOnHome);
  if (explicit) return explicit;

  // 2. Check for featured project
  const featured = projects.find((project) => project.featured || project.status === "featured");
  if (featured) return featured;

  // 3. Fallback to newest portfolio project
  const portfolio = projects.filter((project) => {
    if (project.section === "portfolio") return true;
    if (project.section === "labs" || project.section === "hidden") return false;
    return (
      project.kind === "website" ||
      (project.status !== "in-progress" &&
        !project.tags.includes("experiment") &&
        project.kind !== "experiment" &&
        project.kind !== "tool")
    );
  });

  return portfolio[0] || projects[0];
}

export async function getLivePortfolioProjects(): Promise<Project[]> {
  const projects = await getLiveProjects();
  return projects.filter((project) => {
    if (project.section === "portfolio") return true;
    if (project.section === "labs" || project.section === "hidden") return false;

    return (
      project.kind === "website" ||
      (project.status !== "in-progress" &&
        !project.tags.includes("experiment") &&
        project.kind !== "experiment" &&
        project.kind !== "tool")
    );
  });
}

export async function getLiveLabsProjects(): Promise<Project[]> {
  const projects = await getLiveProjects();
  return projects.filter((project) => {
    if (project.section === "labs") return true;
    if (project.section === "portfolio" || project.section === "hidden") return false;

    return (
      project.status === "in-progress" ||
      project.tags.includes("experiment") ||
      project.kind === "experiment" ||
      project.kind === "tool" ||
      project.slug === "swgoh" ||
      project.slug === "prompt-builder" ||
      project.slug === "jobjar" ||
      project.slug === "holiday-concierge"
    );
  });
}

export async function getLiveInProgressProjects(): Promise<Project[]> {
  const projects = await getLiveProjects();
  return projects.filter((project) => project.status === "in-progress");
}

export async function getLiveProject(slug: string): Promise<Project | undefined> {
  const projects = await getLiveProjects();
  const found = projects.find((project) => project.slug === slug);
  if (found) return found;

  // Direct-by-slug lookup for a project the admin database knows about but
  // getLiveProjects() didn't return - either it's genuinely new (not yet in
  // generatedProjects) or, per that function's own filtering, not meant to
  // be visible right now. This branch used to skip visibility checks
  // entirely: any admin-database record for the slug rendered, regardless
  // of its status - so archived/hidden/draft projects were still directly
  // reachable by URL even after being correctly excluded from every listing
  // and the sitemap. Found 2026-09-19 alongside the fail-open bug in
  // getLiveProjects() - this is a separate gap in the same file, not the
  // same bug twice.
  const direct = await getAdminProjectBySlug(slug);
  if (direct) {
    const base = generatedProjects.find((p) => p.slug === slug);
    const merged = {
      ...(base || {}),
      ...direct.frontmatter,
      slug: direct.slug,
      content: direct.content,
    } as unknown as Project;
    return isVisible(merged) ? merged : undefined;
  }

  return undefined;
}

// Synchronous exports for static fallbacks
export function featuredProjects() {
  return allProjects.filter(
    (project) => project.featured || project.status === "featured",
  );
}

export function homeSpotlightProject() {
  const explicit = allProjects.find((project) => project.featuredOnHome);
  if (explicit) return explicit;

  const featured = allProjects.find((project) => project.featured || project.status === "featured");
  if (featured) return featured;

  return portfolioProjects()[0] || allProjects[0];
}

export function inProgressProjects() {
  return allProjects.filter((project) => project.status === "in-progress");
}

export function portfolioProjects() {
  return allProjects.filter((project) => {
    if (project.section === "portfolio") return true;
    if (project.section === "labs" || project.section === "hidden") return false;

    return (
      project.kind === "website" ||
      (project.status !== "in-progress" &&
        !project.tags.includes("experiment") &&
        project.kind !== "experiment" &&
        project.kind !== "tool")
    );
  });
}

export function labsProjects() {
  return allProjects.filter((project) => {
    if (project.section === "labs") return true;
    if (project.section === "portfolio" || project.section === "hidden") return false;

    return (
      project.status === "in-progress" ||
      project.tags.includes("experiment") ||
      project.kind === "experiment" ||
      project.kind === "tool" ||
      project.slug === "swgoh" ||
      project.slug === "prompt-builder" ||
      project.slug === "jobjar" ||
      project.slug === "holiday-concierge"
    );
  });
}

export function getProject(slug: string) {
  return allProjects.find((project) => project.slug === slug);
}
