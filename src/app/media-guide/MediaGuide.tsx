'use client'

import {
  CalendarDays,
  Check,
  ChevronRight,
  Clapperboard,
  Copy,
  Clock3,
  Eye,
  Filter,
  Heart,
  ListPlus,
  MonitorPlay,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Sun,
  Trash2,
  Tv,
  ThumbsDown,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './media-guide.css'

type Tab = 'today' | 'streaming' | 'cinema' | 'watching' | 'lists' | 'settings'
type ThemeMode = 'dark' | 'light'
type ListingTimeMode = 'from_now' | 'full_day'

type TvMazeEpisode = {
  id: number | string
  name: string
  season: number
  number: number | null
  airtime: string
  airstamp: string
  runtime: number | null
  show: {
    id: number | string
    name: string
    type: string
    language: string
    image?: { medium?: string }
    network?: { name: string }
    webChannel?: { name: string }
  }
}

type EpgChannel = {
  id: string
  icon?: string
  name: string
}

type TmdbItem = {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string | null
  vote_average: number
  genre_ids?: number[]
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

type RecommendationList = {
  id: string
  name: string
  shareSlug: string
}

type RecommendationItem = {
  id: string
  listId: string | null
  tmdbId: number | null
  mediaType: string
  status: 'seen' | 'favorite' | 'recommend' | 'not_interested'
  title: string
  service: string
  posterPath: string | null
  overview: string
  note: string
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
    title: 'TMDb server key required',
    overview: 'Streaming rows load from the protected server API once TMDB_API_KEY is configured.',
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

const starterSkyChannelMatches = [
  'RTÉ One',
  'RTE One',
  'RTÉ2',
  'RTE2',
  'Virgin Media One',
  'Virgin Media Two',
  'Virgin Media Three',
  'TG4',
  'BBC One',
  'BBC Two',
  'UTV',
  'Channel 4',
  'Sky Showcase',
  'Sky Atlantic',
  'Sky Max',
  'Sky Cinema Premiere',
  'Sky Sports Main Event',
  'Sky Sports Premier League',
  'Sky Sports F1',
  'Sky News',
  'Comedy Central',
  'Discovery',
  'National Geographic',
]

function App() {
  const [tab, setTab] = useState<Tab>('today')
  const [selectedDate, setSelectedDate] = useState(() => formatIrelandDate(new Date()))
  const [tvItems, setTvItems] = useState<TvMazeEpisode[]>([])
  const [tvChannels, setTvChannels] = useState<EpgChannel[]>([])
  const [tvLoading, setTvLoading] = useState(false)
  const [tvError, setTvError] = useState('')
  const [themeMode, setThemeMode] = useStoredState<ThemeMode>('mediaguide.themeMode', 'dark')
  const [listingTimeMode, setListingTimeMode] = useStoredState<ListingTimeMode>(
    'mediaguide.listingTimeMode',
    'from_now',
  )
  const [now, setNow] = useState(() => new Date())
  const [channelMode, setChannelMode] = useStoredState<'favorites' | 'all'>('mediaguide.channelMode', 'favorites')
  const [favoriteChannelIds, setFavoriteChannelIds] = useStoredState<string[] | null>(
    'mediaguide.favoriteChannelIds',
    null,
  )
  const [providers, setProviders] = useStoredState<Provider[]>('mediaguide.providers', defaultProviders)
  const [hiddenGenreIds, setHiddenGenreIds] = useStoredState<number[]>('mediaguide.hiddenGenres', [])
  const [watching, setWatching] = useStoredState<WatchingItem[]>('mediaguide.watching', starterWatching)
  const [watchlistSource, setWatchlistSource] = useState<'syncing' | 'neon' | 'local'>('syncing')
  const [streaming, setStreaming] = useState<TmdbItem[]>(fallbackStreaming)
  const [cinema, setCinema] = useState<TmdbItem[]>([])
  const [tmdbLoading, setTmdbLoading] = useState(false)
  const [tmdbRefreshedAt, setTmdbRefreshedAt] = useState('')
  const [tmdbRefreshNonce, setTmdbRefreshNonce] = useState(0)
  const [refreshPulse, setRefreshPulse] = useState(false)
  const [query, setQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState('all')
  const [discoveryQuery, setDiscoveryQuery] = useState('')
  const [discoveryGenreId, setDiscoveryGenreId] = useState(0)
  const [recommendationLists, setRecommendationLists] = useState<RecommendationList[]>([])
  const [recommendationItems, setRecommendationItems] = useState<RecommendationItem[]>([])
  const [selectedListId, setSelectedListId] = useState('')
  const [genreMap, setGenreMap] = useState<Record<number, string>>({})
  const [toast, setToast] = useState('')
  const refreshPulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enabledProviders = providers.filter((provider) => provider.enabled)
  const dueSoon = watching
    .filter((item) => !item.done)
    .sort((a, b) => a.nextEpisode.localeCompare(b.nextEpisode))
    .slice(0, 3)
  const hiddenTmdbIds = useMemo(
    () =>
      new Set(
        recommendationItems
          .filter((item) => item.tmdbId && (item.status === 'seen' || item.status === 'not_interested'))
          .map((item) => item.tmdbId as number),
      ),
    [recommendationItems],
  )
  const hiddenGenres = useMemo(() => new Set(hiddenGenreIds), [hiddenGenreIds])
  const filteredStreamingItems = useMemo(
    () => streaming.filter((item) => isVisibleDiscoveryItem(item, hiddenTmdbIds, hiddenGenres)),
    [hiddenGenres, hiddenTmdbIds, streaming],
  )
  const filteredCinemaItems = useMemo(
    () => cinema.filter((item) => isVisibleDiscoveryItem(item, hiddenTmdbIds, hiddenGenres)),
    [cinema, hiddenGenres, hiddenTmdbIds],
  )
  const genreOptions = useMemo(() => {
    const ids = new Set<number>()
    ;[...streaming, ...cinema].forEach((item) => item.genre_ids?.forEach((id) => ids.add(id)))
    return Array.from(ids)
      .map((id) => ({ id, name: genreMap[id] }))
      .filter((genre): genre is { id: number; name: string } => Boolean(genre.name))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [cinema, genreMap, streaming])
  const suggestedFavoriteChannelIds = useMemo(() => {
    if (!tvChannels.length) return []
    return tvChannels
      .filter((channel) => {
        const normalizedName = channel.name.toLowerCase()
        return starterSkyChannelMatches.some((candidate) => normalizedName.includes(candidate.toLowerCase()))
      })
      .map((channel) => channel.id)
      .slice(0, 28)
  }, [tvChannels])
  const effectiveFavoriteChannelIds = favoriteChannelIds ?? suggestedFavoriteChannelIds
  const favoriteChannelSet = useMemo(() => new Set(effectiveFavoriteChannelIds), [effectiveFavoriteChannelIds])
  const selectedChannelIds = useMemo(() => {
    if (channelFilter !== 'all') return [channelFilter]
    if (channelMode === 'favorites') return effectiveFavoriteChannelIds
    return []
  }, [channelFilter, channelMode, effectiveFavoriteChannelIds])
  const selectedChannelKey = selectedChannelIds.join(',')
  const favoriteChannels = useMemo(
    () => tvChannels.filter((channel) => favoriteChannelSet.has(channel.id)),
    [favoriteChannelSet, tvChannels],
  )
  const channelOptions = useMemo(() => {
    return tvChannels.length
      ? tvChannels
      : Array.from(
          new Map(
            tvItems.map((item) => [
              getProgrammeChannelId(item),
              {
                id: getProgrammeChannelId(item),
                name: item.show.network?.name ?? item.show.webChannel?.name ?? 'Ireland TV',
              },
            ]),
          ).values(),
        ).sort((a, b) => a.name.localeCompare(b.name))
  }, [tvChannels, tvItems])

  const filteredTvItems = useMemo(() => {
    const term = query.trim().toLowerCase()
    const isToday = selectedDate === formatIrelandDate(new Date())
    const currentTime = now.getTime()
    return tvItems.filter((item) => {
      const channelId = getProgrammeChannelId(item)
      const channel = item.show.network?.name ?? item.show.webChannel?.name ?? ''
      const matchesChannel = channelFilter === 'all' || channelId === channelFilter
      const matchesMode = channelFilter !== 'all' || channelMode === 'all' || favoriteChannelSet.has(channelId)
      const matchesTerm = !term || `${item.show.name} ${item.name} ${channel}`.toLowerCase().includes(term)
      const startTime = Date.parse(item.airstamp)
      const endTime = startTime + (item.runtime ?? 180) * 60 * 1000
      const matchesTime =
        listingTimeMode === 'full_day' || !isToday || endTime >= currentTime - 1000 * 60 * 5
      return matchesChannel && matchesMode && matchesTerm && matchesTime
    })
  }, [channelFilter, channelMode, favoriteChannelSet, listingTimeMode, now, query, selectedDate, tvItems])

  const visibleStreamingItems = useMemo(
    () => filterDiscoveryItems(filteredStreamingItems, discoveryQuery, discoveryGenreId),
    [discoveryGenreId, discoveryQuery, filteredStreamingItems],
  )
  const visibleCinemaItems = useMemo(
    () => filterDiscoveryItems(filteredCinemaItems, discoveryQuery, discoveryGenreId),
    [discoveryGenreId, discoveryQuery, filteredCinemaItems],
  )

  useEffect(() => {
    let ignore = false
    async function loadSchedule() {
      setTvLoading(true)
      setTvError('')
      try {
        const params = new URLSearchParams({ date: selectedDate })
        if (selectedChannelKey) params.set('channels', selectedChannelKey)
        const response = await fetch(`/api/media-guide/epg?${params.toString()}`)
        if (!response.ok) throw new Error('Could not load Irish TV schedule.')
        const data = (await response.json()) as { channels?: EpgChannel[]; schedule: TvMazeEpisode[] }
        if (!ignore) {
          setTvChannels(data.channels ?? [])
          setTvItems(data.schedule)
        }
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
  }, [selectedDate, selectedChannelKey])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000 * 60)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let ignore = false
    async function loadTmdb() {
      setTmdbLoading(true)
      try {
        const response = await fetch('/api/media-guide/tmdb', {
          cache: 'no-store',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ providers }),
        })
        if (!response.ok) throw new Error('Could not load TMDb data.')
        const data = (await response.json()) as {
          genreMap: Record<number, string>
          providers: Provider[]
          refreshedAt: string
          streaming: TmdbItem[]
          cinema: TmdbItem[]
        }

        if (!ignore) {
          setTmdbRefreshedAt(data.refreshedAt)
          setGenreMap(data.genreMap)
          if (providersChanged(providers, data.providers)) {
            setProviders(data.providers)
          }
          setStreaming(data.streaming.length ? data.streaming : fallbackStreaming)
          setCinema(data.cinema)
          if (tmdbRefreshNonce > 0) setToast('Sources refreshed')
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
  }, [providers, setProviders, tmdbRefreshNonce])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    return () => {
      if (refreshPulseTimer.current) clearTimeout(refreshPulseTimer.current)
    }
  }, [])

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

  useEffect(() => {
    let ignore = false
    async function loadRecommendations() {
      try {
        const response = await fetch('/api/media-guide/recommendations')
        if (!response.ok) throw new Error('Recommendations API unavailable.')
        const data = (await response.json()) as { lists: RecommendationList[]; items: RecommendationItem[] }
        if (!ignore) {
          setRecommendationLists(data.lists)
          setRecommendationItems(data.items)
          setSelectedListId((current) => current || data.lists[0]?.id || '')
        }
      } catch {
        if (!ignore) {
          setRecommendationLists([])
          setRecommendationItems([])
        }
      }
    }
    loadRecommendations()
    return () => {
      ignore = true
    }
  }, [])

  function toggleProvider(label: string) {
    setProviders((current) =>
      current.map((provider) =>
        provider.label === label ? { ...provider, enabled: !provider.enabled } : provider,
      ),
    )
  }

  function toggleFavoriteChannel(channelId: string) {
    setFavoriteChannelIds((current) => {
      const next = new Set(current ?? effectiveFavoriteChannelIds)
      if (next.has(channelId)) {
        next.delete(channelId)
      } else {
        next.add(channelId)
      }
      return Array.from(next)
    })
  }

  function resetFavoriteChannels() {
    setFavoriteChannelIds(null)
    setChannelMode('favorites')
    setChannelFilter('all')
  }

  function refreshSources() {
    setToast('Refreshing sources...')
    setRefreshPulse(true)
    if (refreshPulseTimer.current) clearTimeout(refreshPulseTimer.current)
    refreshPulseTimer.current = setTimeout(() => setRefreshPulse(false), 900)
    setTmdbRefreshNonce((current) => current + 1)
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

  async function addRecommendation(item: TmdbItem, status: RecommendationItem['status']) {
    const payload = {
      action: 'add-item',
      listId: status === 'recommend' ? selectedListId || null : null,
      item: {
        tmdbId: item.id,
        mediaType: item.name ? 'tv' : 'movie',
        status,
        title: item.title ?? item.name ?? 'Untitled',
        service: item.provider ?? 'Streaming',
        posterPath: item.poster_path,
        overview: item.overview,
      },
    }

    setToast(statusLabel(status, item.title ?? item.name ?? 'Title'))
    const response = await fetch('/api/media-guide/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) return
    const saved = (await response.json()) as RecommendationItem
    setRecommendationItems((current) => [saved, ...current])
    if (status === 'recommend') setTab('lists')
  }

  function toggleHiddenGenre(id: number) {
    setHiddenGenreIds((current) => (current.includes(id) ? current.filter((row) => row !== id) : [...current, id]))
    setToast(hiddenGenreIds.includes(id) ? 'Category restored' : 'Category hidden')
  }

  async function createRecommendationList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    if (!name) return

    const response = await fetch('/api/media-guide/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create-list', name }),
    })
    if (!response.ok) return
    const list = (await response.json()) as RecommendationList
    setRecommendationLists((current) => [list, ...current])
    setSelectedListId(list.id)
    event.currentTarget.reset()
  }

  async function removeRecommendationItem(id: string) {
    setRecommendationItems((current) => current.filter((item) => item.id !== id))
    await fetch('/api/media-guide/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-item', itemId: id }),
    })
  }

  async function removeRecommendationList(id: string) {
    setRecommendationLists((current) => current.filter((list) => list.id !== id))
    setRecommendationItems((current) => current.filter((item) => item.listId !== id))
    if (selectedListId === id) setSelectedListId('')
    await fetch('/api/media-guide/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete-list', listId: id }),
    })
  }

  async function copyShareLink(slug: string) {
    const url = `${window.location.origin}/media-guide/share/${slug}`
    await navigator.clipboard.writeText(url)
  }

  async function logout() {
    await fetch('/api/media-guide/logout', { method: 'POST' })
    window.location.href = '/media-guide/login'
  }

  return (
    <main className={themeMode === 'light' ? 'app-shell light-mode' : 'app-shell'}>
      {toast && <div className="toast">{toast}</div>}
      <header className="topbar">
        <div>
          <p className="eyebrow">Ireland only - {new Intl.DateTimeFormat('en-IE', { weekday: 'long' }).format(new Date())}</p>
          <h1>Media Guide</h1>
          <p className="hero-copy">Tonight's TV, streaming picks, cinema releases, and lists for people you recommend to.</p>
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
            <span>EPG listings</span>
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
        <div className="signal">
          <Users size={20} />
          <div>
            <strong>{recommendationLists.length}</strong>
            <span>lists</span>
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
        <TabButton
          active={tab === 'lists'}
          icon={<ListPlus size={18} />}
          label="Lists"
          onClick={() => setTab('lists')}
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
            <label className="field compact">
              <Filter size={17} />
              <select value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)}>
                <option value="all">
                  {channelMode === 'favorites' ? 'Favourite channels' : 'All channels'}
                </option>
                {channelOptions.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="segmented-actions time-scope" aria-label="Listing time range">
              <button
                className={listingTimeMode === 'from_now' ? 'active' : ''}
                type="button"
                onClick={() => setListingTimeMode('from_now')}
              >
                From now
              </button>
              <button
                className={listingTimeMode === 'full_day' ? 'active' : ''}
                type="button"
                onClick={() => setListingTimeMode('full_day')}
              >
                Full day
              </button>
            </div>
          </div>
          <section className="channel-panel" aria-label="Sky channel favourites">
            <div className="channel-panel-heading">
              <div>
                <p className="eyebrow">Sky channels</p>
                <h2>
                  {channelFilter === 'all'
                    ? 'Your channel list'
                    : channelOptions.find((channel) => channel.id === channelFilter)?.name ?? 'Selected channel'}
                </h2>
                <span>
                  {channelFilter === 'all'
                    ? `${favoriteChannels.length || effectiveFavoriteChannelIds.length} favourites from ${channelOptions.length || 'the'} channel roster`
                    : selectedDate === formatIrelandDate(new Date()) && listingTimeMode === 'from_now'
                      ? 'Showing from now for this channel'
                      : 'Showing the full day for this channel'}
                </span>
              </div>
              <div className="segmented-actions">
                <button
                  className={channelMode === 'favorites' && channelFilter === 'all' ? 'active' : ''}
                  type="button"
                  onClick={() => {
                    setChannelMode('favorites')
                    setChannelFilter('all')
                  }}
                >
                  Favourites
                </button>
                <button
                  className={channelMode === 'all' && channelFilter === 'all' ? 'active' : ''}
                  type="button"
                  onClick={() => {
                    setChannelMode('all')
                    setChannelFilter('all')
                  }}
                >
                  All
                </button>
              </div>
            </div>
            <div className="channel-chip-row">
              {(channelMode === 'favorites' ? favoriteChannels : channelOptions).slice(0, channelMode === 'favorites' ? 36 : 64).map((channel) => (
                <div className={favoriteChannelSet.has(channel.id) ? 'channel-chip favorite' : 'channel-chip'} key={channel.id}>
                  <button className="channel-open" type="button" onClick={() => setChannelFilter(channel.id)}>
                    <Star size={14} fill={favoriteChannelSet.has(channel.id) ? 'currentColor' : 'none'} />
                    <span>{channel.name}</span>
                  </button>
                  <button
                    aria-label={`${favoriteChannelSet.has(channel.id) ? 'Remove' : 'Add'} ${channel.name} ${favoriteChannelSet.has(channel.id) ? 'from' : 'to'} favourites`}
                    className="chip-star"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleFavoriteChannel(channel.id)
                    }}
                  >
                    {favoriteChannelSet.has(channel.id) ? 'On' : 'Add'}
                  </button>
                </div>
              ))}
              {channelMode === 'favorites' && favoriteChannels.length === 0 && (
                <p className="muted-copy">No favourite channels yet. Switch to All and star the channels you actually watch.</p>
              )}
            </div>
            <div className="channel-actions">
              {channelFilter !== 'all' && (
                <button type="button" onClick={() => setChannelFilter('all')}>
                  Back to {channelMode === 'favorites' ? 'favourites' : 'all channels'}
                </button>
              )}
              <button type="button" onClick={resetFavoriteChannels}>
                Reset starter Sky list
              </button>
            </div>
          </section>
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
                title={listingTimeMode === 'from_now' ? 'No more listings in this view' : 'No Irish EPG listings found today'}
                detail={
                  listingTimeMode === 'from_now'
                    ? 'Switch to Full day to see earlier programmes for the selected date.'
                    : 'The Sky Ireland XMLTV feed may not have programmes for this date yet.'
                }
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
              {tmdbRefreshedAt && <span className="refresh-note">Updated {formatTime(tmdbRefreshedAt)}</span>}
            </div>
            <button
              className={
                tmdbLoading || refreshPulse
                  ? 'icon-button quiet refresh-button refreshing'
                  : 'icon-button quiet refresh-button'
              }
              type="button"
              disabled={tmdbLoading}
              aria-label="Refresh streaming sources"
              onClick={refreshSources}
            >
              <RefreshCw className={tmdbLoading || refreshPulse ? 'spin' : ''} size={18} />
            </button>
          </div>
          <DiscoveryFilters
            discoveryGenreId={discoveryGenreId}
            discoveryQuery={discoveryQuery}
            genreOptions={genreOptions}
            onGenreChange={setDiscoveryGenreId}
            onQueryChange={setDiscoveryQuery}
          />
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
          <RecommendationTarget
            lists={recommendationLists}
            selectedListId={selectedListId}
            onChange={setSelectedListId}
          />
          <MediaGrid
            genreMap={genreMap}
            items={visibleStreamingItems}
            onAction={addRecommendation}
            onTrack={(item) => persistWatchingItem(mediaToWatchingItem(item))}
          />
          {!tmdbLoading && visibleStreamingItems.length === 0 && (
            <EmptyState
              title="No titles for the selected services"
              detail="Turn a provider back on, restore hidden categories, or tap refresh."
            />
          )}
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
          <DiscoveryFilters
            discoveryGenreId={discoveryGenreId}
            discoveryQuery={discoveryQuery}
            genreOptions={genreOptions}
            onGenreChange={setDiscoveryGenreId}
            onQueryChange={setDiscoveryQuery}
          />
          {cinema.length ? (
            <>
              <RecommendationTarget
                lists={recommendationLists}
                selectedListId={selectedListId}
                onChange={setSelectedListId}
              />
              <MediaGrid
                genreMap={genreMap}
                items={visibleCinemaItems}
                onAction={addRecommendation}
                onTrack={(item) => persistWatchingItem(mediaToWatchingItem(item))}
              />
            </>
          ) : (
            <EmptyState title="TMDb releases will load once TMDB_API_KEY is available on the server" />
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

      {tab === 'lists' && (
        <section className="view">
          <form className="add-form" onSubmit={createRecommendationList}>
            <input name="name" placeholder="List name, e.g. Films for Dad" required />
            <button className="primary-button" type="submit">
              <ListPlus size={18} />
              Create Share List
            </button>
          </form>

          <div className="status-rail">
            <StatusBucket
              icon={<Eye size={17} />}
              items={recommendationItems.filter((item) => item.status === 'seen')}
              label="Seen"
              onRemove={removeRecommendationItem}
            />
            <StatusBucket
              icon={<Heart size={17} />}
              items={recommendationItems.filter((item) => item.status === 'favorite')}
              label="Favorites"
              onRemove={removeRecommendationItem}
            />
            <StatusBucket
              icon={<ThumbsDown size={17} />}
              items={recommendationItems.filter((item) => item.status === 'not_interested')}
              label="Not for me"
              onRemove={removeRecommendationItem}
            />
          </div>

          <div className="recommendation-lists">
            {recommendationLists.map((list) => {
              const listItems = recommendationItems.filter((item) => item.listId === list.id)
              return (
                <article className="recommendation-list" key={list.id}>
                  <div className="list-heading">
                    <div>
                      <p className="eyebrow">Share list</p>
                      <h2>{list.name}</h2>
                      <span>{listItems.length} recommendations</span>
                    </div>
                    <div className="list-actions">
                      <button type="button" onClick={() => copyShareLink(list.shareSlug)}>
                        <Copy size={16} />
                        Copy Link
                      </button>
                      <button type="button" onClick={() => removeRecommendationList(list.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mini-list">
                    {listItems.map((item) => (
                      <div className="mini-item" key={item.id}>
                        <span>{item.title}</span>
                        <button type="button" onClick={() => removeRecommendationItem(item.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    {listItems.length === 0 && <p className="muted-copy">Choose this list on Streaming or Cinema, then tap Recommend.</p>}
                  </div>
                </article>
              )
            })}
            {recommendationLists.length === 0 && (
              <EmptyState title="Create a list for someone" detail="Then add titles from Streaming or Cinema and share the link." />
            )}
          </div>
        </section>
      )}

      {tab === 'settings' && (
        <section className="view">
          <div className="settings-panel">
            <div className="settings-roadmap">
              <p className="eyebrow">Display</p>
              <h2>Theme and listings</h2>
              <div className="settings-controls">
                <div>
                  <strong>Theme</strong>
                  <span>Use the dark performance look or a lighter daylight version.</span>
                </div>
                <div className="segmented-actions">
                  <button
                    className={themeMode === 'dark' ? 'active' : ''}
                    type="button"
                    onClick={() => setThemeMode('dark')}
                  >
                    <Settings size={14} />
                    Dark
                  </button>
                  <button
                    className={themeMode === 'light' ? 'active' : ''}
                    type="button"
                    onClick={() => setThemeMode('light')}
                  >
                    <Sun size={14} />
                    Light
                  </button>
                </div>
              </div>
              <div className="settings-controls">
                <div>
                  <strong>Today listings</strong>
                  <span>Keep Today focused on what is still to come, or show the whole day.</span>
                </div>
                <div className="segmented-actions">
                  <button
                    className={listingTimeMode === 'from_now' ? 'active' : ''}
                    type="button"
                    onClick={() => setListingTimeMode('from_now')}
                  >
                    From now
                  </button>
                  <button
                    className={listingTimeMode === 'full_day' ? 'active' : ''}
                    type="button"
                    onClick={() => setListingTimeMode('full_day')}
                  >
                    Full day
                  </button>
                </div>
              </div>
            </div>
            <h2>Data Sources</h2>
            <p>
              TV uses the Ireland XMLTV EPG feed. Streaming and cinema use TMDb with watch region IE through the protected server
              API.
            </p>
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
            <div className="settings-roadmap">
              <p className="eyebrow">Taste profile</p>
              <h2>Hide categories</h2>
              <div className="genre-preferences">
                {genreOptions.map((genre) => (
                  <button
                    className={hiddenGenreIds.includes(genre.id) ? 'genre-chip hidden' : 'genre-chip'}
                    key={genre.id}
                    type="button"
                    onClick={() => toggleHiddenGenre(genre.id)}
                  >
                    {genre.name}
                  </button>
                ))}
                {!genreOptions.length && <span>Categories appear after TMDb loads.</span>}
              </div>
            </div>
            <div className="settings-roadmap">
              <p className="eyebrow">What is still missing</p>
              <h2>Best next upgrades</h2>
              <div className="roadmap-grid">
                <span>Real Sky Ireland EPG feed</span>
                <span>Push reminders for next episodes</span>
                <span>Calendar view for releases</span>
                <span>Better taste profile from seen/favorites</span>
                <span>Per-person list notes and ratings</span>
                <span>Home screen install prompt</span>
              </div>
            </div>
            <button className="primary-button secondary-action" type="button" onClick={logout}>
              Sign Out
            </button>
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

function MediaGrid({
  genreMap,
  items,
  onAction,
  onTrack,
}: {
  genreMap: Record<number, string>
  items: TmdbItem[]
  onAction: (item: TmdbItem, status: RecommendationItem['status']) => void
  onTrack: (item: TmdbItem) => void
}) {
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
            {item.genre_ids && (
              <div className="media-genres">
                {item.genre_ids
                  .map((id) => genreMap[id])
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((genre) => (
                    <small key={genre}>{genre}</small>
                  ))}
              </div>
            )}
            <p>{item.overview || 'No summary available.'}</p>
          </div>
          <div className="media-actions">
            <button type="button" onClick={() => onTrack(item)}>
              <Plus size={16} />
              Track
            </button>
            <button type="button" onClick={() => onAction(item, 'seen')}>
              <Eye size={16} />
              Seen
            </button>
            <button type="button" onClick={() => onAction(item, 'favorite')}>
              <Heart size={16} />
              Fav
            </button>
            <button type="button" onClick={() => onAction(item, 'recommend')}>
              <Send size={16} />
              Recommend
            </button>
            <button type="button" onClick={() => onAction(item, 'not_interested')}>
              <ThumbsDown size={16} />
              Not for me
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function DiscoveryFilters({
  discoveryGenreId,
  discoveryQuery,
  genreOptions,
  onGenreChange,
  onQueryChange,
}: {
  discoveryGenreId: number
  discoveryQuery: string
  genreOptions: { id: number; name: string }[]
  onGenreChange: (id: number) => void
  onQueryChange: (query: string) => void
}) {
  return (
    <div className="discovery-filters">
      <label className="field search">
        <Search size={17} />
        <input value={discoveryQuery} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search titles" />
      </label>
      <label className="field compact">
        <Filter size={17} />
        <select value={discoveryGenreId} onChange={(event) => onGenreChange(Number(event.target.value))}>
          <option value={0}>All categories</option>
          {genreOptions.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function RecommendationTarget({
  lists,
  onChange,
  selectedListId,
}: {
  lists: RecommendationList[]
  onChange: (id: string) => void
  selectedListId: string
}) {
  if (!lists.length) {
    return <p className="notice">Create a share list in Lists to send recommendations to someone.</p>
  }

  return (
    <label className="field list-target">
      <Send size={17} />
      <select value={selectedListId} onChange={(event) => onChange(event.target.value)}>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            Recommend to {list.name}
          </option>
        ))}
      </select>
    </label>
  )
}

function StatusBucket({
  icon,
  items,
  label,
  onRemove,
}: {
  icon: ReactNode
  items: RecommendationItem[]
  label: string
  onRemove: (id: string) => void
}) {
  return (
    <article className="status-bucket">
      <div className="list-heading">
        <div>
          <p className="eyebrow">{label}</p>
          <h2>
            {icon}
            {items.length}
          </h2>
        </div>
      </div>
      <div className="mini-list">
        {items.slice(0, 6).map((item) => (
          <div className="mini-item" key={item.id}>
            <span>{item.title}</span>
            <button type="button" onClick={() => onRemove(item.id)}>
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {!items.length && <p className="muted-copy">Nothing here yet.</p>}
      </div>
    </article>
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

function isVisibleDiscoveryItem(item: TmdbItem, hiddenTmdbIds: Set<number>, hiddenGenres: Set<number>) {
  if (hiddenTmdbIds.has(item.id)) return false
  if (item.genre_ids?.some((id) => hiddenGenres.has(id))) return false
  return true
}

function filterDiscoveryItems(items: TmdbItem[], query: string, genreId: number) {
  const term = query.trim().toLowerCase()
  return items.filter((item) => {
    const title = item.title ?? item.name ?? ''
    const provider = item.provider ?? ''
    const matchesTerm = !term || `${title} ${provider} ${item.overview}`.toLowerCase().includes(term)
    const matchesGenre = !genreId || item.genre_ids?.includes(genreId)
    return matchesTerm && matchesGenre
  })
}

function getProgrammeChannelId(item: TvMazeEpisode) {
  return String(item.show.id)
}

function statusLabel(status: RecommendationItem['status'], title: string) {
  if (status === 'seen') return `${title} marked seen`
  if (status === 'favorite') return `${title} added to favorites`
  if (status === 'recommend') return `${title} added to recommendations`
  return `${title} hidden from discovery`
}

function formatTime(value: string) {
  if (!value) return 'TBC'
  return new Intl.DateTimeFormat('en-IE', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

function formatIrelandDate(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Dublin',
    year: 'numeric',
  }).formatToParts(date)
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${map.year}-${map.month}-${map.day}`
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('en-IE', { day: '2-digit', month: 'short' }).format(new Date(value))
}

export default App
