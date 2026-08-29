# 1Zero9 Studio — Adding & Managing Projects

This guide explains how to quickly add and manage projects on **1Zero9 Studio**. There is no database or admin login required—everything is powered by clean, typed Markdown/MDX files in `content/projects/`.

---

## 🚀 Quick Start: How to Add a New Project

1. **Create a new folder** under `content/projects/` named after your project's slug (e.g. `content/projects/my-new-app/`).
2. **Create an `index.mdx`** file inside that folder (or copy `content/projects/_template/index.mdx`).
3. Fill in the frontmatter metadata:

```mdx
---
title: My New App
summary: A brief description of what this project does and the problem it solves.
date: 2026-08-30
status: live                # "live" | "in-progress" | "featured" | "concept"
kind: app                   # "website" | "app" | "pwa" | "tool" | "experiment"
accent: "#10b981"           # Six-digit hex accent colour (e.g. emerald, purple, cyan)
featured: true              # Set to true to highlight on the homepage
url: https://mynewapp.com   # (Optional) Live link
repo: https://github.com/.. # (Optional) GitHub repo
cover: /images/projects/my-new-app.png # (Optional) Image placed in /public/images/projects/
coverAlt: Screenshot showing the main dashboard of My New App
tags:
  - ai
  - productivity
  - nextjs
techStack:
  - Next.js
  - TypeScript
  - Tailwind CSS
highlights:
  - Real-time conversational interface with sub-100ms response time
  - Offline-first storage with automatic synchronization
draft: false
---

## What it is
Write your case study here using standard Markdown and MDX.
```

---

## 🛠️ Adding "In-Progress / Working-On" Projects

If you are actively building a project and want to showcase it in the **"Building Now / Labs"** section:

1. Set `status: in-progress`
2. Add `wipProgress` with a short milestone update:

```mdx
---
title: Territory War
summary: A tactical multiplayer strategy game running on the modern web.
date: 2026-08-30
status: in-progress
wipProgress: "Phase 2 · Real-time WebSocket matchmaking & sound design"
kind: app
accent: "#f59e0b"
tags:
  - gamedev
  - websockets
  - typescript
---
```

---

## 🖼️ Adding Screenshots & Images

1. Place your screenshots in `/public/images/projects/your-image.png`.
2. Reference them in your frontmatter (`cover: /images/projects/your-image.png`) or directly inside the MDX body:

```mdx
![Dashboard Preview](/images/projects/your-image.png)
```

---

## 🏷️ Project Kinds & Statuses

- **`status`**:
  - `live`: Active, released product with a live link or finished status.
  - `in-progress`: Actively being built. Displayed in the "Building Now / Labs" section with live pulse indicator.
  - `featured`: Pinned to the top of project showcases and homepage.
  - `concept`: Exploratory prototype or design case study.
- **`kind`**:
  - `website`: Client or community website.
  - `app`: Full-stack web application or software.
  - `pwa`: Progressive Web App (mobile/desktop installable).
  - `tool`: Developer tool, workflow utility, or CLI.
  - `experiment`: Creative coding, AI sandbox, or mini-game.
