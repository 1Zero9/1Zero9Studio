import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'
import { hasMediaGuideSession } from '@/lib/media-guide-auth'

type WatchlistRow = {
  id: string
  title: string
  service: string | null
  next_episode: string | null
  cadence: string | null
  notes: string | null
  done: boolean
  status: string | null
}

type WatchlistPayload = {
  id?: string
  title?: string
  service?: string
  nextEpisode?: string
  cadence?: string
  notes?: string
  done?: boolean
  status?: string
}

export async function GET() {
  const unauthorized = await requireMediaGuideSession()
  if (unauthorized) return unauthorized

  const sql = await getSql()
  const rows = await sql`
    select id, title, service, next_episode, cadence, notes, done, status
    from media_watchlist
    order by done asc, next_episode asc nulls last, created_at desc
  `

  return NextResponse.json((rows as WatchlistRow[]).map(mapRow))
}

export async function POST(request: Request) {
  const unauthorized = await requireMediaGuideSession()
  if (unauthorized) return unauthorized

  const payload = (await request.json()) as WatchlistPayload
  if (!payload.title?.trim()) {
    return NextResponse.json({ error: 'title is required.' }, { status: 400 })
  }

  const sql = await getSql()
  const rows = await sql`
    insert into media_watchlist (id, title, service, next_episode, cadence, notes, done, status)
    values (
      ${payload.id ?? crypto.randomUUID()},
      ${payload.title.trim()},
      ${payload.service ?? ''},
      ${payload.nextEpisode || null},
      ${payload.cadence ?? 'Weekly'},
      ${payload.notes ?? ''},
      ${payload.done ?? false},
      ${payload.status ?? (payload.done ? 'completed' : 'watching')}
    )
    returning id, title, service, next_episode, cadence, notes, done, status
  `

  return NextResponse.json(mapRow(rows[0] as WatchlistRow), { status: 201 })
}

export async function PATCH(request: Request) {
  const unauthorized = await requireMediaGuideSession()
  if (unauthorized) return unauthorized

  const payload = (await request.json()) as WatchlistPayload
  if (!payload.id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 })
  }

  const sql = await getSql()
  const rows = await sql`
    update media_watchlist
    set done = ${Boolean(payload.done)},
        status = ${payload.status ?? (payload.done ? 'completed' : 'watching')}
    where id = ${payload.id}
    returning id, title, service, next_episode, cadence, notes, done, status
  `

  if (!rows.length) {
    return NextResponse.json({ error: 'watchlist item not found.' }, { status: 404 })
  }

  return NextResponse.json(mapRow(rows[0] as WatchlistRow))
}

export async function DELETE(request: Request) {
  const unauthorized = await requireMediaGuideSession()
  if (unauthorized) return unauthorized

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 })
  }

  const sql = await getSql()
  await sql`delete from media_watchlist where id = ${id}`

  return new NextResponse(null, { status: 204 })
}

async function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.')
  }

  const sql = neon(process.env.DATABASE_URL)
  await ensureTable(sql)
  return sql
}

async function ensureTable(sql: NeonQueryFunction<false, false>) {
  await sql`
    create table if not exists media_watchlist (
      id uuid primary key,
      title text not null,
      service text,
      next_episode date,
      cadence text,
      notes text,
      status text,
      done boolean default false,
      created_at timestamp default current_timestamp
    )
  `
  await sql`alter table media_watchlist add column if not exists status text`
}

function mapRow(row: WatchlistRow) {
  return {
    id: row.id,
    title: row.title,
    service: row.service ?? '',
    nextEpisode: row.next_episode ?? new Date().toISOString().slice(0, 10),
    cadence: row.cadence ?? 'Unknown',
    notes: row.notes ?? '',
    done: row.done,
    status: row.status ?? (row.done ? 'completed' : 'watching'),
  }
}

async function requireMediaGuideSession() {
  if (await hasMediaGuideSession()) {
    return null
  }

  return NextResponse.json(
    { error: 'Media Guide login required.' },
    { status: 401, headers: { 'Cache-Control': 'no-store' } },
  )
}
