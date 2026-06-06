'use client'

import {
  CalendarDays,
  Check,
  ChevronRight,
  Clapperboard,
  Clock3,
  Filter,
  MonitorPlay,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Tv,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './media-guide.css'

type Tab = 'today' | 'streaming' | 'cinema' | 'watching' | 'settings'

type TvMazeEpisode = {
  id: number
  name: string
  season: number
  number: number | null
  airtime: string
  airstamp: string
  runtime: number | null
  show: {
    id: number
    name: string
    type: string
    language: string
    image?: { medium?: string }
    network?: { name: string }
    webChannel?: { name: string }
  }
}

type TmdbItem = {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
  provider?: string
}

type Provider = {
  id: number
  label: string
  match: string[]
  enabled: boolean
}

type WatchingItem = {
  id: string
  title: string
  service: string
  nextEpisode: string
  cadence: string
  notes: string
  done: boolean
}

const defaultProviders: Provider[] = [
  { id: 0, label: 'Sky / NOW', match: ['Sky Go', 'NOW', 'Now TV'], enabled: true },
  { id: 0, label: 'Netflix', match: ['Netflix'], enabled: true },
  { id: 0, label: 'Prime Video', match: ['Amazon Prime Video', 'Prime Video'], enabled: true },
  { id: 0, label: 'Apple TV+', match: ['Apple TV Plus', 'Apple TV+', 'Apple TV'], enabled: true },
  { id: 0, label: 'Paramount+', match: ['Paramount Plus', 'Paramount+'], enabled: true },
]

const fallbackStreaming: TmdbItem[] = [
  {
    id: 9001,
    title: 'Add your TMDb key',
    overview: 'Streaming rows become live once a TMDb API key is saved in Settings.',
    poster_path: null,
    vote_average: 0,
    provider: 'Ireland streaming',
  },
]

const starterWatching: WatchingItem[] = [
  {
    id: 'starter-slow-horses',
    title: 'Example: Slow Horses',
    service: 'Apple TV+',
    nextEpisode: new Date().toISOString().slice(0, 10),
    cadence: 'Weekly',
    notes: 'Replace this with one of your own shows.',
    done: false,
  },
]

function App() {
  const [tab, setTab] = useState<Tab>('today')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [tvItems, setTvItems] = useState<TvMazeEpisode[]>([])
  const [tvLoading, setTvLoading] = useState(false)
  const [tvError, setTvError] = useState('')
  const [tmdbKey, setTmdbKey] = useStoredState('mediaguide.tmdbKey', '')
  const [providers, setProviders] = useStoredState<Provider[]>('mediaguide.providers', defaultProviders)
  const [watching, setWatching] = useStoredState<WatchingItem[]>('mediaguide.watching', starterWatching)
  const [watchlistSource, setWatchlistSource] = useState<'syncing' | 'neon' | 'local'>('syncing')
  const [streaming, setStreaming] = useState<TmdbItem[]>(fallbackStreaming)
  const [cinema, setCinema] = useState<TmdbItem[]>([])
  const [tmdbLoading, setTmdbLoading] = useState(false)
  const [query, setQuery] = useState('')

  const enabledProviders = providers.filter((provider) => provider.enabled)
  const dueSoon = watching
    .filter((item) => !item.done)
    .sort((a, b) => a.nextEpisode.localeCompare(b.nextEpisode))
    .slice(0, 3)

  const filteredTvItems = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return tvItems
    return tvItems.filter((item) => {
      const channel = item.show.network?.name ?? item.show.webChannel?.name ?? ''
      return `${item.show.name} ${item.name} ${channel}`.toLowerCase().includes(term)
    })
  }, [query, tvItems])

  useEffect(() => {
    let ignore = false
    async function loadSchedule() {
      setTvLoading(true)
      setTvError('')
      try {
        const response = await fetch(`https://api.tvmaze.com/schedule?country=IE&date=${selectedDate}`)
        if (!response.ok) throw new Error('Could not load Irish TV schedule.')
        const data = (await response.json()) as TvMazeEpisode[]
        if (!ignore) setTvItems(data)
      } catch (error) {
        if (!ignore) setTvError(error instanceof Error ? error.message : 'Could not load TV schedule.')
      } finally {
        if (!ignore) setTvLoading(false)
      }
    }
    loadSchedule()
    return () => {
      ignore = true
    }
  }, [selectedDate])

  useEffect(() => {
    let ignore = false
    async function loadTmdb() {
      if (!tmdbKey.trim()) {
        setStreaming(fallbackStreaming)
        setCinema([])
        return
      }
      setTmdbLoading(true)
      try {
        const providerMap = await fetchTmdbProviders(tmdbKey, providers)
        const enabledIds = providerMap.filter((item) => item.enabled && item.id).map((item) => item.id)
        const [movieRows, tvRows, cinemaRows] = await Promise.all([
          enabledIds.length ? fetchTmdbDiscover(tmdbKey, 'movie', enabledIds, providerMap) : Promise.resolve([]),
          enabledIds.length ? fetchTmdbDiscover(tmdbKey, 'tv', enabledIds, providerMap) : Promise.resolve([]),
          fetchTmdbCinema(tmdbKey),
        ])

        if (!ignore) {
          if (providersChanged(providers, providerMap)) {
            setProviders(providerMap)
          }
          setStreaming([...movieRows, ...tvRows].slice(0, 18))
          setCinema(cinemaRows)
        }
      } catch {
        if (!ignore) {
          setStreaming(fallbackStreaming)
          setCinema([])
        }
      } finally {
        if (!ignore) setTmdbLoading(false)
      }
    }
    loadTmdb()
    return () => {
      ignore = true
    }
  }, [providers, setProviders, tmdbKey])

  useEffect(() => {
    let ignore = false
    async function loadWatchlist() {
      try {
        const response = await fetch('/api/media-guide/watchlist')
        if (!response.ok) throw new Error('Watchlist API unavailable.')
        const data = (await response.json()) as WatchingItem[]
        if (!ignore) {
          setWatching(data)
          setWatchlistSource('neon')
        }
      } catch {
        if (!ignore) setWatchlistSource('local')
      }
    }
    loadWatchlist()
    return () => {
      ignore = true
    }
  }, [setWatching])

  function toggleProvider(label: string) {
    setProviders((current) =>
      current.map((provider) =>
        provider.label === label ? { ...provider, enabled: !provider.enabled } : provider,
      ),
    )
  }

  async function persistWatchingItem(item: WatchingItem) {
    setWatching((current) => [item, ...current])
    try {
      const response = await fetch('/api/media-guide/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (!response.ok) throw new Error('Could not save watchlist item.')
      const saved = (await response.json()) as WatchingItem
      setWatching((current) => current.map((row) => (row.id === item.id ? saved : row)))
      setWatchlistSource('neon')
    } catch {
      setWatchlistSource('local')
    }
  }

  async function addWatching(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') ?? '').trim()
    if (!title) return
    const item: WatchingItem = {
      id: crypto.randomUUID(),
      title,
      service: String(data.get('service') ?? 'TV'),
      nextEpisode: String(data.get('nextEpisode') || new Date().toISOString().slice(0, 10)),
      cadence: String(data.get('cadence') || 'Weekly'),
      notes: String(data.get('notes') ?? ''),
      done: false,
    }
    await persistWatchingItem(item)
    event.currentTarget.reset()
  }

  async function toggleWatching(item: WatchingItem) {
    const nextDone = !item.done
    setWatching((current) => current.map((row) => (row.id === item.id ? { ...row, done: nextDone } : row)))
    try {
      const response = await fetch('/api/media-guide/watchlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, done: nextDone }),
      })
      if (!response.ok) throw new Error('Could not update watchlist item.')
      setWatchlistSource('neon')
    } catch {
      setWatchlistSource('local')
    }
  }

  async function removeWatching(id: string) {
    setWatching((current) => current.filter((row) => row.id !== id))
    try {
      const response = await fetch(`/api/media-guide/watchlist?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete watchlist item.')
      setWatchlistSource('neon')
    } catch {
      setWatchlistSource('local')
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Ireland only</p>
          <h1>Media Guide</h1>
        </div>
        <button className="icon-button" type="button" aria-label="Settings" onClick={() => setTab('settings')}>
          <Settings size={20} />
        </button>
      </header>

      <section className="summary-band">
        <div className="signal">
          <Tv size={20} />
          <div>
            <strong>{tvLoading ? 'Loading' : tvItems.length}</strong>
            <span>TV listings</span>
          </div>
        </div>
        <div className="signal">
          <MonitorPlay size={20} />
          <div>
            <strong>{enabledProviders.length}</strong>
            <span>services</span>
          </div>
        </div>
        <div className="signal">
          <CalendarDays size={20} />
          <div>
            <strong>{watching.filter((item) => !item.done).length}</strong>
            <span>tracked</span>
          </div>
        </div>
      </section>

      {dueSoon.length > 0 && (
        <section className="next-strip">
          <span>Up next</span>
          {dueSoon.map((item) => (
            <button key={item.id} type="button" onClick={() => setTab('watching')}>
              {item.title}
              <small>{formatShortDate(item.nextEpisode)}</small>
            </button>
          ))}
        </section>
      )}

      <nav className="tabs" aria-label="Guide views">
        <TabButton active={tab === 'today'} icon={<Tv size={18} />} label="Today" onClick={() => setTab('today')} />
        <TabButton
          active={tab === 'streaming'}
          icon={<Sparkles size={18} />}
          label="Streaming"
          onClick={() => setTab('streaming')}
        />
        <TabButton
          active={tab === 'cinema'}
          icon={<Clapperboard size={18} />}
          label="Cinema"
          onClick={() => setTab('cinema')}
        />
        <TabButton
          active={tab === 'watching'}
          icon={<Star size={18} />}
          label="My Shows"
          onClick={() => setTab('watching')}
        />
      </nav>

      {tab === 'today' && (
        <section className="view">
          <div className="tool-row">
            <label className="field compact">
              <CalendarDays size={17} />
              <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
            </label>
            <label className="field search">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search TV" />
            </label>
          </div>
          {tvError && <p className="notice error">{tvError}</p>}
          <div className="list">
            {tvLoading && <SkeletonRows />}
            {!tvLoading &&
              filteredTvItems.map((item) => (
                <article className="programme" key={item.id}>
                  <div className="time">
                    <Clock3 size={16} />
                    <strong>{item.airtime || formatTime(item.airstamp)}</strong>
                  </div>
                  {item.show.image?.medium ? (
                    <img src={item.show.image.medium} alt="" />
                  ) : (
                    <div className="poster-fallback">
                      <Tv size={22} />
                    </div>
                  )}
                  <div className="programme-copy">
                    <span>{item.show.network?.name ?? item.show.webChannel?.name ?? 'Ireland TV'}</span>
                    <h2>{item.show.name}</h2>
                    <p>
                      {item.name}
                      {item.season ? ` · S${item.season}${item.number ? ` E${item.number}` : ''}` : ''}
                    </p>
                  </div>
                  <button
                    className="icon-button quiet"
                    type="button"
                    aria-label={`Track ${item.show.name}`}
                    onClick={() =>
                      persistWatchingItem({
                        id: crypto.randomUUID(),
                        title: item.show.name,
                        service: item.show.network?.name ?? item.show.webChannel?.name ?? 'TV',
                        nextEpisode: selectedDate,
                        cadence: 'Weekly',
                        notes: item.name,
                        done: false,
                      })
                    }
                  >
                    <Plus size={18} />
                  </button>
                </article>
              ))}
            {!tvLoading && filteredTvItems.length === 0 && (
              <EmptyState
                title="No Irish TV listings from TVMaze today"
                detail="The app is ready for a Sky Ireland EPG table or another licensed listings feed."
              />
            )}
          </div>
        </section>
      )}

      {tab === 'streaming' && (
        <section className="view">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Netflix, Prime, Apple TV+, Paramount+, Sky / NOW</p>
              <h2>Streaming in Ireland</h2>
            </div>
            <RefreshCw className={tmdbLoading ? 'spin' : ''} size={18} />
          </div>
          <div className="provider-row">
            {providers.map((provider) => (
              <button
                className={provider.enabled ? 'provider active' : 'provider'}
                key={provider.label}
                type="button"
                onClick={() => toggleProvider(provider.label)}
              >
                <Filter size={15} />
                {provider.label}
              </button>
            ))}
          </div>
          <MediaGrid items={streaming} onTrack={(item) => persistWatchingItem(mediaToWatchingItem(item))} />
        </section>
      )}

      {tab === 'cinema' && (
        <section className="view">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Region IE</p>
              <h2>Movie Releases</h2>
            </div>
            <Clapperboard size={19} />
          </div>
          {cinema.length ? (
            <MediaGrid items={cinema} onTrack={(item) => persistWatchingItem(mediaToWatchingItem(item))} />
          ) : (
            <EmptyState title="Add a TMDb key to load Irish cinema releases" />
          )}
        </section>
      )}

      {tab === 'watching' && (
        <section className="view">
          <form className="add-form" onSubmit={addWatching}>
            <input name="title" placeholder="Programme or film" required />
            <div className="form-grid">
              <input name="service" placeholder="Service" />
              <input name="nextEpisode" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="form-grid">
              <select name="cadence" defaultValue="Weekly">
                <option>Weekly</option>
                <option>Daily</option>
                <option>Monthly</option>
                <option>One-off</option>
                <option>Unknown</option>
              </select>
              <input name="notes" placeholder="Episode, season, note" />
            </div>
            <button className="primary-button" type="submit">
              <Plus size={18} />
              Add to My Shows
            </button>
          </form>
          <div className="watch-list">
            {watching.map((item) => (
              <article className={item.done ? 'watch-item done' : 'watch-item'} key={item.id}>
                <button className="check" type="button" aria-label={`Mark ${item.title} watched`} onClick={() => toggleWatching(item)}>
                  {item.done && <Check size={16} />}
                </button>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.service}</p>
                  {item.notes && <span>{item.notes}</span>}
                </div>
                <div className="date-pill">{formatShortDate(item.nextEpisode)}</div>
                <button
                  className="icon-button quiet"
                  type="button"
                  aria-label={`Remove ${item.title}`}
                  onClick={() => removeWatching(item.id)}
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === 'settings' && (
        <section className="view">
          <div className="settings-panel">
            <h2>Data Sources</h2>
            <p>
              TV uses TVMaze country IE. Streaming and cinema use TMDb with watch region IE. Your key is stored only in
              this browser.
            </p>
            <label className="settings-field">
              TMDb API key
              <input
                value={tmdbKey}
                onChange={(event) => setTmdbKey(event.target.value)}
                placeholder="Paste TMDb v3 API key"
              />
            </label>
            <div className="source-list">
              <div>
                <strong>Sky TV</strong>
                <span>Direct Sky EPG data is not public; use TVMaze now or connect a licensed EPG table later.</span>
              </div>
              <ChevronRight size={18} />
            </div>
            <div className="source-list">
              <div>
                <strong>Database ready</strong>
                <span>
                  Watchlist storage: {watchlistSource === 'neon' ? 'Neon database' : watchlistSource === 'syncing' ? 'checking Neon' : 'local fallback'}
                </span>
              </div>
              <ChevronRight size={18} />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button className={active ? 'tab active' : 'tab'} type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  )
}

function MediaGrid({ items, onTrack }: { items: TmdbItem[]; onTrack: (item: TmdbItem) => void }) {
  return (
    <div className="media-grid">
      {items.map((item) => (
        <article className="media-card" key={`${item.provider}-${item.id}`}>
          {item.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt="" />
          ) : (
            <div className="poster-fallback large">
              <MonitorPlay size={28} />
            </div>
          )}
          <div>
            <span>{item.provider ?? item.release_date ?? item.first_air_date ?? 'Ireland'}</span>
            <h2>{item.title ?? item.name}</h2>
            <p>{item.overview || 'No summary available.'}</p>
          </div>
          <button type="button" onClick={() => onTrack(item)}>
            <Plus size={16} />
            Track
          </button>
        </article>
      ))}
    </div>
  )
}

function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="empty">
      <MonitorPlay size={28} />
      <h2>{title}</h2>
      {detail && <p>{detail}</p>}
    </div>
  )
}

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <div className="skeleton" key={item} />
      ))}
    </>
  )
}

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

async function fetchTmdbProviders(apiKey: string, currentProviders: Provider[]) {
  const response = await fetch(`https://api.themoviedb.org/3/watch/providers/movie?api_key=${apiKey}&watch_region=IE`)
  if (!response.ok) throw new Error('Could not load TMDb providers.')
  const data = (await response.json()) as { results: { provider_id: number; provider_name: string }[] }

  return currentProviders.map((provider) => {
    const match = data.results.find((row) =>
      provider.match.some((candidate) => row.provider_name.toLowerCase().includes(candidate.toLowerCase())),
    )
    return { ...provider, id: match?.provider_id ?? provider.id }
  })
}

async function fetchTmdbDiscover(
  apiKey: string,
  type: 'movie' | 'tv',
  providerIds: number[],
  providers: Provider[],
): Promise<TmdbItem[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&watch_region=IE&with_watch_providers=${providerIds.join(
      '|',
    )}&sort_by=popularity.desc`,
  )
  if (!response.ok) throw new Error('Could not load TMDb titles.')
  const data = (await response.json()) as { results: TmdbItem[] }
  return data.results.slice(0, 12).map((item, index) => ({
    ...item,
    provider: providers[index % providers.length]?.label ?? 'Streaming',
  }))
}

async function fetchTmdbCinema(apiKey: string): Promise<TmdbItem[]> {
  const today = new Date()
  const future = new Date()
  future.setDate(today.getDate() + 60)
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&region=IE&primary_release_date.gte=${today
      .toISOString()
      .slice(0, 10)}&primary_release_date.lte=${future.toISOString().slice(0, 10)}&sort_by=primary_release_date.asc`,
  )
  if (!response.ok) throw new Error('Could not load cinema releases.')
  const data = (await response.json()) as { results: TmdbItem[] }
  return data.results.slice(0, 18).map((item) => ({ ...item, provider: item.release_date }))
}

function mediaToWatchingItem(item: TmdbItem): WatchingItem {
  return {
    id: crypto.randomUUID(),
    title: item.title ?? item.name ?? 'Untitled',
    service: item.provider ?? 'Streaming',
    nextEpisode: item.release_date ?? item.first_air_date ?? new Date().toISOString().slice(0, 10),
    cadence: 'Unknown',
    notes: item.overview.slice(0, 120),
    done: false,
  }
}

function providersChanged(left: Provider[], right: Provider[]) {
  return left.some((provider, index) => {
    const next = right[index]
    return !next || provider.id !== next.id || provider.enabled !== next.enabled
  })
}

function formatTime(value: string) {
  if (!value) return 'TBC'
  return new Intl.DateTimeFormat('en-IE', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('en-IE', { day: '2-digit', month: 'short' }).format(new Date(value))
}

export default App
