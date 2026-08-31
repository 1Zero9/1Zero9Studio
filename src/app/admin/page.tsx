"use client";

import { useEffect, useState, useRef } from "react";
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
    draft?: boolean;
    tags?: string[];
    techStack?: string[];
    highlights?: string[];
    wipProgress?: string;
    url?: string;
    repo?: string;
    cover?: string;
    coverAlt?: string;
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inbox" | "projects" | "thumbnails" | "create">("inbox");
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [discovered, setDiscovered] = useState<DiscoveredProject[]>([]);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState<"all" | "portfolio" | "labs" | "drafts">("all");
  const [githubUser, setGithubUser] = useState("1Zero9");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Vetting / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    summary: "",
    date: new Date().toISOString().slice(0, 10),
    section: "portfolio",
    status: "live",
    kind: "website",
    accent: "#3855d6",
    featured: false,
    draft: false,
    tags: "",
    techStack: "",
    wipProgress: "",
    url: "",
    repo: "",
    cover: "",
    coverAlt: "",
  });

  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedProjectForUpload, setSelectedProjectForUpload] = useState<string | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }

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
  }, [router]);

  async function loadProjects() {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  }

  async function scanProjects(user: string = githubUser) {
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
  }

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

  // Open Vetting Modal for a discovered candidate
  function openVettingModalForDiscovered(item: DiscoveredProject) {
    setEditingSlug(null);
    setFormData({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      date: new Date().toISOString().slice(0, 10),
      section: item.suggestedSection,
      status: item.suggestedStatus,
      kind: item.suggestedKind,
      accent: item.suggestedSection === "labs" ? "#f59e0b" : "#3855d6",
      featured: false,
      draft: false,
      tags: item.topics.join(", "),
      techStack: item.techStack.join(", "),
      wipProgress: item.suggestedStatus === "in-progress" ? "Phase 1 · Active development" : "",
      url: item.liveUrl || "",
      repo: item.repoUrl || "",
      cover: "",
      coverAlt: "",
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
      section: project.frontmatter.section || (project.frontmatter.kind === "website" ? "portfolio" : "labs"),
      status: project.frontmatter.status || "live",
      kind: project.frontmatter.kind || "app",
      accent: project.frontmatter.accent || "#3855d6",
      featured: Boolean(project.frontmatter.featured),
      draft: Boolean(project.frontmatter.draft),
      tags: (project.frontmatter.tags || []).join(", "),
      techStack: (project.frontmatter.techStack || []).join(", "),
      wipProgress: project.frontmatter.wipProgress || "",
      url: project.frontmatter.url || "",
      repo: project.frontmatter.repo || "",
      cover: project.frontmatter.cover || "",
      coverAlt: project.frontmatter.coverAlt || "",
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

      const frontmatterPayload: any = {
        title: formData.title,
        summary: formData.summary,
        date: formData.date,
        section: formData.section,
        status: formData.status,
        kind: formData.kind,
        accent: formData.accent,
        featured: formData.featured,
        draft: formData.draft,
        tags: tagsArray,
        techStack: techStackArray,
        wipProgress: formData.wipProgress || undefined,
        url: formData.url || undefined,
        repo: formData.repo || undefined,
      };

      if (formData.cover) {
        frontmatterPayload.cover = formData.cover;
        frontmatterPayload.coverAlt = formData.coverAlt || `${formData.title} screenshot`;
      }

      if (editingSlug) {
        // Update
        const res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: editingSlug,
            frontmatter: frontmatterPayload,
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
      await scanProjects();
    } catch (err: any) {
      showToast(err.message || "Failed to save project", "error");
    }
  }

  // Thumbnail upload handling
  async function handleFileUpload(file: File, slug: string) {
    setUploadingImage(slug);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("slug", slug);

      const res = await fetch("/api/admin/upload-thumbnail", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      showToast(`Thumbnail uploaded for ${slug}!`);
      await loadProjects();
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploadingImage(null);
    }
  }

  function triggerUploadForProject(slug: string) {
    setSelectedProjectForUpload(slug);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <span className="size-4 rounded-full bg-signal animate-ping" />
        <p className="text-sm font-mono text-muted">Loading Workbench Admin...</p>
      </div>
    );
  }

  const pendingDiscovered = discovered.filter((d) => !d.isAlreadyManaged);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.frontmatter.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.frontmatter.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (sectionFilter === "portfolio") {
      return p.frontmatter.section === "portfolio" || (!p.frontmatter.section && p.frontmatter.kind === "website");
    }
    if (sectionFilter === "labs") {
      return p.frontmatter.section === "labs" || (!p.frontmatter.section && p.frontmatter.status === "in-progress");
    }
    if (sectionFilter === "drafts") {
      return p.frontmatter.draft === true || p.frontmatter.section === "hidden";
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hidden file input for thumbnail uploading */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && selectedProjectForUpload) {
            handleFileUpload(file, selectedProjectForUpload);
          }
        }}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border text-sm font-medium shadow-2xl transition-all duration-300 ${
            notification.type === "error"
              ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
              : "bg-signal/15 border-signal/40 text-fg"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2.5 rounded-full bg-signal animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted">
              1Zero9 Studio Control
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-fg">
            Project Workbench & Admin
          </h1>
          <p className="text-sm text-muted mt-1">
            Vetting pipeline, section routing, visibility controls & thumbnail studio
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="btn-secondary text-xs"
          >
            <span>Live Site</span>
            <span aria-hidden="true">↗</span>
          </Link>

          <button
            onClick={() => scanProjects(githubUser)}
            disabled={scanning}
            className="btn-secondary text-xs"
          >
            <span>{scanning ? "Scanning GitHub..." : "Scan Repos"}</span>
            <span className="font-mono text-xs">⚡</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-medium text-muted hover:text-red-500 rounded-lg border border-border hover:border-red-500/40 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Quick Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-surface border border-border shadow-card">
          <p className="text-xs font-mono text-muted uppercase">Pending Vetting</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-wip-amber">{pendingDiscovered.length}</span>
            <span className="text-xs text-muted">new repos</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border shadow-card">
          <p className="text-xs font-mono text-muted uppercase">Total on Site</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-fg">{projects.length}</span>
            <span className="text-xs text-muted">projects</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border shadow-card">
          <p className="text-xs font-mono text-muted uppercase">Portfolio (/projects)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-accent">
              {projects.filter((p) => p.frontmatter.section === "portfolio" || (!p.frontmatter.section && p.frontmatter.kind === "website")).length}
            </span>
            <span className="text-xs text-muted">live showcase</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border shadow-card">
          <p className="text-xs font-mono text-muted uppercase">Active Labs (/labs)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-signal">
              {projects.filter((p) => p.frontmatter.section === "labs" || (!p.frontmatter.section && p.frontmatter.status === "in-progress")).length}
            </span>
            <span className="text-xs text-muted">workbench</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-bg-subtle border border-border rounded-xl mb-8">
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
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-wip-amber/20 text-wip-amber font-bold border border-wip-amber/30">
              {pendingDiscovered.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "projects"
              ? "bg-surface text-fg font-semibold shadow-sm border border-border"
              : "text-muted hover:text-fg"
          }`}
        >
          <span>🗂️ Managed Projects & Sections</span>
          <span className="text-xs font-mono opacity-60">({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("thumbnails")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "thumbnails"
              ? "bg-surface text-fg font-semibold shadow-sm border border-border"
              : "text-muted hover:text-fg"
          }`}
        >
          <span>🖼️ Thumbnail Studio</span>
        </button>

        <button
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
              featured: false,
              draft: false,
              tags: "web, design",
              techStack: "Next.js, TypeScript, Tailwind CSS",
              wipProgress: "",
              url: "",
              repo: "",
              cover: "",
              coverAlt: "",
            });
            setModalOpen(true);
          }}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-fg text-bg font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity"
        >
          <span>+ Add Custom Project</span>
        </button>
      </div>

      {/* TAB 1: DISCOVERED WORKBENCH INBOX */}
      {activeTab === "inbox" && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-fg">Automatic Inclusion & Vetting Inbox</h2>
              <p className="text-sm text-muted">
                Repositories found on GitHub ({githubUser}). Review and approve which ones to feature on the site and choose their section.
              </p>
            </div>

            <div className="flex items-center gap-2">
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

      {/* TAB 2: MANAGED PROJECTS & SECTIONS */}
      {activeTab === "projects" && (
        <div>
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSectionFilter("all")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "all"
                    ? "bg-fg text-bg border-fg"
                    : "bg-surface text-muted border-border hover:border-border-hover"
                }`}
              >
                All ({projects.length})
              </button>
              <button
                onClick={() => setSectionFilter("portfolio")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "portfolio"
                    ? "bg-fg text-bg border-fg"
                    : "bg-surface text-muted border-border hover:border-border-hover"
                }`}
              >
                Portfolio Only
              </button>
              <button
                onClick={() => setSectionFilter("labs")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "labs"
                    ? "bg-fg text-bg border-fg"
                    : "bg-surface text-muted border-border hover:border-border-hover"
                }`}
              >
                Labs Only
              </button>
              <button
                onClick={() => setSectionFilter("drafts")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  sectionFilter === "drafts"
                    ? "bg-fg text-bg border-fg"
                    : "bg-surface text-muted border-border hover:border-border-hover"
                }`}
              >
                Drafts / Hidden
              </button>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-fg placeholder:text-faint focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-4">
            {filteredProjects.map((project) => {
              const isLive = !project.frontmatter.draft;
              const currentSection =
                project.frontmatter.section ||
                (project.frontmatter.kind === "website" ? "portfolio" : "labs");

              return (
                <div
                  key={project.slug}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-5 bg-surface border border-border rounded-2xl shadow-card hover:border-border-hover transition-all"
                >
                  {/* Left: Thumbnail & Project Meta */}
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    {/* Thumbnail preview / quick upload */}
                    <div
                      onClick={() => triggerUploadForProject(project.slug)}
                      className="relative group size-20 sm:size-24 rounded-xl overflow-hidden bg-bg-subtle border border-border shrink-0 cursor-pointer"
                      title="Click to replace thumbnail"
                    >
                      {project.frontmatter.cover ? (
                        <Image
                          src={project.frontmatter.cover}
                          alt={project.frontmatter.coverAlt || project.frontmatter.title}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-xl font-bold text-muted">
                          {project.frontmatter.title.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-mono transition-opacity">
                        {uploadingImage === project.slug ? "Uploading..." : "Replace"}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className="size-2.5 rounded-full shrink-0"
                          style={{ background: project.frontmatter.accent || "#3855d6" }}
                        />
                        <h3 className="text-base font-bold text-fg truncate">
                          {project.frontmatter.title}
                        </h3>
                        <span className="text-xs font-mono text-muted">
                          /projects/{project.slug}
                        </span>
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

                  {/* Right: Controls (Visibility Toggle, Section Selector, Status, Edit) */}
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
                      className="p-2 bg-surface hover:bg-surface-hover border border-border rounded-xl text-xs text-muted hover:text-fg transition-colors"
                      title="Update Thumbnail"
                    >
                      📷
                    </button>

                    {/* Edit Full Details */}
                    <button
                      onClick={() => openEditModal(project)}
                      className="px-3 py-1.5 bg-surface hover:bg-surface-hover border border-border rounded-xl text-xs font-semibold text-fg transition-colors"
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: THUMBNAIL STUDIO */}
      {activeTab === "thumbnails" && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-fg">Project Thumbnail Studio</h2>
            <p className="text-sm text-muted">
              Easily update cover screenshots and images for all projects. Images are saved to{" "}
              <code className="text-accent">public/images/projects/</code> and linked directly in MDX.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-card hover:border-border-hover transition-all flex flex-col"
              >
                {/* 16:10 Aspect Ratio Card Cover */}
                <div className="relative w-full aspect-[16/10] bg-bg-subtle border-b border-border overflow-hidden group">
                  {project.frontmatter.cover ? (
                    <Image
                      src={project.frontmatter.cover}
                      alt={project.frontmatter.coverAlt || project.frontmatter.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="size-full flex flex-col items-center justify-center text-muted p-4 text-center">
                      <span className="text-3xl font-bold mb-1 opacity-40">
                        {project.frontmatter.title.charAt(0)}
                      </span>
                      <span className="text-xs font-mono">No thumbnail set</span>
                    </div>
                  )}

                  {/* Upload overlay */}
                  <div
                    onClick={() => triggerUploadForProject(project.slug)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 text-white transition-opacity cursor-pointer p-4"
                  >
                    <span className="text-2xl">📸</span>
                    <span className="text-xs font-semibold">Click to upload new image</span>
                    <span className="text-[10px] text-white/70 font-mono">PNG, JPG, WebP, SVG</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-fg truncate">
                        {project.frontmatter.title}
                      </h3>
                      <span className="badge-kind">{project.frontmatter.section || "portfolio"}</span>
                    </div>
                    <p className="text-xs font-mono text-muted mb-3">
                      {project.frontmatter.cover || "Uses initial placeholder"}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border">
                    <button
                      onClick={() => triggerUploadForProject(project.slug)}
                      disabled={uploadingImage === project.slug}
                      className="w-full py-2 px-3 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                    >
                      <span>{uploadingImage === project.slug ? "Uploading..." : "Upload New File"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VETTING & EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-fg">
                  {editingSlug ? `Edit Project: ${formData.title}` : "Vet & Add New Project"}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Configure section placement, visibility, metadata, and thumbnail.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-lg border border-border flex items-center justify-center text-muted hover:text-fg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
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

              {/* Section & Status Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-bg-subtle border border-border rounded-xl">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1 font-bold">
                    Section Placement *
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-fg focus:outline-none focus:border-accent"
                  >
                    <option value="live">Live</option>
                    <option value="in-progress">Building Now</option>
                    <option value="featured">Featured</option>
                    <option value="archived">Archived</option>
                  </select>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Kind
                  </label>
                  <select
                    value={formData.kind}
                    onChange={(e) => setFormData({ ...formData, kind: e.target.value })}
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
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Accent Color
                  </label>
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
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Date (YYYY-MM-DD)
                  </label>
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
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                    placeholder="Next.js, TypeScript, Tailwind CSS"
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Tags (comma separated)
                  </label>
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
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Live URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    GitHub Repo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.repo}
                    onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono"
                  />
                </div>
              </div>

              {formData.status === "in-progress" && (
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Building Now / Progress Note
                  </label>
                  <input
                    type="text"
                    value={formData.wipProgress}
                    onChange={(e) => setFormData({ ...formData, wipProgress: e.target.value })}
                    placeholder="Phase 1 · Core API integration & UI prototype"
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg"
                  />
                </div>
              )}

              {/* Cover thumbnail path */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Cover Image Path (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.cover}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    placeholder="/images/projects/example.png"
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Cover Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.coverAlt}
                    onChange={(e) => setFormData({ ...formData, coverAlt: e.target.value })}
                    placeholder="Screenshot of interface"
                    className="w-full px-3 py-2 bg-bg-subtle border border-border rounded-xl text-sm text-fg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
        </div>
      )}
    </div>
  );
}
