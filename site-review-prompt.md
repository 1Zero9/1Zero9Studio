# SITE REVIEW BRIEF — Critical Multi-Persona Audit

**Usage:** Paste this into Claude Code at the root of the project repo (or point it at a live URL). Replace the `[PLACEHOLDERS]` before running. Designed to be blunt, not polite — I want problems surfaced, not softened.

---

## 0. Setup

- **Project name:** [SITE/APP NAME]
- **Live URL(s):** [URL]
- **Repo path:** [PATH, if local]
- **Stack (if known):** [e.g. Next.js 15, Neon Postgres, Vercel]
- **Primary purpose of the site:** [1–2 sentences — who is this for, what job does it do]
- **3–5 comparable/competitor sites to benchmark against:** [URLs — real competitors or best-in-class examples in the same category]

If any of the above is missing, don't guess silently — flag it and make a reasonable assumption explicitly before proceeding.

---

## 1. Discovery Pass (do this first, unaided by opinion)

Crawl/read the codebase and live site and produce a factual inventory before any critique:

- Site map / route structure
- Tech stack, key dependencies, versions (flag anything outdated or deprecated)
- Content types and how many of each (pages, posts, products, listings, etc.)
- Last-modified dates on content where available (git blame, CMS timestamps, file mtimes)
- Current SEO setup: meta tags, sitemap.xml, robots.txt, structured data, canonical tags
- Current security posture: auth method, exposed env vars, dependency vulnerabilities (`npm audit` or equivalent), HTTPS/headers, input validation on forms
- Performance baseline: bundle size, Lighthouse/PageSpeed scores if reachable, image optimization status
- Accessibility baseline: semantic HTML use, alt text coverage, contrast, keyboard nav

Output this as a factual table. No opinions yet.

---

## 2. Benchmark Pass

For each comparable site listed in section 0:
- What do they do better than us in: content freshness, navigation/IA, SEO signals, visual design, perceived trust/credibility, page speed
- What do they do worse or not at all
- One specific, concrete thing worth stealing/adapting (not vague "improve design")

Be honest even if the comparison is unflattering.

---

## 3. Five-Persona Independent Review

Run five separate, independent critiques. Each persona reviews the *whole site* through their own lens, doesn't see the others' scores in advance, and must give a **rating out of 10** with justification tied to specific evidence (page, file, or feature) — no generic scoring. Disagreement between personas is expected and should not be smoothed over.

### Persona 1 — The Security Auditor
Paranoid, assumes breach is inevitable. Reviews: auth flows, secrets management, dependency CVEs, input sanitization, API exposure, rate limiting, data handling/PII, HTTPS/header config. Rates 1–10 on risk exposure (10 = very low risk). Lists exploitable issues in priority order.

### Persona 2 — The SEO/Growth Consultant
Commercially minded, judges the site purely on "will this rank and convert." Reviews: technical SEO, content depth/keyword coverage vs benchmarks, metadata, internal linking, Core Web Vitals, mobile experience, crawlability. Rates 1–10 on organic growth potential.

### Persona 3 — The Staff Software Engineer (Code Quality & Architecture)
Skeptical of shortcuts, cares about maintainability over cleverness. Reviews: code structure, naming, duplication, test coverage (or absence of it), error handling, type safety, build/deploy setup, tech debt. Rates 1–10 on codebase health/maintainability.

### Persona 4 — The Product/UX Critic
Impatient user simulator, no sentimentality about features the team is proud of. Reviews: navigation clarity, information hierarchy, load-bearing UX flows, mobile usability, friction points, accessibility. Rates 1–10 on user experience.

### Persona 5 — The Content Strategist
Focused on whether the content is alive or dead. Reviews: freshness (dates, stale claims/prices/screenshots), tone/consistency, gaps vs what users would search for, duplication, thinness. Rates 1–10 on content health.

**Output format per persona:**
```
### [Persona name] — Score: X/10
Top 3 strengths (with evidence)
Top 5 problems (with evidence, ranked by severity)
The one thing that would move the score most
```

### Consolidated Scorecard
A single table: persona | score | one-line verdict. Then a synthesized overall verdict — where the personas agree (real signal) vs disagree (worth a second look), and an overall composite score with reasoning, not just an average.

---

## 4. Goal Path — Update, Correct, Enhance, De-stale

Turn the findings into a phased, actionable roadmap. No vague items — every item should be something Claude Code could actually execute.

### Phase 0 — Stop the Bleeding (this week)
Security or breaking issues only. List each with the specific fix.

### Phase 1 — Quick Wins (this month)
Low-effort, high-impact items: metadata fixes, broken links, stale copy, obvious a11y fixes, dependency bumps.

### Phase 2 — Structural Fixes (this quarter)
Architecture, content model, IA, SEO structure, test coverage — things that need real work but aren't urgent.

### Phase 3 — Enhancement (ongoing)
New content, features, or differentiation moves inspired by the benchmark pass.

### Staleness Prevention System
Propose a concrete, low-effort mechanism to stop this audit being needed again in 6 months, e.g.:
- A `CONTENT-AUDIT.md` file listing every page with a "last verified" date and an owner
- A quarterly recurring check (calendar reminder or scheduled Claude Code task) that re-runs sections 1–3 above and diffs against this report
- Automated checks (CI step) for broken links, outdated dependency majors, and Lighthouse score regressions

End with: **"Re-run this audit on [date + 3 months] and diff against today's scorecard."**
