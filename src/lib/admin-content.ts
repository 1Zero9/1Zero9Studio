import fs from "fs/promises";
import path from "path";
import yaml from "yaml";
import { put, list, del } from "@vercel/blob";
import { ProjectFrontmatter } from "./project-schema";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const OVERRIDES_BLOB_PATH = "data/project-overrides.json";

export interface AdminProject {
  slug: string;
  frontmatter: Partial<ProjectFrontmatter> & {
    title: string;
    summary: string;
    date: string;
    section?: "portfolio" | "labs" | "hidden";
    featuredOnHome?: boolean;
  };
  content: string;
  hasThumbnail: boolean;
}

// In-memory fallback cache for serverless environments when disk is read-only
const memoryOverrides = new Map<string, { frontmatter: Record<string, unknown>; content?: string }>();

// Tracks slugs this process has deleted recently. This closes the real
// source of the "deleted project resurrects for ~1 minute" bug: even with
// the write-verification retry below, a *separate* later request's
// fetchBlobOverrides() call does its own independent list()+fetch() against
// the Blob CDN, which can still return a stale snapshot that still contains
// the just-deleted key — and that stale key would otherwise get merged
// straight back into memoryOverrides (and returned to the caller), silently
// undoing the delete. While a slug is tombstoned, freshly-fetched CDN data
// for that key is ignored in favor of "we know we deleted this," until
// either the TTL lapses (safety net) or the fetched data confirms the key
// is genuinely gone / the slug is legitimately recreated.
const deletedTombstones = new Map<string, number>();
const TOMBSTONE_TTL_MS = 2 * 60 * 1000;

// Serializes every read-modify-write cycle against the overrides blob
// within this server instance. Without this, two admin actions fired in
// quick succession (e.g. upload thumbnail A, upload thumbnail B, delete
// project) can interleave their fetch/mutate/save steps: action 2's read
// can start before action 1's write has finished, so action 2 saves a
// snapshot that doesn't include action 1's change, silently reverting it
// (a classic lost-update race). Chaining every call through this lock
// guarantees each read-modify-write cycle completes before the next one's
// read begins, at least for requests handled by the same instance.
let overridesLock: Promise<unknown> = Promise.resolve();
function withOverridesLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = overridesLock.then(fn, fn);
  overridesLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export function parseMdxFile(raw: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: raw };
  }
  const [, yamlBlock, content] = match;
  try {
    const parsed = yaml.parse(yamlBlock || "");
    return { frontmatter: (parsed as Record<string, unknown>) || {}, content: (content || "").trim() };
  } catch {
    return { frontmatter: {}, content: raw };
  }
}

export function stringifyMdxFile(frontmatter: Record<string, unknown>, content: string): string {
  const yamlString = yaml.stringify(frontmatter).trim();
  return `---\n${yamlString}\n---\n\n${content.trim()}\n`;
}

import fsSync from "fs";

export function getBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) return process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

  for (const [key, value] of Object.entries(process.env)) {
    if (
      value &&
      (key.endsWith("_READ_WRITE_TOKEN") ||
        key.includes("BLOB_READ_WRITE_TOKEN") ||
        key.includes("BLOB_TOKEN") ||
        key.toLowerCase().includes("studio_blob"))
    ) {
      return value;
    }
  }

  // Fallback: Read directly from .env.local on disk if dev server hasn't restarted
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fsSync.existsSync(envPath)) {
      const content = fsSync.readFileSync(envPath, "utf-8");
      const match = content.match(/BLOB_READ_WRITE_TOKEN=["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        process.env.BLOB_READ_WRITE_TOKEN = match[1];
        return match[1];
      }
    }
  } catch {
    // Ignore in environments without filesystem access
  }

  return undefined;
}

// Helper to fetch blob overrides if BLOB token is configured
async function fetchBlobOverrides(): Promise<Record<string, { frontmatter: Record<string, unknown>; content?: string }>> {
  const blobToken = getBlobToken();
  if (!blobToken) {
    const obj: Record<string, { frontmatter: Record<string, unknown>; content?: string }> = {};
    for (const [k, v] of memoryOverrides.entries()) {
      obj[k] = v;
    }
    return obj;
  }

  try {
    const { blobs } = await list({ prefix: "data/", token: blobToken });
    const overrideBlob =
      blobs.find((b) => b.pathname.endsWith("project-overrides.json") || b.pathname.includes("overrides")) ||
      blobs[0];

    if (overrideBlob?.url) {
      // Vercel Blob's public URLs are served through a CDN with a long
      // default cache lifetime. `cache: "no-store"` only disables Next.js's
      // own fetch cache — it does nothing to bypass the upstream CDN edge
      // cache, so reads right after a write could return stale data (e.g. a
      // newly created project or thumbnail update silently "disappearing").
      // Appending a cache-busting query param forces a fresh edge fetch.
      //
      // Previously this used `overrideBlob.uploadedAt` (from `list()`) as
      // the cache-busting value. That's unreliable: `list()` itself can
      // return metadata that hasn't caught up with a very recent write, in
      // which case `uploadedAt` is identical to a prior request's value,
      // producing the exact same busted URL — which the CDN can then still
      // serve from cache, defeating the whole point. Using the current
      // wall-clock time guarantees a unique query string on every call
      // regardless of `list()` staleness.
      const bustedUrl = `${overrideBlob.url}?t=${Date.now()}`;
      const res = await fetch(bustedUrl, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) || {};
        const filtered: Record<string, { frontmatter: Record<string, unknown>; content?: string }> = {};
        for (const [k, v] of Object.entries(data)) {
          const tombstonedAt = deletedTombstones.get(k);
          if (tombstonedAt !== undefined) {
            if (Date.now() - tombstonedAt < TOMBSTONE_TTL_MS) {
              // We deleted this slug locally more recently than this CDN
              // response reflects — trust the deletion, not the stale read.
              continue;
            }
            // Tombstone expired; assume it's safe to trust fetched data
            // again (e.g. the slug was legitimately recreated elsewhere).
            deletedTombstones.delete(k);
          }
          filtered[k] = v as { frontmatter: Record<string, unknown>; content?: string };
          memoryOverrides.set(k, v as { frontmatter: Record<string, unknown>; content?: string });
        }
        return filtered;
      }
    }
  } catch (err) {
    console.warn("Could not load blob overrides:", err);
  }

  const obj: Record<string, { frontmatter: Record<string, unknown>; content?: string }> = {};
  for (const [k, v] of memoryOverrides.entries()) {
    obj[k] = v;
  }
  return obj;
}

// Safe wrapper that tries public access first, and automatically falls back to private access if store is private
export async function safePutBlob(
  pathname: string,
  data: string | Buffer | ArrayBuffer | Blob,
  options?: {
    token?: string;
    addRandomSuffix?: boolean;
    allowOverwrite?: boolean;
    contentType?: string;
  }
) {
  const token = options?.token || getBlobToken();
  const baseOptions = {
    addRandomSuffix: options?.addRandomSuffix ?? false,
    allowOverwrite: options?.allowOverwrite ?? true,
    contentType: options?.contentType,
    token,
  };

  try {
    return await put(pathname, data, {
      ...baseOptions,
      access: "public",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.includes("Cannot use public access on a private store") ||
      msg.includes("private store") ||
      msg.includes("configured with private access")
    ) {
      return await put(pathname, data, {
        ...baseOptions,
        access: "private",
      });
    }
    throw err;
  }
}

// Helper to persist blob overrides
async function saveBlobOverrides(overrides: Record<string, { frontmatter: Record<string, unknown>; content?: string }>): Promise<void> {
  // Always update memory cache
  for (const [k, v] of Object.entries(overrides)) {
    memoryOverrides.set(k, v);
  }

  const blobToken = getBlobToken();
  if (blobToken) {
    const serialized = JSON.stringify(overrides, null, 2);
    // Read-your-write verification: even after `put()` resolves, a
    // near-immediate `list()`/`fetch()` (as done by the very next
    // fetchBlobOverrides() call, e.g. from another admin action fired a
    // moment later) can still observe stale data due to eventual
    // consistency in the underlying Blob store/CDN. Re-reading and
    // confirming the write landed — retrying a few times if not — turns
    // that into a rare, self-healing delay instead of a silent lost
    // update (e.g. a deleted project resurrecting for up to a minute).
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await safePutBlob(OVERRIDES_BLOB_PATH, serialized, {
          addRandomSuffix: false,
          allowOverwrite: true,
          token: blobToken,
        });
      } catch (err) {
        console.error(`Failed to save overrides to Vercel Blob (attempt ${attempt}/${maxAttempts}):`, err);
        if (attempt === maxAttempts) return;
        await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
        continue;
      }

      try {
        const { blobs } = await list({ prefix: "data/", token: blobToken });
        const overrideBlob =
          blobs.find((b) => b.pathname.endsWith("project-overrides.json") || b.pathname.includes("overrides")) ||
          blobs[0];
        if (overrideBlob?.url) {
          const res = await fetch(`${overrideBlob.url}?t=${Date.now()}`, { cache: "no-store" });
          if (res.ok) {
            const readBack = await res.text();
            if (readBack === serialized) {
              return;
            }
          }
        }
      } catch (err) {
        console.warn(`Could not verify overrides write (attempt ${attempt}/${maxAttempts}):`, err);
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
      } else {
        console.warn(
          "Overrides write could not be verified after retries; proceeding anyway (in-memory cache is up to date)."
        );
      }
    }
  }
}

export async function getAllAdminProjects(): Promise<AdminProject[]> {
  try {
    const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
    const projectDirs = entries.filter((e) => e.isDirectory() && e.name !== "_template");

    const overrides = await fetchBlobOverrides();
    const projects: AdminProject[] = [];

    for (const dir of projectDirs) {
      const slug = dir.name;
      const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
      try {
        const raw = await fs.readFile(mdxPath, "utf-8");
        const parsed = parseMdxFile(raw);

        // Merge disk data with any serverless blob overrides
        const override = overrides[slug];
        const finalFrontmatter = {
          ...parsed.frontmatter,
          ...(override?.frontmatter || {}),
        };
        const finalContent = override?.content !== undefined ? override.content : parsed.content;

        const cover = finalFrontmatter.cover as string | undefined;
        const hasThumbnail = Boolean(cover);

        projects.push({
          slug,
          frontmatter: finalFrontmatter as unknown as AdminProject["frontmatter"],
          content: finalContent,
          hasThumbnail,
        });
      } catch (err) {
        console.error(`Error reading project ${slug}:`, err);
      }
    }

    // Check for any newly added custom projects that only exist in overrides
    for (const [slug, override] of Object.entries(overrides)) {
      if (!projects.some((p) => p.slug === slug)) {
        projects.push({
          slug,
          frontmatter: override.frontmatter as unknown as AdminProject["frontmatter"],
          content: override.content || "",
          hasThumbnail: Boolean(override.frontmatter.cover),
        });
      }
    }

    // Sort by order or date
    return projects.sort((a, b) => {
      if (a.frontmatter.order !== undefined && b.frontmatter.order !== undefined) {
        return (a.frontmatter.order as number) - (b.frontmatter.order as number);
      }
      return ((b.frontmatter.date as string) || "").localeCompare((a.frontmatter.date as string) || "");
    });
  } catch (err) {
    console.error("Error reading projects directory:", err);
    return [];
  }
}

export async function getAdminProjectBySlug(slug: string): Promise<AdminProject | null> {
  try {
    const overrides = await fetchBlobOverrides();
    const override = overrides[slug];

    let diskFrontmatter: Record<string, unknown> = {};
    let diskContent = "";
    let foundOnDisk = false;

    try {
      const mdxPath = path.join(PROJECTS_DIR, slug, "index.mdx");
      const raw = await fs.readFile(mdxPath, "utf-8");
      const parsed = parseMdxFile(raw);
      diskFrontmatter = parsed.frontmatter;
      diskContent = parsed.content;
      foundOnDisk = true;
    } catch {
      // If not on disk, may be in overrides
    }

    // A project exists if we found it on disk (regardless of whether its
    // body content is empty, e.g. a freshly created project) or it has an
    // override entry. Previously this checked `!diskContent`, which treated
    // legitimately empty content as "project not found" and broke thumbnail
    // uploads/edits on any brand-new project.
    if (!foundOnDisk && !override) {
      return null;
    }

    const finalFrontmatter = {
      ...diskFrontmatter,
      ...(override?.frontmatter || {}),
    };
    const finalContent = override?.content !== undefined ? override.content : diskContent;

    return {
      slug,
      frontmatter: finalFrontmatter as unknown as AdminProject["frontmatter"],
      content: finalContent,
      hasThumbnail: Boolean(finalFrontmatter.cover),
    };
  } catch {
    return null;
  }
}

export async function saveAdminProject(
  slug: string,
  frontmatter: Record<string, unknown>,
  content?: string
): Promise<AdminProject> {
  const dirPath = path.join(PROJECTS_DIR, slug);
  const mdxPath = path.join(dirPath, "index.mdx");

  let existingContent = "";
  try {
    const raw = await fs.readFile(mdxPath, "utf-8");
    const parsed = parseMdxFile(raw);
    existingContent = parsed.content;
  } catch {
    existingContent = `## Overview\n\n${(frontmatter.summary as string) || ""}\n\n## Highlights\n\n- Built with modern web architecture\n- Designed for performance and clean user experience\n`;
  }

  const finalContent = content !== undefined ? content : existingContent;
  const mdxString = stringifyMdxFile(frontmatter, finalContent);

  try {
    await fs.mkdir(dirPath, { recursive: true });
    await fs.writeFile(mdxPath, mdxString, "utf-8");
  } catch (diskErr: unknown) {
    console.warn(
      `Filesystem is read-only (${(diskErr as Error).message || "EROFS"}). Persisting to cloud storage overrides.`
    );
  }

  // Persist to Blob overrides (so changes persist on Vercel serverless
  // deployments). Serialized via the lock so this read-modify-write cycle
  // can't interleave with another concurrent admin action's cycle.
  await withOverridesLock(async () => {
    const overrides = await fetchBlobOverrides();
    overrides[slug] = {
      frontmatter,
      content: finalContent,
    };
    deletedTombstones.delete(slug);
    await saveBlobOverrides(overrides);
  });

  return {
    slug,
    frontmatter: frontmatter as unknown as AdminProject["frontmatter"],
    content: finalContent,
    hasThumbnail: Boolean(frontmatter.cover),
  };
}

export async function updateProjectThumbnail(
  slug: string,
  coverUrl: string,
  coverAlt?: string
): Promise<AdminProject | null> {
  const project = await getAdminProjectBySlug(slug);
  if (!project) return null;

  const previousCover = project.frontmatter.cover;

  const updatedFrontmatter = {
    ...project.frontmatter,
    cover: coverUrl,
    coverAlt: coverAlt || project.frontmatter.coverAlt || `${project.frontmatter.title} preview screenshot`,
  };

  const saved = await saveAdminProject(slug, updatedFrontmatter as unknown as Record<string, unknown>, project.content);

  // Clean up the previous cover image from Blob storage so replacing a
  // thumbnail doesn't leave an orphaned duplicate behind in the Media
  // Library (this is why the library accumulated many stale
  // `<slug>-<timestamp>.png` entries over time). Skip cleanup if the old
  // cover is still referenced elsewhere (e.g. in the gallery).
  const stillReferenced =
    project.frontmatter.gallery?.some((g) => g?.url === previousCover) ?? false;
  if (
    previousCover &&
    previousCover !== coverUrl &&
    previousCover.includes("blob.vercel-storage.com") &&
    !stillReferenced
  ) {
    const blobToken = getBlobToken();
    if (blobToken) {
      try {
        await del(previousCover, { token: blobToken });
      } catch (err) {
        console.warn(`Could not delete previous cover blob for ${slug}:`, err);
      }
    }
  }

  return saved;
}

// Removes a project's entry from the Blob overrides store (and in-memory
// cache). Used when a project is permanently deleted from disk so it
// doesn't resurrect via the "override-only" merge path in
// getAllAdminProjects().
export async function deleteAdminProjectOverride(slug: string): Promise<void> {
  await withOverridesLock(async () => {
    const overrides = await fetchBlobOverrides();
    if (slug in overrides) {
      delete overrides[slug];
    }
    memoryOverrides.delete(slug);
    deletedTombstones.set(slug, Date.now());
    await saveBlobOverrides(overrides);
  });
}

// Ensures exactly one project has `featuredOnHome: true`. Previously this
// called saveAdminProject() (a full independent Blob fetch+write round-trip)
// once per project that needed flipping, so as the project count grew this
// could mean 10-20+ sequential network round-trips for a single click,
// making the "single select" enforcement slow and prone to partial failure
// (timeout) on serverless — which could leave more than one project flagged
// as the spotlight. This now does a single batched Blob read + single
// batched Blob write, with per-project disk writes attempted best-effort
// (they're a no-op on read-only serverless filesystems anyway).
export async function setHomepageSpotlightProject(targetSlug: string): Promise<void> {
  await withOverridesLock(async () => {
    const projects = await getAllAdminProjects();
    const overrides = await fetchBlobOverrides();
    let changed = false;

    for (const p of projects) {
      const isTarget = p.slug === targetSlug;
      if (Boolean(p.frontmatter.featuredOnHome) !== isTarget) {
        const updatedFrontmatter = {
          ...p.frontmatter,
          featuredOnHome: isTarget,
        };

        const dirPath = path.join(PROJECTS_DIR, p.slug);
        const mdxPath = path.join(dirPath, "index.mdx");
        try {
          await fs.mkdir(dirPath, { recursive: true });
          await fs.writeFile(mdxPath, stringifyMdxFile(updatedFrontmatter, p.content), "utf-8");
        } catch {
          // Read-only filesystem (serverless) — the Blob overrides written
          // below are the source of truth in that environment.
        }

        overrides[p.slug] = {
          frontmatter: updatedFrontmatter,
          content: p.content,
        };
        deletedTombstones.delete(p.slug);
        changed = true;
      }
    }

    if (changed) {
      await saveBlobOverrides(overrides);
    }
  });
}
