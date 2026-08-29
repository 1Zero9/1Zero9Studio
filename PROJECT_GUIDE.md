# 1Zero9 Studio — Adding & Managing Projects

This guide explains how to add and manage projects on **1Zero9 Studio**. There is no database or admin login required—everything is powered by clean, typed Markdown/MDX files in `content/projects/`.

---

## 🏛️ Portfolio vs. Labs: How Projects Are Organized

1Zero9 Studio automatically separates your work into two distinct areas:

1. **Portfolio (`/projects`)** — Production-grade client platforms, released products, and live websites (e.g. River Valley Rangers, Astra, Runway, Clenica Care). Perfect for CV review and prospective client evaluation.
2. **Labs (`/labs`)** — Active workbench items, work-in-progress products, AI workflow tools, game engines, and experimental prototypes (e.g. Territory War, Prompt Builder, JobJar).

---

## 🚀 How to Add a Production Portfolio Project

1. Create a folder in `content/projects/<slug>/`
2. Create `index.mdx` with:

```mdx
---
title: My Live Platform
summary: Production platform delivering measurable business and user outcomes.
date: 2026-08-30
status: live                # "live" | "featured"
kind: website               # "website" | "app" | "pwa"
accent: "#3855d6"           # Hex brand accent colour
url: https://myliveplatform.com
cover: /images/projects/my-live-platform.png
coverAlt: Screenshot of the live platform interface
techStack:
  - Next.js
  - TypeScript
  - Tailwind CSS
highlights:
  - 99+ Lighthouse performance & accessibility scores
  - Custom onboarding flow with real-time conversion
draft: false
---

## The Brief
Describe the project brief and problem solved.

## The Architecture
Detail key technical and UX decisions.
```

---

## 🧪 How to Add an Active Lab / In-Progress Project

For projects you are actively building or experimental prototypes:

1. Set `status: in-progress` (or `kind: experiment` / `kind: tool`)
2. Include `wipProgress` with a short milestone update:

```mdx
---
title: Territory War
summary: A tactical multiplayer web strategy game with real-time state.
date: 2026-08-30
status: in-progress
wipProgress: "Phase 2 · Real-time matchmaking & canvas renderer"
kind: app
accent: "#f59e0b"
tags:
  - gamedev
  - websockets
  - typescript
---
```

This will automatically feature the project in the **"Building Now / Labs"** spotlight on the homepage and in the dedicated **`/labs`** index.
