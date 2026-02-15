# Jay — Last Man Standing (LMS) Game

> Complete implementation handoff for migrating to a new repository.

## Overview

Jay is a **Premier League Last Man Standing** prediction game. Players pick one team per gameweek to win. If their team wins, they survive. Draw or loss = eliminated. Each team can only be picked **once** across the entire competition, and only **one Top 6 team** is allowed total.

Built for: **Rivervalley Rangers · 2014 Boys Trip** (€10 entry via Revolut).

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth (Google/GitHub OAuth, optional — works anonymously via sessionId)
- **Data Source:** Fantasy Premier League API (daily cron import)
- **Deployment:** Vercel (with Vercel Cron)

---

## Game Rules

1. Pick **1 team per gameweek** to win their match
2. **Win** = you survive to the next week
3. **Draw or Loss** = you're eliminated
4. Each team can only be picked **once** in the entire competition
5. You can only pick **one Top 6 team** total (Arsenal, Aston Villa, Chelsea, Liverpool, Manchester City, Manchester United)
6. Predictions (selecting match winners) also enforce: max **one Top 6 team per gameweek** in selections
7. Picks can be **undone** while the gameweek is still open (before cutoff)

---

## File Structure

```
src/
  app/
    jay/page.tsx                         # Main game UI (993 lines)
    admin/jay/page.tsx                   # Admin dashboard for FPL imports
    api/jay/
      planner/route.ts                   # GET - Fetch teams, gameweeks, fixtures, picks
      pick/route.ts                      # POST - Submit pick, DELETE - Undo pick
      state/route.ts                     # GET - Current gameweek state + availability
      import/route.ts                    # GET - Vercel cron import (auth via CRON_SECRET)
      admin-import/route.ts              # POST - Manual import trigger
  lib/
    jay/
      import.ts                          # FPL API import pipeline (230 lines)
      entry.ts                           # Session/user entry management
    prisma.ts                            # Prisma singleton
    auth.ts                              # NextAuth config (external dependency)
    admin.ts                             # Admin email check

prisma/
  schema.prisma                          # Jay models at lines 1041-1145

vercel.json                              # Cron schedule
```

---

## Database Schema (Prisma)

```prisma
enum JayFixtureStatus {
  SCHEDULED
  LIVE
  FINISHED
}

enum JayPickStatus {
  PENDING
  LOCKED
  COMPLETE
  ELIMINATED
}

enum JayPickResult {
  WIN
  DRAW
  LOSS
}

model JaySeason {
  id        String       @id @default(cuid())
  name      String       @unique
  startsAt  DateTime
  endsAt    DateTime
  createdAt DateTime     @default(now())
  gameweeks JayGameweek[]
}

model JayTeam {
  id         String        @id @default(cuid())
  fplId      Int           @unique
  name       String        @unique
  shortName  String?
  isTop6     Boolean       @default(false)
  crestUrl   String?
  homeGames  JayFixture[]  @relation("JayHomeTeam")
  awayGames  JayFixture[]  @relation("JayAwayTeam")
  picks      JayPick[]
}

model JayGameweek {
  id         String       @id @default(cuid())
  seasonId   String
  fplEventId Int          @unique
  number     Int
  startAt    DateTime
  endAt      DateTime
  cutoffAt   DateTime
  isCurrent  Boolean      @default(false)
  season     JaySeason    @relation(fields: [seasonId], references: [id], onDelete: Cascade)
  fixtures   JayFixture[]
  picks      JayPick[]

  @@unique([seasonId, number])
  @@index([isCurrent])
}

model JayFixture {
  id           String            @id @default(cuid())
  fplFixtureId Int               @unique
  gameweekId   String
  homeTeamId   String
  awayTeamId   String
  kickoffAt    DateTime
  status       JayFixtureStatus  @default(SCHEDULED)
  homeScore    Int?
  awayScore    Int?
  gameweek     JayGameweek       @relation(fields: [gameweekId], references: [id], onDelete: Cascade)
  homeTeam     JayTeam           @relation("JayHomeTeam", fields: [homeTeamId], references: [id])
  awayTeam     JayTeam           @relation("JayAwayTeam", fields: [awayTeamId], references: [id])

  @@index([gameweekId])
}

model JayEntry {
  id        String    @id @default(cuid())
  userId    String?
  sessionId String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  picks     JayPick[]
  User      User?     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([sessionId])
}

model JayPick {
  id          String        @id @default(cuid())
  entryId     String
  gameweekId  String
  teamId      String
  status      JayPickStatus @default(PENDING)
  result      JayPickResult?
  autoAssigned Boolean      @default(false)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  entry       JayEntry      @relation(fields: [entryId], references: [id], onDelete: Cascade)
  gameweek    JayGameweek   @relation(fields: [gameweekId], references: [id], onDelete: Cascade)
  team        JayTeam       @relation(fields: [teamId], references: [id])

  @@unique([entryId, gameweekId])
  @@index([gameweekId])
  @@index([teamId])
}
```

**Note:** `JayEntry` references a `User` model — in the new repo you'll need a User model or remove that relation and rely solely on `sessionId`.

---

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
CRON_SECRET="your-secret-for-vercel-cron"
# NextAuth (optional — game works anonymously without it)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
```

---

## Vercel Cron Config

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/jay/import",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Runs daily at 03:00 UTC to sync FPL data (teams, gameweeks, fixtures, scores).

---

## Shared Dependencies

### Prisma Singleton (`src/lib/prisma.ts`)

```typescript
import { PrismaClient } from '@/generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Admin Check (`src/lib/admin.ts`)

```typescript
const ADMIN_EMAILS = ['scranfield@gmail.com'];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS];
}
```

---

## Complete Source Code

### `src/lib/jay/entry.ts` — Entry Management

```typescript
import { prisma } from "@/lib/prisma";

export const ensureEntry = async (userId: string | null, sessionId: string | null) => {
  if (userId) {
    const existing = await prisma.jayEntry.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;
    return prisma.jayEntry.create({ data: { userId } });
  }

  if (sessionId) {
    const existing = await prisma.jayEntry.findFirst({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing;
    return prisma.jayEntry.create({ data: { sessionId } });
  }

  return null;
};
```

### `src/lib/jay/import.ts` — FPL Data Import

```typescript
import { prisma } from "@/lib/prisma";

const FPL_BOOTSTRAP = "https://fantasy.premierleague.com/api/bootstrap-static/";
const FPL_FIXTURES = "https://fantasy.premierleague.com/api/fixtures/";

const TOP_6 = new Set([
  "Arsenal",
  "Aston Villa",
  "Chelsea",
  "Liverpool",
  "Manchester City",
  "Manchester United",
]);

/* FPL API uses abbreviated names — expand to full proper names */
const FULL_NAMES: Record<string, string> = {
  "Man City": "Manchester City",
  "Man Utd": "Manchester United",
  "Spurs": "Tottenham Hotspur",
  "Nott'm Forest": "Nottingham Forest",
  "Wolves": "Wolverhampton Wanderers",
  "Newcastle": "Newcastle United",
  "Brighton": "Brighton & Hove Albion",
  "West Ham": "West Ham United",
  "Leeds": "Leeds United",
  "Leicester": "Leicester City",
  "Burnley": "Burnley FC",
  "Sunderland": "Sunderland AFC",
  "Ipswich": "Ipswich Town",
  "Southampton": "Southampton FC",
  "Luton": "Luton Town",
  "Sheffield Utd": "Sheffield United",
};

const fullName = (fplName: string) => FULL_NAMES[fplName] ?? fplName;

const fetchJson = async (url: string) => {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`);
  }
  return res.json();
};

const parseDate = (value?: string | null) => (value ? new Date(value) : null);

const subDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() - days);
  return copy;
};

const deriveSeasonName = (firstDeadline: Date | null) => {
  if (!firstDeadline) return "FPL Unknown";
  const month = firstDeadline.getUTCMonth();
  let startYear = firstDeadline.getUTCFullYear();
  if (month < 6) startYear -= 1;
  const endYear = startYear + 1;
  return `FPL ${startYear}/${String(endYear).slice(-2)}`;
};

const computeCutoffAt = (firstKickoff: Date | null, seasonStart: Date) => {
  if (!firstKickoff) return seasonStart;
  const weekBefore = subDays(firstKickoff, 7);
  const twoDaysBefore = subDays(firstKickoff, 2);
  let cutoff = weekBefore;
  if (weekBefore < seasonStart) cutoff = twoDaysBefore;
  if (cutoff < seasonStart) cutoff = seasonStart;
  return cutoff;
};

type ImportSummary = {
  season: string;
  events: number;
  fixtures: number;
};

export async function importJayFromFpl(): Promise<ImportSummary> {
  const [bootstrap, fixtures] = await Promise.all([
    fetchJson(FPL_BOOTSTRAP),
    fetchJson(FPL_FIXTURES),
  ]);

  const events = bootstrap.events || [];
  const teams = bootstrap.teams || [];

  const fixtureKickoffs = fixtures
    .map((fixture: any) => parseDate(fixture.kickoff_time))
    .filter(Boolean) as Date[];

  const seasonStart = fixtureKickoffs.length
    ? new Date(Math.min(...fixtureKickoffs.map((d) => d.getTime())))
    : parseDate(events[0]?.deadline_time) || new Date();

  const seasonEnd = fixtureKickoffs.length
    ? new Date(Math.max(...fixtureKickoffs.map((d) => d.getTime())))
    : parseDate(events[events.length - 1]?.deadline_time) || new Date();

  const seasonName = deriveSeasonName(parseDate(events[0]?.deadline_time));

  const season = await prisma.jaySeason.upsert({
    where: { name: seasonName },
    update: { startsAt: seasonStart, endsAt: seasonEnd },
    create: { name: seasonName, startsAt: seasonStart, endsAt: seasonEnd },
  });

  for (const team of teams) {
    const crestUrl = team.code
      ? `https://resources.premierleague.com/premierleague/badges/70/t${team.code}.png`
      : null;

    const name = fullName(team.name);

    await prisma.jayTeam.upsert({
      where: { fplId: team.id },
      update: {
        name,
        shortName: team.short_name,
        isTop6: TOP_6.has(name),
        crestUrl,
      },
      create: {
        fplId: team.id,
        name,
        shortName: team.short_name,
        isTop6: TOP_6.has(name),
        crestUrl,
      },
    });
  }

  const teamLookup = await prisma.jayTeam.findMany();
  const teamByFplId = new Map(teamLookup.map((team) => [team.fplId, team]));

  const fixturesByEvent = new Map<number, any[]>();
  for (const fixture of fixtures) {
    if (!fixture.event) continue;
    if (!fixturesByEvent.has(fixture.event)) fixturesByEvent.set(fixture.event, []);
    fixturesByEvent.get(fixture.event)?.push(fixture);
  }

  await prisma.jayGameweek.updateMany({ data: { isCurrent: false } });

  let previousCutoff = seasonStart;

  for (const event of events) {
    const eventFixtures = fixturesByEvent.get(event.id) || [];
    const kickoffTimes = eventFixtures
      .map((fixture: any) => parseDate(fixture.kickoff_time))
      .filter(Boolean) as Date[];

    const firstKickoff = kickoffTimes.length
      ? new Date(Math.min(...kickoffTimes.map((d) => d.getTime())))
      : parseDate(event.deadline_time) || seasonStart;
    const lastKickoff = kickoffTimes.length
      ? new Date(Math.max(...kickoffTimes.map((d) => d.getTime())))
      : parseDate(event.deadline_time) || firstKickoff;

    const cutoffAt = computeCutoffAt(firstKickoff, previousCutoff);
    const startAt = previousCutoff;
    const endAt = lastKickoff;

    const gameweek = await prisma.jayGameweek.upsert({
      where: { fplEventId: event.id },
      update: {
        seasonId: season.id,
        number: event.id,
        startAt,
        endAt,
        cutoffAt,
        isCurrent: !!event.is_current,
      },
      create: {
        seasonId: season.id,
        fplEventId: event.id,
        number: event.id,
        startAt,
        endAt,
        cutoffAt,
        isCurrent: !!event.is_current,
      },
    });

    for (const fixture of eventFixtures) {
      const homeTeam = teamByFplId.get(fixture.team_h);
      const awayTeam = teamByFplId.get(fixture.team_a);
      if (!homeTeam || !awayTeam) continue;

      const status = fixture.finished
        ? "FINISHED"
        : fixture.started
        ? "LIVE"
        : "SCHEDULED";

      await prisma.jayFixture.upsert({
        where: { fplFixtureId: fixture.id },
        update: {
          gameweekId: gameweek.id,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          kickoffAt: parseDate(fixture.kickoff_time) || firstKickoff,
          status,
          homeScore: fixture.team_h_score ?? null,
          awayScore: fixture.team_a_score ?? null,
        },
        create: {
          fplFixtureId: fixture.id,
          gameweekId: gameweek.id,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          kickoffAt: parseDate(fixture.kickoff_time) || firstKickoff,
          status,
          homeScore: fixture.team_h_score ?? null,
          awayScore: fixture.team_a_score ?? null,
        },
      });
    }

    previousCutoff = cutoffAt;
  }

  return { season: season.name, events: events.length, fixtures: fixtures.length };
}
```

### `src/app/api/jay/planner/route.ts` — Planner API

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureEntry } from "@/lib/jay/entry";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const entry = await ensureEntry(userId, sessionId);
    if (!entry) {
      return NextResponse.json(
        { success: false, error: "Missing session identifier" },
        { status: 400 }
      );
    }

    const teams = await prisma.jayTeam.findMany({ orderBy: { name: "asc" } });

    const currentGW = await prisma.jayGameweek.findFirst({
      where: { isCurrent: true },
    });
    const currentNumber = currentGW?.number ?? 1;

    const gameweeks = await prisma.jayGameweek.findMany({
      where: { number: { gte: currentNumber } },
      include: {
        fixtures: {
          include: { homeTeam: true, awayTeam: true },
          orderBy: { kickoffAt: "asc" },
        },
      },
      orderBy: { number: "asc" },
    });

    const picks = await prisma.jayPick.findMany({
      where: { entryId: entry.id },
      include: { team: true },
    });

    const now = new Date();
    const enrichedGameweeks = gameweeks.map((gw) => ({
      id: gw.id,
      number: gw.number,
      startAt: gw.startAt.toISOString(),
      endAt: gw.endAt.toISOString(),
      cutoffAt: gw.cutoffAt.toISOString(),
      isCurrent: gw.isCurrent,
      status:
        now > gw.cutoffAt ? ("past" as const) : now >= gw.startAt ? ("open" as const) : ("future" as const),
      fixtures: gw.fixtures.map((f) => ({
        id: f.id,
        homeTeamId: f.homeTeamId,
        awayTeamId: f.awayTeamId,
        homeTeam: {
          id: f.homeTeam.id,
          name: f.homeTeam.name,
          shortName: f.homeTeam.shortName,
          isTop6: f.homeTeam.isTop6,
          crestUrl: f.homeTeam.crestUrl,
        },
        awayTeam: {
          id: f.awayTeam.id,
          name: f.awayTeam.name,
          shortName: f.awayTeam.shortName,
          isTop6: f.awayTeam.isTop6,
          crestUrl: f.awayTeam.crestUrl,
        },
        kickoffAt: f.kickoffAt.toISOString(),
        status: f.status,
        homeScore: f.homeScore,
        awayScore: f.awayScore,
      })),
    }));

    const usedTeamIds = picks.map((p) => p.teamId);
    const top6Consumed = picks.some((p) => p.team.isTop6);

    return NextResponse.json({
      success: true,
      entry: { id: entry.id },
      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        shortName: t.shortName,
        isTop6: t.isTop6,
        crestUrl: t.crestUrl,
      })),
      gameweeks: enrichedGameweeks,
      picks: picks.map((p) => ({
        gameweekId: p.gameweekId,
        teamId: p.teamId,
        team: {
          id: p.team.id,
          name: p.team.name,
          shortName: p.team.shortName,
          isTop6: p.team.isTop6,
          crestUrl: p.team.crestUrl,
        },
        status: p.status,
        result: p.result,
      })),
      availability: { usedTeamIds, top6Consumed },
    });
  } catch (error) {
    console.error("Error fetching Jay planner:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch planner data" },
      { status: 500 }
    );
  }
}
```

### `src/app/api/jay/pick/route.ts` — Submit & Undo Picks

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureEntry } from "@/lib/jay/entry";

const isGameweekOpen = (startAt: Date, cutoffAt: Date) => {
  const now = new Date();
  return now >= startAt && now <= cutoffAt;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    const body = await request.json();
    const { gameweekId, teamId, sessionId } = body || {};

    if (!gameweekId || !teamId) {
      return NextResponse.json({ success: false, error: "Missing gameweekId or teamId" }, { status: 400 });
    }

    const entry = await ensureEntry(userId, sessionId || null);
    if (!entry) {
      return NextResponse.json({ success: false, error: "Missing session identifier" }, { status: 400 });
    }

    const gameweek = await prisma.jayGameweek.findUnique({
      where: { id: gameweekId },
    });
    if (!gameweek) {
      return NextResponse.json({ success: false, error: "Gameweek not found" }, { status: 404 });
    }

    if (!isGameweekOpen(gameweek.startAt, gameweek.cutoffAt)) {
      return NextResponse.json({ success: false, error: "Gameweek is closed" }, { status: 400 });
    }

    const existingPick = await prisma.jayPick.findFirst({
      where: { entryId: entry.id, gameweekId },
    });
    if (existingPick) {
      return NextResponse.json({ success: false, error: "Pick already submitted for this gameweek" }, { status: 400 });
    }

    const picks = await prisma.jayPick.findMany({
      where: { entryId: entry.id },
      include: { team: true },
    });

    const usedTeamIds = new Set(picks.map((pick) => pick.teamId));
    if (usedTeamIds.has(teamId)) {
      return NextResponse.json({ success: false, error: "Team already used" }, { status: 400 });
    }

    const top6Consumed = picks.some((pick) => pick.team.isTop6);
    const team = await prisma.jayTeam.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
    }

    if (top6Consumed && team.isTop6) {
      return NextResponse.json({ success: false, error: "Top 6 teams are locked for this entry" }, { status: 400 });
    }

    const fixtureCount = await prisma.jayFixture.count({
      where: {
        gameweekId,
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
    });

    if (fixtureCount === 0) {
      return NextResponse.json({ success: false, error: "Team not playing in this gameweek" }, { status: 400 });
    }

    const pick = await prisma.jayPick.create({
      data: {
        entryId: entry.id,
        gameweekId,
        teamId,
        status: "LOCKED",
      },
      include: { team: true, gameweek: true },
    });

    return NextResponse.json({ success: true, pick });
  } catch (error) {
    console.error("Error submitting Jay pick:", error);
    return NextResponse.json({ success: false, error: "Failed to submit pick" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    const { searchParams } = new URL(request.url);
    const gameweekId = searchParams.get("gameweekId");
    const sessionId = searchParams.get("sessionId");

    if (!gameweekId) {
      return NextResponse.json({ success: false, error: "Missing gameweekId" }, { status: 400 });
    }

    const entry = await ensureEntry(userId, sessionId || null);
    if (!entry) {
      return NextResponse.json({ success: false, error: "Missing session identifier" }, { status: 400 });
    }

    const gameweek = await prisma.jayGameweek.findUnique({
      where: { id: gameweekId },
    });
    if (!gameweek) {
      return NextResponse.json({ success: false, error: "Gameweek not found" }, { status: 404 });
    }

    if (!isGameweekOpen(gameweek.startAt, gameweek.cutoffAt)) {
      return NextResponse.json({ success: false, error: "Gameweek is closed — pick is final" }, { status: 400 });
    }

    const pick = await prisma.jayPick.findFirst({
      where: { entryId: entry.id, gameweekId },
    });
    if (!pick) {
      return NextResponse.json({ success: false, error: "No pick to undo" }, { status: 404 });
    }

    await prisma.jayPick.delete({ where: { id: pick.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error undoing Jay pick:", error);
    return NextResponse.json({ success: false, error: "Failed to undo pick" }, { status: 500 });
  }
}
```

### `src/app/api/jay/state/route.ts` — Game State

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureEntry } from "@/lib/jay/entry";

const getCurrentGameweek = async () => {
  return prisma.jayGameweek.findFirst({
    where: { isCurrent: true },
    include: {
      fixtures: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
        orderBy: { kickoffAt: "asc" },
      },
    },
  });
};

const computeAvailability = async (entryId: string, currentGameweekId: string) => {
  const picks = await prisma.jayPick.findMany({
    where: { entryId },
    include: { team: true },
    orderBy: { createdAt: "desc" },
  });

  const usedTeamIds = new Set(picks.map((pick) => pick.teamId));
  const top6Consumed = picks.some((pick) => pick.team.isTop6);

  const allTop6 = top6Consumed
    ? await prisma.jayTeam.findMany({ where: { isTop6: true } })
    : [];
  const lockedTeamIds = new Set(allTop6.map((team) => team.id));

  const currentWeekFixtures = await prisma.jayFixture.findMany({
    where: { gameweekId: currentGameweekId },
    include: { homeTeam: true, awayTeam: true },
    orderBy: { kickoffAt: "asc" },
  });

  const currentWeekTeamsMap = new Map<string, typeof currentWeekFixtures[number]["homeTeam"]>();
  currentWeekFixtures.forEach((fixture) => {
    currentWeekTeamsMap.set(fixture.homeTeamId, fixture.homeTeam);
    currentWeekTeamsMap.set(fixture.awayTeamId, fixture.awayTeam);
  });

  const availableTeams = Array.from(currentWeekTeamsMap.values()).filter(
    (team) => !usedTeamIds.has(team.id) && !lockedTeamIds.has(team.id)
  );

  const usedTeams = picks.map((pick) => pick.team);
  const lockedTeams = top6Consumed ? allTop6 : [];

  const currentPick = picks.find((pick) => pick.gameweekId === currentGameweekId) || null;

  return {
    picks,
    usedTeams,
    lockedTeams,
    availableTeams,
    currentPick,
    top6Consumed,
  };
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    const currentGameweek = await getCurrentGameweek();
    if (!currentGameweek) {
      return NextResponse.json({ success: false, error: "No current gameweek configured" }, { status: 404 });
    }

    const entry = await ensureEntry(userId, sessionId);
    if (!entry) {
      return NextResponse.json({ success: false, error: "Missing session identifier" }, { status: 400 });
    }

    const availability = await computeAvailability(entry.id, currentGameweek.id);

    const now = new Date();
    const isOpen = now >= currentGameweek.startAt && now <= currentGameweek.cutoffAt;

    return NextResponse.json({
      success: true,
      entry,
      gameweek: currentGameweek,
      fixtures: currentGameweek.fixtures,
      availability,
      isOpen,
    });
  } catch (error) {
    console.error("Error fetching Jay state:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch state" }, { status: 500 });
  }
}
```

### `src/app/api/jay/admin-import/route.ts` — Manual Import

```typescript
import { NextResponse } from "next/server";
import { importJayFromFpl } from "@/lib/jay/import";

export async function POST() {
  try {
    const summary = await importJayFromFpl();
    return NextResponse.json({ success: true, ...summary });
  } catch (error) {
    console.error("Jay import failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Import failed" },
      { status: 500 }
    );
  }
}
```

### `src/app/api/jay/import/route.ts` — Cron Import

```typescript
import { NextRequest, NextResponse } from "next/server";
import { importJayFromFpl } from "@/lib/jay/import";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expected = process.env.CRON_SECRET;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const summary = await importJayFromFpl();
    return NextResponse.json({ success: true, ...summary });
  } catch (error) {
    console.error("Jay import failed:", error);
    return NextResponse.json({ success: false, error: "Import failed" }, { status: 500 });
  }
}
```

### `src/app/admin/jay/page.tsx` — Admin Dashboard

```typescript
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SuiteHeader from "@/components/SuiteHeader";
import { isAdmin } from "@/lib/admin";

type ImportSummary = {
  season: string;
  events: number;
  fixtures: number;
};

const formatCountdown = (target: Date) => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "Refreshing now";
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const getNextCronUtc = (hourUtc: number, minuteUtc: number) => {
  const now = new Date();
  const next = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hourUtc,
    minuteUtc,
    0,
    0
  ));

  if (next.getTime() <= now.getTime()) {
    next.setUTCDate(next.getUTCDate() + 1);
  }

  return next;
};

export default function JayAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [now, setNow] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !isAdmin(session.user?.email)) {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const nextRefresh = useMemo(() => getNextCronUtc(3, 0), [now]);

  const handleRefresh = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      const response = await fetch("/api/jay/admin-import", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Import failed");
      }
      setSummary({
        season: data.season,
        events: data.events,
        fixtures: data.fixtures,
      });
      setMessage("Import completed successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white">
      <SuiteHeader
        title="Jay Admin"
        subtitle="Premier League schedule refresh controls"
        backHref="/admin"
      />

      <main className="mx-auto max-w-5xl px-6 pb-20">
        <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 via-slate-900/70 to-slate-950/80 p-8 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">Vercel Cron</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold">Refresh schedule</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/70">
                Schedule pulls from Fantasy Premier League daily at 03:00 UTC. Cutoff times are automatically set
                to one week before the first kickoff, with a minimum of two days before kickoff if the week is
                compressed.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Next Refresh (UTC)</p>
                <p className="mt-2 text-lg font-semibold">
                  {nextRefresh.toISOString().replace("T", " ").slice(0, 16)}
                </p>
                <p className="mt-2 text-xs text-white/60">Daily schedule at 03:00 UTC</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Countdown</p>
                <p className="mt-2 text-lg font-semibold text-emerald-200">
                  {formatCountdown(nextRefresh)}
                </p>
                <p className="mt-2 text-xs text-white/60">Auto refresh window</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Manual refresh</h2>
            <p className="mt-3 text-sm text-white/70">
              Use this when fixtures change at short notice. This will re-import teams, gameweeks, and fixtures and
              update the current gameweek flag.
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={submitting}
              className="mt-5 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Refreshing..." : "Run refresh now"}
            </button>
            {message && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                {message}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Latest run</h2>
            <p className="mt-3 text-xs text-white/60">Updates after manual refresh.</p>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Season</p>
                <p className="mt-2 text-base font-semibold text-white">{summary?.season || "—"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Gameweeks</p>
                <p className="mt-2 text-base font-semibold text-white">{summary?.events ?? "—"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Fixtures</p>
                <p className="mt-2 text-base font-semibold text-white">{summary?.fixtures ?? "—"}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
```

### `src/app/jay/page.tsx` — Main Game UI

The full 993-line page component is the main game interface. Key sections:

- **Lines 1-50:** Types (Team, Fixture, Gameweek, PlannerData, Selections, LmsPicks)
- **Lines 51-102:** Helpers (session ID, formatters, localStorage, Crest component)
- **Lines 106-170:** State management, data fetching, swipe gestures
- **Lines 171-237:** Derived state (fixturesByDay, top6Ids, LMS availability, selectedTeams)
- **Lines 238-291:** `toggleSelection` — prediction handler with Top 6 swap enforcement
- **Lines 293-312:** `toggleLmsPick` — LMS pick handler with used/top6 validation
- **Lines 314-425:** Server submit, undo, clipboard copy
- **Lines 427-456:** Triple-tap header refresh, FPL import handler
- **Lines 458-993:** JSX render (header, GW navigator, dot strip, toast, contextual prompts, fixtures, LMS picker, rules, bottom bar)

**The full source is included in the repository — copy `src/app/jay/page.tsx` directly.**

---

## Key Implementation Details

### Top 6 Enforcement (3 layers)

1. **Prediction level** (`toggleSelection`): Only one Top 6 team can be selected per gameweek. Selecting a second auto-swaps the first with a toast message.

2. **LMS pick level** (`toggleLmsPick`): Shows "used" / "top6-locked" status. Prevents selecting unavailable teams with error messages.

3. **Server level** (`POST /api/jay/pick`): Final validation — checks all previous picks, rejects if Top 6 already consumed or team already used.

### Gameweek Status Logic

```
past:   now > cutoffAt          (locked, no changes)
open:   startAt <= now <= cutoffAt  (can submit/undo picks)
future: now < startAt           (can plan ahead, can't lock in)
```

### Cutoff Calculation

- Default: 7 days before first kickoff of the gameweek
- Compressed weeks: minimum 2 days before kickoff
- Never before season start date

### localStorage Keys

- `jay-sid` — session ID (UUID)
- `jay-selections` — `{gwId: {fixtureId: teamId}}` predictions
- `jay-lms-picks` — `{gwId: teamId}` LMS picks (local, before lock-in)

### Team Crests

Loaded from FPL CDN: `https://resources.premierleague.com/premierleague/badges/70/t{code}.png`

Fallback: gray circle with 3-letter abbreviation.

### FPL API

- Bootstrap: `https://fantasy.premierleague.com/api/bootstrap-static/` (teams, events)
- Fixtures: `https://fantasy.premierleague.com/api/fixtures/` (all fixtures with scores)
- Requires browser-like User-Agent header to avoid 403 on Vercel

---

## Setup in New Repo

```bash
# 1. Copy all files from the structure above
# 2. Add Prisma schema models
# 3. Install dependencies
npm install prisma @prisma/client next-auth

# 4. Generate Prisma client
npx prisma generate

# 5. Run migration
npx prisma migrate dev --name add_jay_tables

# 6. Set environment variables (DATABASE_URL, CRON_SECRET)

# 7. Import initial FPL data
curl -X POST http://localhost:3000/api/jay/admin-import

# 8. Open http://localhost:3000/jay
```

### External Dependencies

- `next-auth` + `@auth/prisma-adapter` — for optional auth (remove if not needed)
- `@prisma/client` — ORM
- `SuiteHeader` component — used in admin page (replace with your own header)

---

## Design Notes

- **Color:** `#821b39` (deep maroon/burgundy) — brand primary
- **Mobile-first:** Fixed full-screen layout on mobile, centered card on desktop
- **Swipe navigation:** Touch gestures for gameweek switching (horizontal only)
- **Triple-tap:** Header triple-tap triggers FPL data refresh (hidden admin feature)
- **Toast:** 3-second auto-dismiss messages for feedback
- **Bottom bar:** Always visible with current pick status and action buttons
