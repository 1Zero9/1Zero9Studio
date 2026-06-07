import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const outDir = 'review/media-guide'
const sourceRoot = join(outDir, 'source')

const files = [
  'package.json',
  'next.config.ts',
  'middleware.ts',
  'docs/MEDIA_GUIDE_CHANGELOG.md',
  'src/app/media-guide/MediaGuide.tsx',
  'src/app/media-guide/media-guide.css',
  'src/app/media-guide/page.tsx',
  'src/app/media-guide/login/page.tsx',
  'src/app/media-guide/login/LoginForm.tsx',
  'src/app/media-guide/share/[slug]/page.tsx',
  'src/app/api/media-guide/epg/route.ts',
  'src/app/api/media-guide/login/route.ts',
  'src/app/api/media-guide/logout/route.ts',
  'src/app/api/media-guide/recommendations/route.ts',
  'src/app/api/media-guide/tmdb/route.ts',
  'src/app/api/media-guide/watchlist/route.ts',
  'src/lib/media-guide-auth.ts',
  'src/lib/media-guide-db.ts',
  'src/components/ConditionalNavigation.tsx',
  'tsconfig.json',
  'public/media-guide.webmanifest',
  'public/media-guide-sw.js',
  'public/media-guide-icon.svg',
  'public/media-guide-icon-180.png',
  'public/media-guide-icon-192.png',
  'public/media-guide-icon-512.png',
]

await rm(outDir, { force: true, recursive: true })
await mkdir(sourceRoot, { recursive: true })

for (const file of files) {
  const target = join(sourceRoot, file)
  await mkdir(dirname(target), { recursive: true })
  await copyFile(file, target)
}

await writeFile(
  join(outDir, 'README.md'),
  `# Media Guide Review Pack

This folder is generated from the embedded Media Guide code in the 1Zero9 Studio app.

Point external review tools at this folder instead of the repository root when you only want feedback on Media Guide.

## Scope
- Included: Media Guide pages, login, share page, API routes, Media Guide auth/database helpers, route middleware, PWA manifest/service worker/icons, package metadata, and this changelog.
- Excluded: 1Zero9 landing pages, builder, holiday agent, parkrun, Supabase helpers outside Media Guide, brand assets unrelated to Media Guide, and deployment history.

## Live Paths
- App: \`/media-guide\`
- Login: \`/media-guide/login\`
- Shared recommendations: \`/media-guide/share/[slug]\`
- API: \`/api/media-guide/*\`

## Environment Variables
- \`MEDIA_GUIDE_PASSWORD\`
- \`MEDIA_GUIDE_SESSION_SECRET\`
- \`DATABASE_URL\`
- \`TMDB_API_KEY\`

## Data Sources
- Ireland EPG XMLTV feed: \`https://epgshare01.online/epgshare01/epg_ripper_IE1.xml.gz\`
- TMDb API with watch region \`IE\`
- Neon/Postgres tables for watchlist and recommendation lists

## Regenerate
Run from the repository root:

\`\`\`bash
npm run media:review-pack
\`\`\`

Do not edit files under \`source/\` directly. Change the live app files, then regenerate this pack.
`,
)

await writeFile(
  join(outDir, 'FILE_MANIFEST.md'),
  `# File Manifest

${files.map((file) => `- \`source/${file}\``).join('\n')}
`,
)

console.log(`Generated ${outDir} with ${files.length} files.`)
