# Media Guide Changelog

## Release Process
- Increment `package.json`, `package-lock.json`, and `src/app/media-guide/MediaGuide.tsx` for every shipped Media Guide change.
- Update this changelog in the same commit as the version bump.
- Rebuild the external review pack with `npm run media:review-pack` when Media Guide files change.
- Use patch versions for UI polish and small fixes, minor versions for new user-facing features, and major versions only for breaking changes or large data model shifts.

## 0.2.4 - Runway Redirect
- Redirected old `/media-guide` page routes to the standalone Runway app at `https://runway.1zero9.com`.
- Preserved `/media-guide/share/*` paths as `/share/*` on Runway and sent `/media-guide/login` to `/login`.

## 0.2.3 - Watched and Rating Signals
- Added per-title watched tracking in My List so a film can be completed and a show can record each watched episode without leaving the active list.
- Added Steve's own five-star rating control to each My List item so future recommendations can learn from personal taste.
- Extended the Neon watchlist table with `user_rating`, `last_watched_at`, and `watched_count` fields for recommendation logic.

## 0.2.2 - External Review Pack
- Added a generated `review/media-guide` folder that contains only the Media Guide source, API routes, auth/database helpers, middleware scope, PWA assets, and review notes.
- Added `npm run media:review-pack` so the review folder can be regenerated from the live embedded app.
- Documented the review boundary so external tools can inspect Media Guide without scanning the whole 1Zero9 Studio codebase.

## 0.2.1 - UI Simplification
- Simplified Media Guide fonts, spacing, badges, cards, and active states.
- Reduced glow-heavy styling so listings, filters, media cards, and My List rows are easier to scan.
- Fixed Ireland date formatting for date-only values used in My List and calendar surfaces.
- Adjusted stored preference hydration so client-only display preferences are handled more safely.

## 0.2.0 - My List and Filters
- Added item types for tracked media: TV show, Film, Sport, and Other.
- Renamed My Shows to My List.
- Grouped My List entries by watch status.
- Added a Sport filter for Today/Sky listings.
- Added watchlist API support for storing item type.
