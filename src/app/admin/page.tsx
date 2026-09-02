"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface AdminProject {
  slug: string;
  frontmatter: {
    title: string;
    summary: string;
    date: string;
    updated?: string;
    section?: "portfolio" | "labs" | "hidden";
    status?: "live" | "in-progress" | "featured" | "active" | "concept" | "archived";
    kind?: "website" | "app" | "pwa" | "tool" | "experiment";
    accent?: string;
    featured?: boolean;
    featuredOnHome?: boolean;
    draft?: boolean;
    tags?: string[];
    techStack?: string[];
    highlights?: string[];
    wipProgress?: string;
    url?: string;
    repo?: string;
    cover?: string;
    coverAlt?: string;
    gallery?: GalleryImage[];
    order?: number;
  };
  content: string;
  hasThumbnail: boolean;
}

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

interface LibraryImageItem {
  url: string;
  name: string;
  type: "database" | "local" | "project-cover";
  size?: number;
  uploadedAt?: string;
  sourceProject?: string;
  isUnused?: boolean;
}

interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ProjectFormData {
  title: string;
  slug: string;
  summary: string;
  date: string;
  section: "portfolio" | "labs" | "hidden";
  status: "live" | "in-progress" | "featured" | "archived";
  kind: "website" | "app" | "pwa" | "tool" | "experiment";
  accent: string;
  featuredOnHome: boolean;
  draft: boolean;
  tags: string;
  techStack: string;
  highlights: string;
  content: string;
  wipProgress: string;
  url: string;
  repo: string;
  cover: string;
  coverAlt: string;
  gallery: GalleryImage[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"projects" | "inbox">("projects");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [discovered, setDiscovered] = useState<DiscoveredProject[]>([]);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<"all" | "portfolio" | "labs" | "drafts">("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "name-asc" | "name-desc" | "status">("date-desc");
  const [discoverSearch, setDiscoverSearch] = useState("");
  const [discoverSort, setDiscoverSort] = useState<"pushed-desc" | "pushed-asc" | "name-asc" | "name-desc">("pushed-desc");
  const [githubUser, setGithubUser] = useState("1Zero9");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Media library picker state
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [libraryImages, setLibraryImages] = useState<LibraryImageItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [uploadingToLibrary, setUploadingToLibrary] = useState(false);
  const [libraryFilterTab, setLibraryFilterTab] = useState<"all" | "database" | "local" | "unused">("all");
  const [cleaningUpLibrary, setCleaningUpLibrary] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryTargetContext, setLibraryTargetContext] = useState<"modal" | "quick-slug" | "gallery">("modal");
  const [libraryTargetSlug, setLibraryTargetSlug] = useState<string | null>(null);
  // Direct Repo Import state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importUrlInput, setImportUrlInput] = useState("");
  const [importGithubToken, setImportGithubToken] = useState("");
  const [importingRepo, setImportingRepo] = useState(false);
  const libraryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Vetting / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    summary: "",
    date: new Date().toISOString().slice(0, 10),
    section: "portfolio",
    status: "live",
    kind: "website",
    accent: "#3855d6",
    featuredOnHome: false,
    draft: false,
    tags: "",
    techStack: "",
    highlights: "",
    content: "",
    wipProgress: "",
    url: "",
    repo: "",
    cover: "",
    coverAlt: "",
    gallery: [],
  });

  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [selectedProjectForUpload, setSelectedProjectForUpload] = useState<string | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }

  // Lock background page scroll while any modal is open, so mouse-wheel
  // input scrolls the modal's own content instead of the page behind it.
  useEffect(() => {
    const anyModalOpen = modalOpen || libraryModalOpen || importModalOpen;
    if (!anyModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen, libraryModalOpen, importModalOpen]);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  }, []);

  const scanProjects = useCallback(async (user: string = githubUser) => {
    setScanning(true);
    try {
      const res = await fetch(`/api/admin/discover?username=${encodeURIComponent(user)}`);
      if (res.ok) {
        const data = await res.json();
        setDiscovered(data.all || []);
      }
    } catch (err) {
      console.error("Failed to scan projects", err);
      showToast("Could not scan GitHub projects", "error");
    } finally {
      setScanning(false);
    }
  }, [githubUser]);

  // Check auth and initial load
  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch("/api/admin/auth");
        const authData = await authRes.json();
        if (!authData.authenticated) {
          router.push("/admin/login");
          return;
        }

        await loadProjects();
        await scanProjects();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router, loadProjects, scanProjects]);

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  // Project quick toggles
  async function toggleProjectDraft(project: AdminProject) {
    const newDraft = !project.frontmatter.draft;
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: project.slug,
          frontmatter: {
            ...project.frontmatter,
            draft: newDraft,
          },
        }),
      });

      if (res.ok) {
        showToast(
          `Project "${project.frontmatter.title}" is now ${newDraft ? "OFF (Draft)" : "ON (Live)"}`
        );
        await loadProjects();
      }
    } catch {
      showToast("Failed to update visibility", "error");
    }
  }

  async function changeProjectSection(project: AdminProject, newSection: "portfolio" | "labs" | "hidden") {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: project.slug,
          frontmatter: {
            ...project.frontmatter,
            section: newSection,
          },
        }),
      });

      if (res.ok) {
        showToast(`Moved "${project.frontmatter.title}" to ${newSection.toUpperCase()}`);
        await loadProjects();
      }
    } catch {
      showToast("Failed to move section", "error");
    }
  }

  async function changeProjectStatus(project: AdminProject, newStatus: string) {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: project.slug,
          frontmatter: {
            ...project.frontmatter,
            status: newStatus,
          },
        }),
      });

      if (res.ok) {
        showToast(`Status updated to ${newStatus}`);
        await loadProjects();
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  }

  // Quick Homepage Spotlight Assignment
  async function setHomepageSpotlight(slug: string) {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          action: "set-homepage-spotlight",
        }),
      });

      if (res.ok) {
        showToast(`Homepage spotlight set to "${slug}"`);
        await loadProjects();
      }
    } catch {
      showToast("Failed to set homepage spotlight", "error");
    }
  }

  // Pick a random published project as the homepage spotlight
  async function randomizeHomepageSpotlight() {
    const eligible = projects.filter(
      (p) => p.frontmatter.section !== "hidden" && !p.frontmatter.draft
    );
    const pool = eligible.length > 0 ? eligible : projects;
    if (pool.length === 0) return;
    const current = projects.find((p) => p.frontmatter.featuredOnHome)?.slug;
    const choices = pool.filter((p) => p.slug !== current);
    const finalPool = choices.length > 0 ? choices : pool;
    const pick = finalPool[Math.floor(Math.random() * finalPool.length)];
    if (!pick) return;
    await setHomepageSpotlight(pick.slug);
  }

  // Permanently delete a project
  async function handleDeleteProject(project: AdminProject) {
    if (
      !confirm(
        `Delete "${project.frontmatter.title}"? This permanently removes it from the site and cannot be undone.`
      )
    )
      return;

    try {
      const res = await fetch(
        `/api/admin/projects?slug=${encodeURIComponent(project.slug)}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete project");
      showToast(`Deleted "${project.frontmatter.title}"`);
      await loadProjects();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to delete project", "error");
    }
  }

  // Open Vetting Modal for a discovered candidate
  function openVettingModalForDiscovered(item: DiscoveredProject) {
    setEditingSlug(null);
    setFormData({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      date: new Date().toISOString().slice(0, 10),
      section: item.suggestedSection,
      status: item.suggestedStatus === "in-progress" ? "in-progress" : "live",
      kind: item.suggestedKind,
      accent: item.suggestedSection === "labs" ? "#f59e0b" : "#3855d6",
      featuredOnHome: false,
      draft: false,
      tags: item.topics.join(", "),
      techStack: item.techStack.join(", "),
      highlights: "",
      content: `## The Brief\n\n${item.summary}\n\n## The Architecture\n\n- Engineered with ${item.techStack.join(" and ")}.\n- Designed for speed, accessibility, and clean interface ergonomics.\n`,
      wipProgress: item.suggestedStatus === "in-progress" ? "Phase 1 · Active development" : "",
      url: item.liveUrl || "",
      repo: item.repoUrl || "",
      cover: "",
      coverAlt: "",
      gallery: [],
    });
    setModalOpen(true);
  }

  // Open Edit Modal for existing project
  function openEditModal(project: AdminProject) {
    setEditingSlug(project.slug);
    setFormData({
      title: project.frontmatter.title || "",
      slug: project.slug,
      summary: project.frontmatter.summary || "",
      date: project.frontmatter.date || new Date().toISOString().slice(0, 10),
      section: (project.frontmatter.section as "portfolio" | "labs" | "hidden") || (project.frontmatter.kind === "website" ? "portfolio" : "labs"),
      status: (project.frontmatter.status as "live" | "in-progress" | "featured" | "archived") || "live",
      kind: project.frontmatter.kind || "app",
      accent: project.frontmatter.accent || "#3855d6",
      featuredOnHome: Boolean(project.frontmatter.featuredOnHome),
      draft: Boolean(project.frontmatter.draft),
      tags: (project.frontmatter.tags || []).join(", "),
      techStack: (project.frontmatter.techStack || []).join(", "),
      highlights: (project.frontmatter.highlights || []).join("\n"),
      content: project.content || "",
      wipProgress: project.frontmatter.wipProgress || "",
      url: project.frontmatter.url || "",
      repo: project.frontmatter.repo || "",
      cover: project.frontmatter.cover || "",
      coverAlt: project.frontmatter.coverAlt || "",
      gallery: project.frontmatter.gallery || [],
    });
    setModalOpen(true);
  }

  // Save project from modal
  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean)
        : [];
      const techStackArray = formData.techStack
        ? formData.techStack.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
      const highlightsArray = formData.highlights
        ? formData.highlights.split("\n").map((h: string) => h.trim()).filter(Boolean)
        : [];

      const frontmatterPayload: Record<string, unknown> = {
        title: formData.title,
        summary: formData.summary,
        date: formData.date,
        section: formData.section,
        status: formData.status,
        kind: formData.kind,
        accent: formData.accent,
        featuredOnHome: formData.featuredOnHome,
        draft: formData.draft,
        tags: tagsArray,
        techStack: techStackArray,
        highlights: highlightsArray,
        wipProgress: formData.wipProgress || undefined,
        url: formData.url || undefined,
        repo: formData.repo || undefined,
      };

      if (formData.cover) {
        frontmatterPayload.cover = formData.cover;
        frontmatterPayload.coverAlt = formData.coverAlt || `${formData.title} screenshot`;
      }

      frontmatterPayload.gallery = formData.gallery.filter((img) => img.url && img.alt);

      if (editingSlug) {
        // Update
        const res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: editingSlug,
            frontmatter: frontmatterPayload,
            content: formData.content,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update project");
        }

        showToast(`Project "${formData.title}" updated successfully!`);
      } else {
        // Create new
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: formData.slug,
            frontmatter: frontmatterPayload,
            content: formData.content,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to create project");
        }

        showToast(`Project "${formData.title}" vetted and added to site!`);
      }

      setModalOpen(false);
      await loadProjects();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to save project", "error");
    }
  }

  function closeModal() {
    if (!editingSlug && modalOpen) {
      const proceed = confirm(
        `Discard "${formData.title || "this project"}"? It has not been saved yet — click "Approve & Publish to Site" instead if you want to keep it.`
      );
      if (!proceed) return;
    }
    setModalOpen(false);
  }

  // Trigger file upload for project
  function triggerUploadForProject(slug: string) {
    setSelectedProjectForUpload(slug);
    fileInputRef.current?.click();
  }

  async function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedProjectForUpload) return;

    setUploadingImage(selectedProjectForUpload);
    const targetSlug = selectedProjectForUpload;

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("slug", targetSlug);
      data.append("alt", `${targetSlug} thumbnail`);

      const res = await fetch("/api/admin/upload-thumbnail", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to upload thumbnail");
      }

      showToast(`Thumbnail uploaded for ${targetSlug}!`);
      await loadProjects();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to upload thumbnail", "error");
    } finally {
      setUploadingImage(null);
      setSelectedProjectForUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Upload a thumbnail file from within the edit modal. This only uploads
  // the file and stages the returned URL into the form — it does NOT write
  // to the project yet, so it behaves like every other field in the modal
  // (only takes effect when "Save Changes" is submitted, and is discarded
  // on Cancel).
  async function handleModalFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetSlug = formData.slug || editingSlug || "preview";
    setUploadingImage("modal");

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("slug", targetSlug);
      data.append("alt", formData.coverAlt || `${formData.title || targetSlug} screenshot`);
      data.append("attach", "false");

      const res = await fetch("/api/admin/upload-thumbnail", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      setFormData((prev: ProjectFormData) => ({
        ...prev,
        cover: json.coverUrl,
        coverAlt: prev.coverAlt || `${prev.title || targetSlug} preview`,
      }));

      showToast(`Image uploaded. Click "Save Changes" to apply it.`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to upload", "error");
    } finally {
      setUploadingImage(null);
      if (modalFileInputRef.current) modalFileInputRef.current.value = "";
    }
  }

  // Upload a screenshot file directly into the gallery from within the edit
  // modal. Like the thumbnail uploader, this only uploads the file and
  // stages the returned URL into the form — it's discarded on Cancel and
  // only persisted when "Save Changes" is submitted.
  async function handleGalleryFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetSlug = formData.slug || editingSlug || "preview";
    setUploadingGalleryImage(true);

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("slug", targetSlug);
      data.append("alt", `${formData.title || targetSlug} screenshot`);
      data.append("attach", "false");

      const res = await fetch("/api/admin/upload-thumbnail", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      setFormData((prev: ProjectFormData) => ({
        ...prev,
        gallery: [
          ...prev.gallery,
          { url: json.coverUrl, alt: `${prev.title || targetSlug} screenshot`, caption: "" },
        ],
      }));

      showToast(`Screenshot added. Click "Save Changes" to apply it.`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to upload", "error");
    } finally {
      setUploadingGalleryImage(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
    }
  }

  function updateGalleryImage(index: number, patch: Partial<GalleryImage>) {
    setFormData((prev: ProjectFormData) => ({
      ...prev,
      gallery: prev.gallery.map((img, i) => (i === index ? { ...img, ...patch } : img)),
    }));
  }

  function removeGalleryImage(index: number) {
    setFormData((prev: ProjectFormData) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  function moveGalleryImage(index: number, direction: -1 | 1) {
    setFormData((prev: ProjectFormData) => {
      const next = [...prev.gallery];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[index]!;
      next[index] = next[target]!;
      next[target] = temp;
      return { ...prev, gallery: next };
    });
  }

  // Open Media Library
  async function openMediaLibrary(context: "modal" | "quick-slug" | "gallery", targetSlug?: string) {
    setLibraryTargetContext(context);
    setLibraryTargetSlug(targetSlug || (context === "modal" ? (formData.slug || editingSlug) : null));
    setLibraryModalOpen(true);
    setLoadingLibrary(true);
    try {
      const res = await fetch("/api/admin/media-library");
      if (res.ok) {
        const json = await res.json();
        setLibraryImages(json.images || []);
      } else {
        throw new Error("Failed to load library");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to load library", "error");
    } finally {
      setLoadingLibrary(false);
    }
  }

  // Select an image from library
  async function handleSelectLibraryImage(img: LibraryImageItem) {
    // Picking from the library while editing a project in the modal only
    // stages the choice into the form — it's applied when "Save Changes" is
    // submitted, same as an uploaded file or a manually typed cover URL.
    if (libraryTargetContext === "modal") {
      setFormData((prev: ProjectFormData) => ({
        ...prev,
        cover: img.url,
        coverAlt: prev.coverAlt || `${prev.title || "Project"} screenshot`,
      }));
      showToast(`Thumbnail staged. Click "Save Changes" to apply it.`);
      setLibraryModalOpen(false);
      return;
    }

    if (libraryTargetContext === "gallery") {
      setFormData((prev: ProjectFormData) => ({
        ...prev,
        gallery: [
          ...prev.gallery,
          { url: img.url, alt: `${prev.title || "Project"} screenshot`, caption: "" },
        ],
      }));
      showToast(`Screenshot added to gallery. Click "Save Changes" to apply it.`);
      setLibraryModalOpen(false);
      return;
    }

    // Quick-action from the project list (no open form/Save step) — commit
    // immediately so it updates everywhere in real time.
    const slugToUpdate = libraryTargetSlug;
    if (slugToUpdate) {
      setUploadingImage(slugToUpdate);
      try {
        const res = await fetch("/api/admin/upload-thumbnail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: slugToUpdate,
            coverUrl: img.url,
            alt: `${slugToUpdate} screenshot`,
          }),
        });
        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.error || "Failed to assign thumbnail");
        }
        showToast(`Thumbnail assigned & saved for ${slugToUpdate}!`);
        await loadProjects();
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : "Failed to assign image", "error");
      } finally {
        setUploadingImage(null);
      }
    } else {
      showToast(`Selected "${img.name}" from library!`);
    }

    setLibraryModalOpen(false);
  }

  // Direct upload inside library
  async function handleLibraryFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingToLibrary(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/admin/media-library", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      showToast(`Uploaded "${json.name}" to library!`);
      await openMediaLibrary(libraryTargetContext, libraryTargetSlug || undefined);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setUploadingToLibrary(false);
      if (libraryFileInputRef.current) libraryFileInputRef.current.value = "";
    }
  }

  // Delete image from library
  async function handleDeleteLibraryImage(url: string) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch("/api/admin/media-library", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete");
      showToast("Image deleted");
      await openMediaLibrary(libraryTargetContext, libraryTargetSlug || undefined);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to delete image", "error");
    }
  }

  // Bulk-delete every database-stored image flagged as unused (not
  // referenced by any project's cover or gallery) — cleans up stale
  // re-uploads left behind by earlier thumbnail replacements or abandoned
  // imports. Local static files aren't included since they can't be
  // deleted from the read-only serverless filesystem anyway.
  async function handleCleanupUnused() {
    const unused = libraryImages.filter((img) => img.isUnused && img.type === "database");
    if (unused.length === 0) {
      showToast("No unused images to clean up");
      return;
    }
    if (
      !confirm(
        `Delete ${unused.length} unused image${unused.length === 1 ? "" : "s"}? This can't be undone.`
      )
    ) {
      return;
    }

    setCleaningUpLibrary(true);
    let failed = 0;
    for (const img of unused) {
      try {
        const res = await fetch("/api/admin/media-library", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: img.url }),
        });
        if (!res.ok) failed++;
      } catch {
        failed++;
      }
    }
    setCleaningUpLibrary(false);
    showToast(
      failed === 0
        ? `Deleted ${unused.length} unused image${unused.length === 1 ? "" : "s"}`
        : `Deleted ${unused.length - failed} of ${unused.length} — ${failed} failed`,
      failed === 0 ? "success" : "error"
    );
    await openMediaLibrary(libraryTargetContext, libraryTargetSlug || undefined);
  }

  // Copy Image URL to clipboard
  function handleCopyImageUrl(url: string) {
    navigator.clipboard.writeText(url);
    showToast("Copied image URL to clipboard!");
  }

  // Import directly by GitHub repository URL
  async function handleImportByUrl(rawUrl?: string) {
    const url = (rawUrl || importUrlInput).trim();
    if (!url) {
      showToast("Please enter a GitHub repository URL or name", "error");
      return;
    }

    setImportingRepo(true);
    try {
      const res = await fetch("/api/admin/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          token: importGithubToken.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");

      const p: DiscoveredProject = json.project;
      setFormData({
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        date: new Date().toISOString().slice(0, 10),
        section: p.suggestedSection,
        status: p.suggestedStatus,
        kind: p.suggestedKind,
        accent: "#3855d6",
        featuredOnHome: false,
        draft: false,
        tags: p.topics.length > 0 ? p.topics.join(", ") : "Platform, Management",
        techStack: p.techStack.length > 0 ? p.techStack.join(", ") : "Next.js, TypeScript, React",
        highlights: `${p.title} administrative management platform\nRole-based secure member directory\nOptimized responsive workflow interface`,
        content: `## The Brief\n\n${p.summary}\n\n## The Architecture\n\n- **Management Workflow** — Built to streamline administrative operations and team logistics.\n- **Performance** — Client-side caching and responsive interface across mobile and desktop.\n- **Repository** — [View on GitHub](${p.repoUrl})\n`,
        wipProgress: "",
        url: p.liveUrl || "",
        repo: p.repoUrl,
        cover: "",
        coverAlt: `${p.title} preview screenshot`,
        gallery: [],
      });

      setEditingSlug(null);
      setImportModalOpen(false);
      setImportUrlInput("");
      setModalOpen(true);
      showToast(`Loaded ${p.title} into the editor — nothing is saved yet. Click "Approve & Publish to Site" to add it.`);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to import repository", "error");
    } finally {
      setImportingRepo(false);
    }
  }

  // Filter projects
  const filteredProjects = projects
    .filter((p) => {
      // Section filtering
      const section = p.frontmatter.section || (p.frontmatter.kind === "website" ? "portfolio" : "labs");
      if (sectionFilter === "portfolio" && section !== "portfolio") return false;
      if (sectionFilter === "labs" && section !== "labs") return false;
      if (sectionFilter === "drafts" && !p.frontmatter.draft && section !== "hidden") return false;

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.frontmatter.title?.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        const matchTech = (p.frontmatter.techStack || []).some((t) => t.toLowerCase().includes(q));
        const matchTags = (p.frontmatter.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchSlug || matchTech || matchTags;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return (a.frontmatter.title || a.slug).localeCompare(b.frontmatter.title || b.slug);
        case "name-desc":
          return (b.frontmatter.title || b.slug).localeCompare(a.frontmatter.title || a.slug);
        case "status":
          return (a.frontmatter.status || "").localeCompare(b.frontmatter.status || "");
        case "date-asc":
          return (a.frontmatter.date || "").localeCompare(b.frontmatter.date || "");
        case "date-desc":
        default:
          return (b.frontmatter.date || "").localeCompare(a.frontmatter.date || "");
      }
    });

  const pendingDiscovered = discovered
    .filter((d) => !d.isAlreadyManaged)
    .filter((d) => {
      if (!discoverSearch.trim()) return true;
      const q = discoverSearch.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.slug.toLowerCase().includes(q) ||
        d.techStack.some((t) => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      switch (discoverSort) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "pushed-asc":
          return (a.pushedAt || "").localeCompare(b.pushedAt || "");
        case "pushed-desc":
        default:
          return (b.pushedAt || "").localeCompare(a.pushedAt || "");
      }
    });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="size-5 rounded-full bg-signal animate-ping" />
          <p className="text-xs font-mono text-muted">Loading Workbench Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-slide-up ${
            notification.type === "error"
              ? "bg-red-600 text-white"
              : "bg-fg text-bg border border-border"
          }`}
        >
          <span>{notification.type === "error" ? "⚠️" : "✓"}</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Hidden file input for table uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
      />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="size-3 rounded-full bg-signal animate-pulse" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              Workbench Admin
            </h1>
            <p className="text-xs text-muted">
              Project management, section routing & live thumbnail studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-fg hover:border-border-hover transition-colors flex items-center gap-1.5"
          >
            <span>Live Site</span>
            <span>↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-surface-hover hover:bg-surface border border-border text-xs font-semibold text-fg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-bg-subtle border border-border rounded-xl mb-8">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "projects"
              ? "bg-surface text-fg font-semibold shadow-sm border border-border"
              : "text-muted hover:text-fg"
          }`}
        >
          <span>🗂️ Managed Projects & Thumbnails</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-bg-subtle text-fg border border-border font-bold">
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "inbox"
              ? "bg-surface text-fg font-semibold shadow-sm border border-border"
              : "text-muted hover:text-fg"
          }`}
        >
          <span>📥 Discovered Inbox</span>
          {pendingDiscovered.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-wip-amber/20 text-wip-amber font-bold border border-wip-amber/30 animate-pulse">
              {pendingDiscovered.length}
            </span>
          )}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface hover:bg-surface-hover border border-border text-fg font-semibold rounded-lg text-xs transition-colors shadow-sm"
          >
            <span>🔗</span>
            <span>+ Import by GitHub URL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingSlug(null);
              setFormData({
                title: "",
                slug: "",
                summary: "",
                date: new Date().toISOString().slice(0, 10),
                section: "portfolio",
                status: "live",
                kind: "website",
                accent: "#3855d6",
                featuredOnHome: false,
                draft: false,
                tags: "web, design",
                techStack: "Next.js, TypeScript, Tailwind CSS",
                highlights: "",
                content: "",
                wipProgress: "",
                url: "",
                repo: "",
                cover: "",
                coverAlt: "",
                gallery: [],
              });
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-fg text-bg font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity"
          >
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MANAGED PROJECTS & THUMBNAILS (UNIFIED) */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          {/* Homepage Spotlight Selector Banner */}
          <div className="p-4 sm:p-5 bg-surface border border-signal/30 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <span className="text-xs font-mono text-signal-text uppercase tracking-wider font-bold block">
                  Homepage Spotlight Project
                </span>
                <span className="text-xs text-muted">
                  Choose which single project is showcased on the home screen hero spotlight card.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={projects.find((p) => p.frontmatter.featuredOnHome)?.slug || projects[0]?.slug || ""}
                onChange={(e) => setHomepageSpotlight(e.target.value)}
                aria-label="Homepage spotlight project"
                className="px-3 py-2 bg-bg-subtle border border-border rounded-xl text-xs font-semibold text-fg focus:outline-none focus:border-accent font-mono"
              >
                {projects.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.frontmatter.title} ({p.frontmatter.section || "portfolio"})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={randomizeHomepageSpotlight}
                className="px-3 py-2 bg-bg-subtle border border-border rounded-xl text-xs font-semibold text-fg hover:border-border-hover transition-colors flex items-center gap-1.5"
                title="Randomly pick a different project to spotlight on the homepage"
              >
                <span>🎲</span>
                <span>Random</span>
              </button>
            </div>
          </div>

          {/* Controls & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface border border-border rounded-2xl">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSectionFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "all"
                    ? "bg-fg text-bg border-fg"
                    : "bg-bg-subtle text-muted border-border hover:border-border-hover"
                }`}
              >
                All ({projects.length})
              </button>
              <button
                onClick={() => setSectionFilter("portfolio")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "portfolio"
                    ? "bg-fg text-bg border-fg"
                    : "bg-bg-subtle text-muted border-border hover:border-border-hover"
                }`}
              >
                Portfolio Only
              </button>
              <button
                onClick={() => setSectionFilter("labs")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "labs"
                    ? "bg-fg text-bg border-fg"
                    : "bg-bg-subtle text-muted border-border hover:border-border-hover"
                }`}
              >
                Labs Only
              </button>
              <button
                onClick={() => setSectionFilter("drafts")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "drafts"
                    ? "bg-fg text-bg border-fg"
                    : "bg-bg-subtle text-muted border-border hover:border-border-hover"
                }`}
              >
                Drafts / Hidden
              </button>
            </div>

            {/* View Mode & Search */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* View mode toggle */}
              <div className="flex bg-bg-subtle border border-border rounded-xl p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-surface text-fg shadow-sm border border-border"
                      : "text-muted hover:text-fg"
                  }`}
                  title="Detailed list with controls"
                >
                  <span>📋 List Controls</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === "grid"
                      ? "bg-surface text-fg shadow-sm border border-border"
                      : "text-muted hover:text-fg"
                  }`}
                  title="Visual studio cards with large thumbnail uploaders"
                >
                  <span>🖼️ Studio Grid</span>
                </button>
              </div>

              {/* Search */}
              <div className="w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 bg-bg-subtle border border-border rounded-xl text-xs text-fg placeholder:text-faint focus:outline-none focus:border-accent"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort projects by"
                className="px-3 py-1.5 bg-bg-subtle border border-border rounded-xl text-xs font-semibold text-fg focus:outline-none focus:border-accent"
              >
                <option value="date-desc">Date Added (Newest)</option>
                <option value="date-asc">Date Added (Oldest)</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* VIEW MODE 1: DETAILED LIST WITH INLINE THUMBNAIL UPLOAD */}
          {viewMode === "list" ? (
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const isLive = !project.frontmatter.draft;
                const currentSection =
                  project.frontmatter.section ||
                  (project.frontmatter.kind === "website" ? "portfolio" : "labs");
                const isDbImage = Boolean(project.frontmatter.cover?.startsWith("/api/images/"));

                return (
                  <div
                    key={project.slug}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-5 bg-surface border border-border rounded-2xl shadow-card hover:border-border-hover transition-all"
                  >
                    {/* Left: Thumbnail & Project Meta */}
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      {/* Interactive Thumbnail Box with 1-Click Upload */}
                      <div
                        onClick={() => triggerUploadForProject(project.slug)}
                        className="relative group size-20 sm:size-24 rounded-xl overflow-hidden bg-bg-subtle border border-border shrink-0 cursor-pointer shadow-sm"
                        title="Click to replace/upload thumbnail"
                      >
                        {project.frontmatter.cover ? (
                          <Image
                            src={project.frontmatter.cover}
                            alt={project.frontmatter.coverAlt || project.frontmatter.title}
                            fill
                            sizes="96px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="size-full flex flex-col items-center justify-center gap-1 text-muted text-xs p-2 text-center">
                            <span className="text-base">📷</span>
                            <span className="text-[10px] font-mono leading-none">Add Image</span>
                          </div>
                        )}

                        {/* Hover Overlay with Upload Icon */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-semibold text-center p-1">
                          <span>📷</span>
                          <span>Change</span>
                        </div>

                        {uploadingImage === project.slug && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                            <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Info & Badges */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-base font-bold text-fg truncate">
                            {project.frontmatter.title}
                          </h2>
                          <span className="text-xs font-mono text-muted">
                            ({project.slug})
                          </span>

                          {/* Storage Pill */}
                          {project.frontmatter.cover && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              isDbImage
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/30 font-semibold"
                                : "bg-bg-subtle text-muted border-border"
                            }`}>
                              {isDbImage ? "☁️ Database" : "📁 Local Image"}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted line-clamp-2 mb-2 max-w-2xl">
                          {project.frontmatter.summary}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="badge-kind">{project.frontmatter.kind || "app"}</span>
                          {project.frontmatter.techStack?.slice(0, 3).map((t) => (
                            <span key={t} className="tech-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Controls & Toggles */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-border shrink-0">
                      {/* Live / Draft Visibility Switch */}
                      <button
                        onClick={() => toggleProjectDraft(project)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                          isLive
                            ? "bg-live-green/15 text-live-green border-live-green/30 hover:bg-live-green/25"
                            : "bg-muted/15 text-muted border-border hover:bg-muted/25"
                        }`}
                        title="Toggle visibility on site"
                      >
                        <span
                          className={`size-2 rounded-full ${
                            isLive ? "bg-live-green animate-pulse" : "bg-muted"
                          }`}
                        />
                        <span>{isLive ? "ON (Live)" : "OFF (Draft)"}</span>
                      </button>

                      {/* Home Spotlight Quick Toggle */}
                      {project.frontmatter.featuredOnHome ? (
                        <span className="px-2.5 py-1.5 rounded-xl text-xs font-bold font-mono bg-signal/15 text-fg border border-signal/40 flex items-center gap-1 shadow-sm">
                          ⭐ On Home
                        </span>
                      ) : (
                        <button
                          onClick={() => setHomepageSpotlight(project.slug)}
                          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted hover:text-fg bg-bg-subtle hover:bg-surface border border-border hover:border-signal/40 transition-colors"
                          title="Feature this project as the single spotlight on the homepage"
                        >
                          ⭐ Set on Home
                        </button>
                      )}

                      {/* Section Selector */}
                      <div className="flex items-center bg-bg-subtle border border-border rounded-xl p-0.5 text-xs">
                        <button
                          onClick={() => changeProjectSection(project, "portfolio")}
                          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                            currentSection === "portfolio"
                              ? "bg-surface text-fg font-bold shadow-sm"
                              : "text-muted hover:text-fg"
                          }`}
                        >
                          Portfolio
                        </button>
                        <button
                          onClick={() => changeProjectSection(project, "labs")}
                          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                            currentSection === "labs"
                              ? "bg-surface text-fg font-bold shadow-sm"
                              : "text-muted hover:text-fg"
                          }`}
                        >
                          Labs
                        </button>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={project.frontmatter.status || "live"}
                        onChange={(e) => changeProjectStatus(project, e.target.value)}
                        className="px-2.5 py-1.5 bg-bg-subtle border border-border rounded-xl text-xs text-fg font-medium focus:outline-none"
                      >
                        <option value="live">Live</option>
                        <option value="in-progress">Building Now</option>
                        <option value="featured">Featured</option>
                        <option value="archived">Archived</option>
                      </select>

                      {/* Thumbnail Upload Button */}
                      <button
                        onClick={() => triggerUploadForProject(project.slug)}
                        disabled={uploadingImage === project.slug}
                        className="px-3 py-1.5 bg-surface hover:bg-surface-hover border border-border rounded-xl text-xs font-semibold text-fg transition-colors flex items-center gap-1.5"
                        title="Upload/replace image file"
                      >
                        <span>📷</span>
                        <span>{uploadingImage === project.slug ? "Uploading..." : "Upload"}</span>
                      </button>

                      {/* Pick from Library Button */}
                      <button
                        onClick={() => openMediaLibrary("quick-slug", project.slug)}
                        className="px-3 py-1.5 bg-bg-subtle hover:bg-surface border border-border rounded-xl text-xs font-semibold text-fg transition-colors flex items-center gap-1.5"
                        title="Pick from stored library"
                      >
                        <span>🖼️</span>
                        <span>Library</span>
                      </button>

                      {/* Edit Full Details */}
                      <button
                        onClick={() => openEditModal(project)}
                        className="px-3 py-1.5 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
                      >
                        Edit
                      </button>

                      {/* View Live Case Study */}
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="p-2 bg-surface hover:bg-surface-hover border border-border rounded-xl text-xs text-muted hover:text-fg transition-colors"
                        title="View Page"
                      >
                        ↗
                      </Link>

                      {/* Delete Project */}
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs transition-colors"
                        title="Delete project permanently"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VIEW MODE 2: VISUAL STUDIO GRID (16:10 Cards) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const isDbImage = Boolean(project.frontmatter.cover?.startsWith("/api/images/"));
                return (
                  <div
                    key={project.slug}
                    className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card hover:border-border-hover transition-all flex flex-col justify-between group"
                  >
                    {/* Top 16:10 Thumbnail Canvas with Direct Upload Trigger */}
                    <div
                      onClick={() => triggerUploadForProject(project.slug)}
                      className="relative aspect-16/10 bg-bg-subtle border-b border-border overflow-hidden cursor-pointer group"
                    >
                      {project.frontmatter.cover ? (
                        <Image
                          src={project.frontmatter.cover}
                          alt={project.frontmatter.coverAlt || project.frontmatter.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                      ) : (
                        <div className="size-full flex flex-col items-center justify-center p-6 text-center text-muted">
                          <span className="text-3xl mb-2 opacity-50">🖼️</span>
                          <span className="text-xs font-mono font-semibold">Click to Upload Thumbnail</span>
                          <span className="text-[10px] opacity-70">PNG, JPG, WebP</span>
                        </div>
                      )}

                      {/* Hover Upload Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                        <span className="text-xl mb-1">📷</span>
                        <span className="text-xs font-semibold">Replace Thumbnail</span>
                      </div>

                      {uploadingImage === project.slug && (
                        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white text-xs gap-2">
                          <span className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Uploading image...</span>
                        </div>
                      )}

                      {/* Badges Overlay */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="badge-kind text-[10px] font-mono shadow-sm">
                          {project.frontmatter.section || "portfolio"}
                        </span>
                        {project.frontmatter.featuredOnHome && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-signal text-black shadow-sm">
                            ⭐ Home
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shadow-sm ${
                          isDbImage
                            ? "bg-blue-600 text-white border-blue-400 font-semibold"
                            : "bg-surface/90 text-fg border-border"
                        }`}>
                          {isDbImage ? "☁️ Database" : "📁 Local"}
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Action Bar */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-base font-bold text-fg mb-1">
                          {project.frontmatter.title}
                        </h2>
                        <p className="text-xs font-mono text-muted mb-2">
                          /{project.slug}
                        </p>
                        <p className="text-xs text-muted line-clamp-2 mb-4">
                          {project.frontmatter.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => triggerUploadForProject(project.slug)}
                          disabled={uploadingImage === project.slug}
                          className="flex-1 py-1.5 px-2 bg-surface hover:bg-surface-hover border border-border rounded-xl text-xs font-semibold text-fg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>📷</span>
                          <span>Upload</span>
                        </button>

                        <button
                          onClick={() => openMediaLibrary("quick-slug", project.slug)}
                          className="flex-1 py-1.5 px-2 bg-bg-subtle hover:bg-surface border border-border rounded-xl text-xs font-semibold text-fg transition-colors flex items-center justify-center gap-1"
                        >
                          <span>🖼️</span>
                          <span>Library</span>
                        </button>

                        <button
                          onClick={() => openEditModal(project)}
                          className="py-1.5 px-3 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs transition-colors"
                          title="Delete project permanently"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DISCOVERED WORKBENCH INBOX */}
      {activeTab === "inbox" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-fg">Automatic Inclusion & Vetting Inbox</h2>
              <p className="text-sm text-muted">
                Repositories scanned from GitHub ({githubUser}) or imported directly by URL. Review and approve which ones to publish.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={githubUser}
                onChange={(e) => setGithubUser(e.target.value)}
                placeholder="GitHub username"
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-fg font-mono"
              />
              <button
                onClick={() => scanProjects(githubUser)}
                disabled={scanning}
                className="px-3 py-1.5 bg-surface-hover border border-border rounded-lg text-xs font-semibold text-fg hover:bg-surface transition-colors"
              >
                {scanning ? "Scanning..." : "Rescan"}
              </button>
              <input
                type="text"
                placeholder="Search discovered..."
                value={discoverSearch}
                onChange={(e) => setDiscoverSearch(e.target.value)}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-fg placeholder:text-faint focus:outline-none focus:border-accent"
              />
              <select
                value={discoverSort}
                onChange={(e) => setDiscoverSort(e.target.value as typeof discoverSort)}
                className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-fg focus:outline-none focus:border-accent"
              >
                <option value="pushed-desc">Last Pushed (Newest)</option>
                <option value="pushed-asc">Last Pushed (Oldest)</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
              </select>
            </div>
          </div>

          {/* Direct Import Banner */}
          <div className="p-5 bg-surface border border-border rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🔗</span>
              <div>
                <h3 className="text-sm font-bold text-fg">Add Any GitHub Repository by URL</h3>
                <p className="text-xs text-muted">
                  Have a specific repo that wasn&apos;t automatically listed (e.g. private or org repo)? Paste it here to import instantly.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="https://github.com/1Zero9/rvr-2014-teamadmin"
                value={importUrlInput}
                onChange={(e) => setImportUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleImportByUrl();
                }}
                className="w-full md:w-80 px-3.5 py-2 bg-bg-subtle border border-border rounded-xl text-xs font-mono text-fg placeholder:text-faint focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => handleImportByUrl()}
                disabled={importingRepo || !importUrlInput.trim()}
                className="px-4 py-2 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <span>{importingRepo ? "Fetching..." : "Import & Vet"}</span>
              </button>
            </div>
          </div>

          {pendingDiscovered.length === 0 ? (
            <div className="p-12 text-center bg-surface border border-border rounded-2xl">
              <span className="text-3xl mb-3 block">✨</span>
              <h3 className="text-lg font-bold text-fg">Workbench Inbox is Clear</h3>
              <p className="text-sm text-muted mt-1 max-w-md mx-auto">
                All discovered repositories have either been vetted and added to the site or are already managed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingDiscovered.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-6 bg-surface border border-border rounded-2xl shadow-card hover:border-border-hover transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-wip-amber/15 text-wip-amber font-semibold border border-wip-amber/30">
                        New Discovery
                      </span>
                      <span className="text-xs font-mono text-muted">
                        {item.pushedAt?.slice(0, 10)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-fg mb-1.5">{item.title}</h3>
                    <p className="text-xs font-mono text-accent mb-3">{item.slug}</p>

                    <p className="text-sm text-muted line-clamp-3 mb-4">{item.summary}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.techStack.map((tech) => (
                        <span key={tech} className="tech-tag text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="p-3 bg-bg-subtle border border-border rounded-xl text-xs space-y-1 mb-6">
                      <div className="flex justify-between">
                        <span className="text-muted">Suggested Section:</span>
                        <span className="font-semibold text-fg uppercase">{item.suggestedSection}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Suggested Kind:</span>
                        <span className="font-semibold text-fg">{item.suggestedKind}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => openVettingModalForDiscovered(item)}
                      className="flex-1 py-2 px-3 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
                    >
                      Vet & Add to Site →
                    </button>
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 border border-border rounded-xl text-muted hover:text-fg hover:border-border-hover transition-colors text-xs"
                      title="View on GitHub"
                    >
                      ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VETTING & EDIT MODAL WITH INTEGRATED THUMBNAIL UPLOADER */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          {/* Hidden file input for modal uploads */}
          <input
            type="file"
            ref={modalFileInputRef}
            onChange={handleModalFileUpload}
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
          />
          <input
            type="file"
            ref={galleryFileInputRef}
            onChange={handleGalleryFileUpload}
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            className="hidden"
          />

          <form
            onSubmit={handleSaveProject}
            className="w-full max-w-2xl max-h-[88vh] bg-surface border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 sm:p-8 pb-4 border-b border-border shrink-0">
              <div>
                <h2 className="text-xl font-bold text-fg">
                  {editingSlug ? `Edit Project: ${formData.title}` : "Vet & Add New Project"}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Configure section placement, spotlight, metadata, story, and image.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="size-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-fg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4">
              {!editingSlug && (
                <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400">
                  Draft — not saved yet. This project will not appear anywhere else until you click &quot;Approve &amp; Publish to Site&quot; below.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingSlug)}
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono focus:outline-none focus:border-accent disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Section, Visibility & Spotlight Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-bg-subtle border border-border rounded-xl">
                <p className="sm:col-span-3 text-xs text-muted leading-relaxed">
                  <strong className="text-fg">Visibility</strong> is the master on/off switch — a draft never
                  appears anywhere. <strong className="text-fg">Section</strong> picks which page it lives on.
                  <strong className="text-fg"> Status</strong> is the badge shown on the card, but{" "}
                  <em>Archived</em> also hides it everywhere (like a second draft toggle), and{" "}
                  <em>Featured</em> can win the homepage spotlight below if nothing else is pinned there.
                </p>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1 font-bold">
                    Section Placement *
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value as "portfolio" | "labs" | "hidden" })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-fg font-semibold focus:outline-none focus:border-accent"
                  >
                    <option value="portfolio">Portfolio (/projects)</option>
                    <option value="labs">Labs (/labs)</option>
                    <option value="hidden">Hidden / Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Visibility *
                  </label>
                  <select
                    value={formData.draft ? "draft" : "live"}
                    onChange={(e) => setFormData({ ...formData, draft: e.target.value === "draft" })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-fg focus:outline-none focus:border-accent"
                  >
                    <option value="live">ON — Live on site</option>
                    <option value="draft">OFF — Hidden Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Status Badge
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "live" | "in-progress" | "featured" | "archived" })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-fg focus:outline-none focus:border-accent"
                  >
                    <option value="live">Live</option>
                    <option value="in-progress">Building Now</option>
                    <option value="featured">Featured</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex items-center gap-2 pt-2 border-t border-border">
                  <input
                    type="checkbox"
                    id="featuredOnHome"
                    checked={formData.featuredOnHome}
                    onChange={(e) => setFormData({ ...formData, featuredOnHome: e.target.checked })}
                    className="size-4 text-signal rounded accent-signal cursor-pointer"
                  />
                  <label htmlFor="featuredOnHome" className="text-xs font-semibold text-fg cursor-pointer">
                    ⭐ Feature as Homepage Spotlight (showcase this project on the home screen)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">
                  Summary / Elevator Pitch *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg focus:outline-none focus:border-accent"
                />
              </div>

              {/* Highlights List */}
              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">
                  Key Highlights / Bullet Points (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="High-contrast magazine aesthetic tailored for music collectors&#10;Dynamic release catalog indexing rare pressings&#10;Fast search with instant genre and decade filtering"
                  className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-xs text-fg focus:outline-none focus:border-accent font-mono"
                />
              </div>

              {/* MDX Case Study Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-muted">
                    Case Study Story & Body (Markdown / MDX)
                  </label>
                  <span className="text-[10px] font-mono text-muted">
                    Supports ## headings, bullet points & code
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="## The Brief&#10;&#10;Describe the challenge and problem solved...&#10;&#10;## The Architecture&#10;&#10;- Key engineering decisions..."
                  className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-xs text-fg focus:outline-none focus:border-accent font-mono leading-relaxed"
                />
              </div>

              {/* Thumbnail Image Studio in Modal */}
              <div className="p-4 bg-bg-subtle border border-border rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-mono uppercase text-muted font-bold">
                    Project Thumbnail Image
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openMediaLibrary("modal")}
                      className="px-2.5 py-1 bg-surface hover:bg-surface-hover border border-border text-fg font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                    >
                      <span>🖼️</span>
                      <span>Pick from Library</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => modalFileInputRef.current?.click()}
                      disabled={uploadingImage === "modal"}
                      className="px-2.5 py-1 bg-fg text-bg font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity flex items-center gap-1"
                    >
                      <span>📷</span>
                      <span>{uploadingImage === "modal" ? "Uploading..." : "Upload File"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Thumbnail Preview Box */}
                  <div
                    onClick={() => modalFileInputRef.current?.click()}
                    className="sm:col-span-4 relative aspect-16/10 rounded-xl overflow-hidden bg-surface border border-border cursor-pointer group flex items-center justify-center"
                    title="Click to choose a file"
                  >
                    {formData.cover ? (
                      <Image
                        src={formData.cover}
                        alt={formData.coverAlt || "Thumbnail"}
                        fill
                        sizes="160px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-center text-muted text-xs">
                        <span className="text-xl mb-1">🖼️</span>
                        <span className="text-[10px] font-mono">No Image Set</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                      Upload
                    </div>
                  </div>

                  {/* Manual Inputs for Cover URL & Alt */}
                  <div className="sm:col-span-8 space-y-2">
                    <div>
                      <input
                        type="text"
                        value={formData.cover}
                        onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                        placeholder="/images/projects/cover.png"
                        className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-fg font-mono focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={formData.coverAlt}
                        onChange={(e) => setFormData({ ...formData, coverAlt: e.target.value })}
                        placeholder="Image description (Alt text)"
                        className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-fg focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery / App Screenshots Studio */}
              <div className="p-4 bg-bg-subtle border border-border rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-muted font-bold">
                      Gallery & Screenshots
                    </label>
                    <p className="text-[11px] text-muted mt-0.5">
                      App Store-style previews shown on the case study page — no login required to view.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openMediaLibrary("gallery")}
                      className="px-2.5 py-1 bg-surface hover:bg-surface-hover border border-border text-fg font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                    >
                      <span>🖼️</span>
                      <span>Pick from Library</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={uploadingGalleryImage}
                      className="px-2.5 py-1 bg-fg text-bg font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity flex items-center gap-1"
                    >
                      <span>📷</span>
                      <span>{uploadingGalleryImage ? "Uploading..." : "Upload File"}</span>
                    </button>
                  </div>
                </div>

                {formData.gallery.length === 0 ? (
                  <div className="text-xs text-muted text-center py-6 border border-dashed border-border rounded-lg">
                    No screenshots yet. Add a few to show the app in action.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.gallery.map((img, i) => (
                      <div
                        key={`${img.url}-${i}`}
                        className="flex gap-3 p-2 bg-surface border border-border rounded-lg"
                      >
                        <div className="relative w-20 h-14 shrink-0 rounded-md overflow-hidden bg-bg-subtle border border-border">
                          <Image
                            src={img.url}
                            alt={img.alt || "Gallery image"}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            value={img.alt}
                            onChange={(e) => updateGalleryImage(i, { alt: e.target.value })}
                            placeholder="Alt text (required)"
                            className="w-full px-2 py-1 bg-bg-subtle border border-border rounded text-[11px] text-fg focus:outline-none focus:border-accent"
                          />
                          <input
                            type="text"
                            value={img.caption || ""}
                            onChange={(e) => updateGalleryImage(i, { caption: e.target.value })}
                            placeholder="Caption (optional)"
                            className="w-full px-2 py-1 bg-bg-subtle border border-border rounded text-[11px] text-fg focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div className="flex flex-col items-center justify-between shrink-0">
                          <button
                            type="button"
                            onClick={() => moveGalleryImage(i, -1)}
                            disabled={i === 0}
                            title="Move up"
                            className="text-muted hover:text-fg disabled:opacity-30 text-xs"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            title="Remove"
                            className="text-red-500 hover:text-red-400 text-xs"
                          >
                            ✕
                          </button>
                          <button
                            type="button"
                            onClick={() => moveGalleryImage(i, 1)}
                            disabled={i === formData.gallery.length - 1}
                            title="Move down"
                            className="text-muted hover:text-fg disabled:opacity-30 text-xs"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Extra Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Kind</label>
                  <select
                    value={formData.kind}
                    onChange={(e) => setFormData({ ...formData, kind: e.target.value as "website" | "app" | "pwa" | "tool" | "experiment" })}
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg focus:outline-none focus:border-accent"
                  >
                    <option value="website">Website</option>
                    <option value="app">App</option>
                    <option value="pwa">PWA</option>
                    <option value="tool">Tool</option>
                    <option value="experiment">Experiment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accent}
                      onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                      className="size-9 p-0 bg-transparent border-0 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.accent}
                      onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                      className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="Next.js, TypeScript, Tailwind CSS"
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="web, ai, product"
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">Live URL (optional)</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={formData.repo}
                    onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 sm:p-8 pt-4 border-t border-border shrink-0">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-xs font-semibold text-muted hover:text-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
              >
                {editingSlug ? "Save Changes" : "Approve & Publish to Site →"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: MEDIA LIBRARY PICKER */}
      {libraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <input
            type="file"
            ref={libraryFileInputRef}
            onChange={handleLibraryFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="bg-surface border border-border rounded-3xl w-full max-w-5xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-fg flex items-center gap-2">
                  <span>🖼️</span>
                  <span>Media & Thumbnail Library</span>
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Select any asset to set as thumbnail, or upload new media.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => libraryFileInputRef.current?.click()}
                  disabled={uploadingToLibrary}
                  className="px-3 py-1.5 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                  title="Upload a new image from your device into the library"
                >
                  <span>📷</span>
                  <span>{uploadingToLibrary ? "Uploading..." : "Upload New Image"}</span>
                </button>

                {libraryImages.some((i) => i.isUnused) && (
                  <button
                    type="button"
                    onClick={handleCleanupUnused}
                    disabled={cleaningUpLibrary}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 text-red-500 border border-red-500/20 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    title="Delete all database images not currently used as any project's cover or gallery image"
                  >
                    <span>🧹</span>
                    <span>
                      {cleaningUpLibrary
                        ? "Cleaning up..."
                        : `Clean Up ${libraryImages.filter((i) => i.isUnused).length} Unused`}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setLibraryModalOpen(false)}
                  className="text-muted hover:text-fg font-bold text-xl p-2 rounded-xl hover:bg-bg-subtle transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Filter & Category Bar */}
            <div className="p-4 bg-bg-subtle border-b border-border flex flex-wrap items-center justify-between gap-3">
              {/* Category tabs */}
              <div className="flex items-center bg-surface border border-border rounded-xl p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLibraryFilterTab("all")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    libraryFilterTab === "all"
                      ? "bg-fg text-bg shadow-sm"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  All ({libraryImages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryFilterTab("database")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    libraryFilterTab === "database"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  ☁️ Database ({libraryImages.filter((i) => i.type === "database").length})
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryFilterTab("local")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    libraryFilterTab === "local"
                      ? "bg-fg text-bg shadow-sm"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  📁 Local Files ({libraryImages.filter((i) => i.type !== "database").length})
                </button>
                {libraryImages.some((i) => i.isUnused) && (
                  <button
                    type="button"
                    onClick={() => setLibraryFilterTab("unused")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      libraryFilterTab === "unused"
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-muted hover:text-fg"
                    }`}
                  >
                    🧹 Unused ({libraryImages.filter((i) => i.isUnused).length})
                  </button>
                )}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search library images..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-surface border border-border rounded-xl text-xs text-fg focus:outline-none focus:border-accent"
                />
                <span className="absolute left-3 top-2 text-xs text-muted">🔍</span>
              </div>
            </div>

            {/* Image Grid */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingLibrary ? (
                <div className="py-16 text-center text-sm font-mono text-muted flex flex-col items-center gap-3">
                  <div className="size-6 border-2 border-fg/20 border-t-fg rounded-full animate-spin" />
                  <span>Loading image library...</span>
                </div>
              ) : libraryImages.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted">
                  No images found. Click &quot;Upload New Image&quot; to add one.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryImages
                    .filter((img) => {
                      const isDb = img.type === "database";
                      if (libraryFilterTab === "database" && !isDb) return false;
                      if (libraryFilterTab === "local" && isDb) return false;
                      if (libraryFilterTab === "unused" && !img.isUnused) return false;

                      if (!librarySearch.trim()) return true;
                      const q = librarySearch.toLowerCase();
                      return (
                        img.name.toLowerCase().includes(q) ||
                        img.url.toLowerCase().includes(q) ||
                        (img.sourceProject && img.sourceProject.toLowerCase().includes(q))
                      );
                    })
                    .map((img) => {
                      const isDb = img.type === "database";
                      const isActive =
                        formData.cover === img.url ||
                        (libraryTargetSlug &&
                          projects.find((p) => p.slug === libraryTargetSlug)?.frontmatter.cover === img.url);

                      return (
                        <div
                          key={img.url}
                          className={`group relative rounded-2xl border transition-all flex flex-col justify-between shadow-sm overflow-hidden ${
                            isActive
                              ? "border-accent ring-2 ring-accent/30 bg-accent/5"
                              : "border-border bg-bg-subtle hover:border-accent/50"
                          }`}
                        >
                          {/* Image preview */}
                          <div className="relative aspect-16/10 bg-surface flex items-center justify-center overflow-hidden">
                            <Image
                              src={img.url}
                              alt={img.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Storage badge */}
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border shadow-sm ${
                                  isDb
                                    ? "bg-blue-600 text-white border-blue-400 font-semibold"
                                    : "bg-surface/90 text-fg border-border font-medium"
                                }`}
                              >
                                {isDb ? "☁️ Database" : "📁 Local"}
                              </span>
                            </div>

                            {/* Active badge */}
                            {isActive && (
                              <div className="absolute top-2 left-2">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-live-green text-white shadow-sm flex items-center gap-1">
                                  <span>✓</span>
                                  <span>Active</span>
                                </span>
                              </div>
                            )}

                            {/* Unused badge */}
                            {!isActive && img.isUnused && (
                              <div className="absolute top-2 left-2">
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white shadow-sm flex items-center gap-1"
                                  title="Not used as any project's cover or gallery image"
                                >
                                  <span>🧹</span>
                                  <span>Unused</span>
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Image info & action toolbar */}
                          <div className="p-3 flex flex-col justify-between flex-1 gap-2.5">
                            <div>
                              <p className="text-xs font-bold text-fg truncate" title={img.name}>
                                {img.name}
                              </p>
                              {img.sourceProject && (
                                <p className="text-[10px] text-muted truncate">
                                  Linked to {img.sourceProject}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              {/* Primary Select Button */}
                              <button
                                type="button"
                                onClick={() => handleSelectLibraryImage(img)}
                                className={`w-full py-1.5 px-2 font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1 ${
                                  isActive
                                    ? "bg-live-green text-white"
                                    : "bg-fg text-bg hover:opacity-90"
                                }`}
                              >
                                <span>{isActive ? "✓ Selected" : "✓ Select Image"}</span>
                              </button>

                              {/* Action Row: Copy URL & Delete */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleCopyImageUrl(img.url)}
                                  className="flex-1 py-1 px-2 bg-surface hover:bg-surface-hover border border-border rounded-lg text-[10px] font-mono text-muted hover:text-fg transition-colors flex items-center justify-center gap-1"
                                  title="Copy image URL to clipboard"
                                >
                                  <span>📋</span>
                                  <span>Copy URL</span>
                                </button>

                                {isDb && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLibraryImage(img.url)}
                                    className="py-1 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-[10px] transition-colors"
                                    title="Delete this image from the database"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-bg-subtle border-t border-border flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-muted">
                Tip: Click &quot;Select Image&quot; to assign it to this project immediately, or &quot;Upload New Image&quot; to add any file.
              </span>
              <button
                type="button"
                onClick={() => setLibraryModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-fg bg-surface hover:bg-surface-hover border border-border rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: IMPORT GITHUB REPOSITORY */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-border rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🔗</span>
                <div>
                  <h3 className="text-base font-bold text-fg">Import GitHub Repository</h3>
                  <p className="text-xs text-muted">Paste any public or private GitHub repository URL to import it.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="text-muted hover:text-fg font-bold text-lg p-1.5 rounded-lg hover:bg-bg-subtle transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-fg mb-1.5">
                  GitHub Repository URL or Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/1Zero9/rvr-2014-teamadmin"
                  value={importUrlInput}
                  onChange={(e) => setImportUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleImportByUrl();
                  }}
                  className="w-full px-3.5 py-2.5 bg-bg-subtle border border-border rounded-xl text-xs font-mono text-fg placeholder:text-faint focus:outline-none focus:border-accent"
                  autoFocus
                />
                <p className="text-[11px] text-muted mt-1.5">
                  Supported formats: <code className="text-fg bg-surface px-1 py-0.5 rounded border border-border">https://github.com/owner/repo</code> or <code className="text-fg bg-surface px-1 py-0.5 rounded border border-border">owner/repo</code>
                </p>
              </div>

              {/* Quick chips */}
              <div>
                <span className="text-[11px] font-semibold text-muted block mb-1.5">Quick Examples:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setImportUrlInput("https://github.com/1Zero9/rvr-2014-teamadmin")}
                    className="text-[11px] font-mono px-2 py-1 bg-surface hover:bg-surface-hover border border-border rounded-lg text-fg transition-colors"
                  >
                    1Zero9/rvr-2014-teamadmin
                  </button>
                </div>
              </div>

              {/* Optional PAT */}
              <div className="pt-2 border-t border-border">
                <details className="text-xs group">
                  <summary className="cursor-pointer font-semibold text-muted hover:text-fg select-none flex items-center gap-1">
                    <span>⚙️ Private Repo Access Token (Optional)</span>
                  </summary>
                  <div className="mt-2.5">
                    <input
                      type="password"
                      placeholder="ghp_... or github_pat_..."
                      value={importGithubToken}
                      onChange={(e) => setImportGithubToken(e.target.value)}
                      className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-xs font-mono text-fg placeholder:text-faint focus:outline-none focus:border-accent"
                    />
                    <p className="text-[10px] text-muted mt-1">
                      If the repository is private and GITHUB_TOKEN / GH_TOKEN / GITHUB_CONTENT_TOKEN is not configured in your environment, paste a token with <code className="text-fg">repo</code> scope.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-bg-subtle border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border text-fg font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleImportByUrl()}
                disabled={importingRepo || !importUrlInput.trim()}
                className="px-4 py-2 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 shadow-sm"
              >
                <span>{importingRepo ? "Importing..." : "Import & Open Editor"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
