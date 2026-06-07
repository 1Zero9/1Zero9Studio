# Media Guide Review Pack

This folder is generated from the embedded Media Guide code in the 1Zero9 Studio app.

Point external review tools at this folder instead of the repository root when you only want feedback on Media Guide.

## Scope
- Included: Media Guide pages, login, share page, API routes, Media Guide auth/database helpers, route middleware, PWA manifest/service worker/icons, package metadata, and this changelog.
- Excluded: 1Zero9 landing pages, builder, holiday agent, parkrun, Supabase helpers outside Media Guide, brand assets unrelated to Media Guide, and deployment history.

## Live Paths
- App: `/media-guide`
- Login: `/media-guide/login`
- Shared recommendations: `/media-guide/share/[slug]`
- API: `/api/media-guide/*`

## Environment Variables
- `MEDIA_GUIDE_PASSWORD`
- `MEDIA_GUIDE_SESSION_SECRET`
- `DATABASE_URL`
- `TMDB_API_KEY`

## Data Sources
- Ireland EPG XMLTV feed: `https://epgshare01.online/epgshare01/epg_ripper_IE1.xml.gz`
- TMDb API with watch region `IE`
- Neon/Postgres tables for watchlist and recommendation lists

## Regenerate
Run from the repository root:

```bash
npm run media:review-pack
```

Do not edit files under `source/` directly. Change the live app files, then regenerate this pack.
