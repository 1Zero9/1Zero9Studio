'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { HolidayPackageResult, HolidaySearchRequest } from '@/lib/holiday/types';
import { holidaySuppliers } from '@/lib/holiday/providers';
import { HolidayHero, HolidayPageShell } from '@/components/holiday-agent/ui';
import { holidayThemes } from '@/components/holiday-agent/theme';

const today = new Date();
const inFourMonths = new Date(today.getTime() + 120 * 86400000);
const SAVED_SCENARIOS_KEY = 'holiday-agent-saved-scenarios-v1';

type SortMode = 'fit' | 'value' | 'sentiment' | 'price';

type SavedScenario = {
  id: string;
  createdAt: string;
  title: string;
  search: HolidaySearchRequest;
  topDestinations: string[];
  mode: string;
};

type FamilyPreset = 'custom' | 'your-family-3-2' | 'couple' | 'small-family' | 'large-family' | 'multi-gen';
type BuiltInFamilyPreset = Exclude<FamilyPreset, 'custom'>;

const departureAirports = [
  { code: 'DUB', label: 'Dublin (DUB)' },
  { code: 'ORK', label: 'Cork (ORK)' },
  { code: 'SNN', label: 'Shannon (SNN)' },
  { code: 'NOC', label: 'Knock (NOC)' },
  { code: 'BFS', label: 'Belfast Intl (BFS)' },
  { code: 'BHD', label: 'Belfast City (BHD)' },
  { code: 'LHR', label: 'London Heathrow (LHR)' },
  { code: 'LGW', label: 'London Gatwick (LGW)' },
  { code: 'MAN', label: 'Manchester (MAN)' },
  { code: 'EDI', label: 'Edinburgh (EDI)' },
];

const familyPresets: Record<BuiltInFamilyPreset, { adults: number; children: number; childAges: number[]; label: string }> = {
  'your-family-3-2': { adults: 3, children: 2, childAges: [14, 12], label: 'Your family (3 adults, 2 children)' },
  couple: { adults: 2, children: 0, childAges: [], label: 'Couple (2 adults)' },
  'small-family': { adults: 2, children: 1, childAges: [10], label: 'Small family (2 adults, 1 child)' },
  'large-family': { adults: 2, children: 3, childAges: [12, 9, 6], label: 'Large family (2 adults, 3 children)' },
  'multi-gen': { adults: 4, children: 2, childAges: [15, 11], label: 'Multi-gen (4 adults, 2 children)' },
};

const defaultSearch: HolidaySearchRequest = {
  origin: 'DUB',
  departureDate: toLocalDateInput(inFourMonths),
  returnDate: toLocalDateInput(new Date(inFourMonths.getTime() + 7 * 86400000)),
  budgetEUR: 4200,
  family: {
    adults: 3,
    children: 2,
    childAges: [14, 12],
  },
  holidayStyle: 'mixed',
  boardBasis: 'half-board',
  weatherPreference: 'hot',
  maxFlightHours: 6,
  directFlightPreferred: true,
  roomCount: 2,
  minHotelStars: 4,
  preferredSuppliers: ['loveholidays', 'clickandgo', 'tui', 'amadeus'],
  liveFlightsOnly: false,
  livePackagesOnly: false,
  costMode: 'budget-first',
};

type ApiResponse = {
  ok: boolean;
  meta?: {
    mode: string;
    providers: Record<string, string>;
    supplierStatus: Array<{
      id: string;
      name: string;
      mode: 'api' | 'affiliate' | 'agent';
      supportsSearchApi: boolean;
      website: string;
      note: string;
    }>;
    liveFilters: {
      requested: boolean;
      availableOptions: number;
    };
    livePackageFilters: {
      requested: boolean;
      availableOptions: number;
    };
    costMode: 'budget-first' | 'balanced';
  };
  agentBrief?: {
    headline: string;
    recommendation: string;
    strengths: string[];
    watchouts: string[];
    actionChecklist: string[];
  };
  recommendations?: HolidayPackageResult[];
  error?: string;
};

type HealthResponse = {
  ok: boolean;
  checkedAt?: string;
  amadeus?: {
    configured: boolean;
    authOk: boolean;
    flightSearchOk: boolean;
    hotelSearchOk: boolean;
    details: string[];
  };
  summary?: {
    healthy: boolean;
  };
  error?: string;
};

function sortResults(items: HolidayPackageResult[], mode: SortMode): HolidayPackageResult[] {
  const sorted = [...items];
  switch (mode) {
    case 'price':
      return sorted.sort((a, b) => a.totalEstimatedEUR - b.totalEstimatedEUR);
    case 'value':
      return sorted.sort((a, b) => b.valueScore - a.valueScore);
    case 'sentiment':
      return sorted.sort((a, b) => b.sentiment.score - a.sentiment.score);
    default:
      return sorted.sort((a, b) => b.fitScore - a.fitScore);
  }
}

function toLocalDateInput(date: Date): string {
  const timezoneOffsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1));
}

function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDurationDays(departureDate: string, returnDate: string): number {
  const start = parseDateOnly(departureDate);
  const end = parseDateOnly(returnDate);
  const days = Math.round((end.getTime() - start.getTime()) / 86400000);
  return Math.max(1, days);
}

function getReturnDateFromDuration(departureDate: string, durationDays: number): string {
  const safeDuration = Math.max(1, Math.floor(durationDays || 1));
  const start = parseDateOnly(departureDate);
  return formatDateOnly(new Date(start.getTime() + safeDuration * 86400000));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeChildAges(children: number, ages: number[]): number[] {
  const next = ages
    .filter((age) => Number.isFinite(age) && age >= 0 && age <= 17)
    .slice(0, children)
    .map((age) => Math.floor(age));

  while (next.length < children) {
    next.push(12);
  }

  return next;
}

function suggestedRoomCount(adults: number, children: number): number {
  const travellers = Math.max(1, adults + children);
  return clamp(Math.ceil(travellers / 3), 1, 6);
}

function detectFamilyPreset(adults: number, children: number, childAges: number[]): FamilyPreset {
  const builtInPresets = Object.entries(familyPresets) as Array<
    [BuiltInFamilyPreset, { adults: number; children: number; childAges: number[] }]
  >;

  for (const [presetKey, preset] of builtInPresets) {
    const sameAdults = preset.adults === adults;
    const sameChildren = preset.children === children;
    const sameAges = preset.childAges.join(',') === childAges.join(',');
    if (sameAdults && sameChildren && sameAges) {
      return presetKey;
    }
  }

  return 'custom';
}

export default function HolidayAgentPage() {
  const theme = holidayThemes.planner;
  const [search, setSearch] = useState<HolidaySearchRequest>(defaultSearch);
  const [familyPreset, setFamilyPreset] = useState<FamilyPreset>('your-family-3-2');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ApiResponse['meta']>();
  const [brief, setBrief] = useState<ApiResponse['agentBrief']>();
  const [results, setResults] = useState<HolidayPackageResult[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>('fit');
  const [withinBudgetOnly, setWithinBudgetOnly] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [healthLoading, setHealthLoading] = useState(false);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const resultsSectionRef = useRef<HTMLDivElement | null>(null);
  const minDepartureDate = useMemo(() => toLocalDateInput(new Date()), []);
  const minReturnDate = useMemo(
    () => getReturnDateFromDuration(search.departureDate, 1),
    [search.departureDate]
  );

  const tripNights = useMemo(
    () => getDurationDays(search.departureDate, search.returnDate),
    [search.departureDate, search.returnDate]
  );

  const selectedSupplierCount = search.preferredSuppliers?.length || 0;
  const familySummary = `${search.family.adults} adults, ${search.family.children} children`;
  const suggestedRoomsForParty = useMemo(
    () => suggestedRoomCount(search.family.adults, search.family.children),
    [search.family.adults, search.family.children]
  );

  const displayedResults = useMemo(() => {
    const filtered = withinBudgetOnly
      ? results.filter((item) => item.budgetStatus !== 'over')
      : results;
    return sortResults(filtered, sortMode);
  }, [results, sortMode, withinBudgetOnly]);

  const compareItems = useMemo(
    () => displayedResults.filter((item) => compareIds.includes(item.destination)),
    [compareIds, displayedResults]
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVED_SCENARIOS_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as SavedScenario[];
      if (Array.isArray(parsed)) {
        setSavedScenarios(parsed.slice(0, 8));
      }
    } catch {
      // ignore invalid localStorage payload
    }
  }, []);

  function persistScenarios(next: SavedScenario[]) {
    setSavedScenarios(next);
    window.localStorage.setItem(SAVED_SCENARIOS_KEY, JSON.stringify(next));
  }

  async function executeSearch(payload: HolidaySearchRequest) {
    const response = await fetch('/api/holiday/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as ApiResponse;
    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Search failed');
    }

    setMeta(data.meta);
    setBrief(data.agentBrief);
    setResults(data.recommendations || []);
    setCompareIds([]);
  }

  async function runSearch(event: FormEvent) {
    event.preventDefault();
    if (search.departureDate < minDepartureDate) {
      setError('Departure date cannot be in the past.');
      return;
    }
    if (search.returnDate < minReturnDate) {
      setError('Return date must be at least 1 day after departure.');
      return;
    }
    if (!selectedSupplierCount) {
      setError('Select at least one supplier before searching.');
      setResults([]);
      setBrief(undefined);
      return;
    }

    const safeAdults = clamp(Number(search.family.adults) || 1, 1, 6);
    const safeChildren = clamp(Number(search.family.children) || 0, 0, 6);
    const normalizedAges = normalizeChildAges(safeChildren, search.family.childAges || []);
    const normalizedPayload: HolidaySearchRequest = {
      ...search,
      roomCount: clamp(Number(search.roomCount) || suggestedRoomCount(safeAdults, safeChildren), 1, 6),
      family: {
        adults: safeAdults,
        children: safeChildren,
        childAges: normalizedAges,
      },
    };

    setSearch(normalizedPayload);
    setFamilyPreset(detectFamilyPreset(safeAdults, safeChildren, normalizedAges));
    setLoading(true);
    setError(null);

    try {
      await executeSearch(normalizedPayload);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Unexpected error');
      setResults([]);
      setBrief(undefined);
    } finally {
      setLoading(false);
    }
  }

  function toggleCompare(destination: string) {
    setCompareIds((current) => {
      if (current.includes(destination)) {
        return current.filter((id) => id !== destination);
      }
      if (current.length >= 3) {
        return current;
      }
      return [...current, destination];
    });
  }

  function saveCurrentScenario() {
    if (!results.length) {
      setError('Run a search first, then save the scenario.');
      return;
    }

    const entry: SavedScenario = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: `${search.holidayStyle} • budget EUR ${search.budgetEUR.toLocaleString()}`,
      search,
      topDestinations: results.slice(0, 3).map((item) => item.destination),
      mode: meta?.mode || 'unknown',
    };

    const next = [entry, ...savedScenarios].slice(0, 8);
    persistScenarios(next);
  }

  function loadScenario(entry: SavedScenario) {
    const safeAdults = clamp(Number(entry.search.family.adults) || 1, 1, 6);
    const safeChildren = clamp(Number(entry.search.family.children) || 0, 0, 6);
    const normalizedAges = normalizeChildAges(safeChildren, entry.search.family.childAges || []);
    setSearch({
      ...entry.search,
      roomCount: clamp(Number(entry.search.roomCount) || suggestedRoomCount(safeAdults, safeChildren), 1, 6),
      family: {
        adults: safeAdults,
        children: safeChildren,
        childAges: normalizedAges,
      },
    });
    setFamilyPreset(detectFamilyPreset(safeAdults, safeChildren, normalizedAges));
    setError(null);
  }

  function applyFamilyPreset(nextPreset: FamilyPreset) {
    if (nextPreset === 'custom') {
      setFamilyPreset('custom');
      return;
    }
    const preset = familyPresets[nextPreset];
    const nextRooms = suggestedRoomCount(preset.adults, preset.children);
    setFamilyPreset(nextPreset);
    setSearch((current) => ({
      ...current,
      roomCount: nextRooms,
      family: {
        adults: preset.adults,
        children: preset.children,
        childAges: normalizeChildAges(preset.children, [...preset.childAges]),
      },
    }));
  }

  function handleChildrenChange(value: string) {
    const nextChildren = clamp(Number(value) || 0, 0, 6);
    setSearch((current) => {
      const nextAges = normalizeChildAges(nextChildren, current.family.childAges || []);
      const nextRooms = suggestedRoomCount(current.family.adults, nextChildren);
      return {
        ...current,
        roomCount: nextRooms,
        family: {
          ...current.family,
          children: nextChildren,
          childAges: nextAges,
        },
      };
    });
    setFamilyPreset('custom');
  }

  function handleAdultsChange(value: string) {
    const nextAdults = clamp(Number(value) || 1, 1, 6);
    setSearch((current) => {
      const nextRooms = suggestedRoomCount(nextAdults, current.family.children);
      return {
        ...current,
        roomCount: nextRooms,
        family: {
          ...current.family,
          adults: nextAdults,
        },
      };
    });
    setFamilyPreset('custom');
  }

  function handleChildAgesChange(value: string) {
    const parsed = value
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((age) => Number.isFinite(age) && age >= 0 && age <= 17)
      .slice(0, search.family.children);

    setSearch((current) => ({
      ...current,
      family: {
        ...current.family,
        childAges: normalizeChildAges(current.family.children, parsed),
      },
    }));
    setFamilyPreset('custom');
  }

  async function copyAdvisorBrief() {
    if (!brief || !displayedResults.length) {
      setError('Run a search first to generate an advisor brief.');
      return;
    }

    const lines = [
      `Family Holiday Advisor Brief`,
      `Date: ${new Date().toISOString().slice(0, 10)}`,
      `Route: ${search.origin} to all destinations`,
      `Party: ${search.family.adults} adults, ${search.family.children} children (${search.family.childAges.join(', ')})`,
      '',
      brief.headline,
      brief.recommendation,
      '',
      'Top Options:',
      ...displayedResults.slice(0, 3).map((item, idx) => (
        `${idx + 1}. ${item.destination} - total EUR ${item.totalEstimatedEUR.toLocaleString()}, fit ${item.fitScore}/100, value ${item.valueScore}/100, sentiment ${item.sentiment.score}/5`
      )),
      '',
      'Strengths:',
      ...brief.strengths.map((line) => `- ${line}`),
      'Watchouts:',
      ...brief.watchouts.map((line) => `- ${line}`),
      'Action Checklist:',
      ...brief.actionChecklist.map((line) => `- ${line}`),
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
    } catch {
      setError('Unable to copy brief to clipboard in this browser.');
    }
  }

  async function runHealthCheck() {
    setHealthLoading(true);
    try {
      const response = await fetch('/api/holiday/health');
      const data = (await response.json()) as HealthResponse;
      setHealth(data);
    } catch (err) {
      setHealth({
        ok: false,
        error: err instanceof Error ? err.message : 'Health check failed',
      });
    } finally {
      setHealthLoading(false);
    }
  }

  function openBookingOption(searchUrl: string) {
    try {
      const parsed = new URL(searchUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Unsupported URL protocol');
      }
      const opened = window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
      if (!opened) {
        setError('Your browser blocked the booking tab. Please allow popups for this site.');
      }
    } catch {
      setError('This booking link looks invalid. Please try another supplier.');
    }
  }

  function handleDepartureDateChange(nextDepartureDate: string) {
    setSearch((current) => {
      if (!nextDepartureDate) {
        return { ...current, departureDate: nextDepartureDate };
      }
      const safeDeparture = nextDepartureDate < minDepartureDate ? minDepartureDate : nextDepartureDate;
      const minReturn = getReturnDateFromDuration(safeDeparture, 1);
      return {
        ...current,
        departureDate: safeDeparture,
        returnDate: current.returnDate < minReturn ? minReturn : current.returnDate,
      };
    });
  }

  function handleReturnDateChange(nextReturnDate: string) {
    setSearch((current) => {
      if (!nextReturnDate) {
        return { ...current, returnDate: nextReturnDate };
      }
      const minReturn = getReturnDateFromDuration(current.departureDate, 1);
      return {
        ...current,
        returnDate: nextReturnDate < minReturn ? minReturn : nextReturnDate,
      };
    });
  }

  function handleDurationChange(nextDurationDays: string) {
    const parsed = Number(nextDurationDays);
    const safeDuration = Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;
    setSearch((current) => ({
      ...current,
      returnDate: getReturnDateFromDuration(current.departureDate, safeDuration),
    }));
  }

  function jumpToResults() {
    resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <HolidayPageShell>
      <section className="container-custom mb-8">
        <HolidayHero className="p-6 transition duration-300 hover:-translate-y-0.5">
          <p className={`holiday-kicker ${theme.heroKickerClass}`}>Holiday Planner</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Family Holiday Agent</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200">
            Not just search. This works like a real family travel advisor for Dublin departures.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/20">
              <p className="holiday-kicker-soft text-emerald-100">Family-first memory</p>
              <p className="mt-1 text-sm text-slate-100">Keeps your household profile, ages, style, and past trips.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/20">
              <p className="holiday-kicker-soft text-emerald-100">Package focus</p>
              <p className="mt-1 text-sm text-slate-100">Ranks flight + hotel package options first, not single legs only.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/20">
              <p className="holiday-kicker-soft text-emerald-100">Live + fallback pricing</p>
              <p className="mt-1 text-sm text-slate-100">Uses live API prices when available and sensible estimates when not.</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/20">
              <p className="holiday-kicker-soft text-emerald-100">Sentiment score</p>
              <p className="mt-1 text-sm text-slate-100">Summarises destination reviews into a clear 1-5 family rating.</p>
            </div>
          </div>
        </HolidayHero>
      </section>

      <section className="container-custom">
        <form
          onSubmit={runSearch}
          className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(165deg,rgba(255,255,255,0.95)_0%,rgba(255,244,248,0.9)_45%,rgba(237,255,248,0.9)_100%)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition duration-300 hover:shadow-[0_28px_80px_rgba(16,185,129,0.22)] md:p-8"
        >
          <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="holiday-kicker text-rose-700">Travel Blueprint</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Build your next family escape</h2>
              <p className="mt-1 text-sm text-slate-600">Set the essentials first. Fine-tune optional preferences below.</p>
            </div>
            <p className="rounded-full border border-emerald-300/70 bg-emerald-100/80 px-4 py-1.5 text-sm font-semibold text-emerald-900">
              {familySummary}
            </p>
          </div>

          <div className="relative z-10 mt-7 grid gap-5 xl:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/75 p-4">
              <div className="grid gap-4 lg:grid-cols-12">
                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 lg:col-span-4">
                  <label className="text-sm">
                    <span className="holiday-field-label-strong">Departure Airport</span>
                    <select
                      value={search.origin}
                      onChange={(e) => setSearch({ ...search, origin: e.target.value })}
                      className="ha-control"
                    >
                      {departureAirports.map((airport) => (
                        <option key={airport.code} value={airport.code}>
                          {airport.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 lg:col-span-8">
                  <p className="holiday-field-label-strong mb-2">Travel Dates</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="text-sm">
                      <span className="holiday-field-label">Depart</span>
                      <input
                        type="date"
                        value={search.departureDate}
                        min={minDepartureDate}
                        onChange={(e) => handleDepartureDateChange(e.target.value)}
                        className="ha-control"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="holiday-field-label">Return</span>
                      <input
                        type="date"
                        value={search.returnDate}
                        min={minReturnDate}
                        onChange={(e) => handleReturnDateChange(e.target.value)}
                        className="ha-control"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="holiday-field-label">Days</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={tripNights}
                        onChange={(e) => handleDurationChange(e.target.value)}
                        className="ha-control"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 lg:col-span-6">
                  <label className="text-sm">
                    <span className="holiday-field-label-strong">Budget (EUR)</span>
                    <input
                      type="number"
                      min={600}
                      step={50}
                      value={search.budgetEUR}
                      onChange={(e) => setSearch({ ...search, budgetEUR: Number(e.target.value) })}
                      className="ha-control"
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 lg:col-span-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="holiday-field-label-strong">Holiday Style</span>
                      <select
                        value={search.holidayStyle}
                        onChange={(e) => setSearch({ ...search, holidayStyle: e.target.value as HolidaySearchRequest['holidayStyle'] })}
                        className="ha-control"
                      >
                        <option value="mixed">Mixed</option>
                        <option value="beach">Beach</option>
                        <option value="city">City</option>
                        <option value="adventure">Adventure</option>
                        <option value="theme-park">Theme park</option>
                      </select>
                    </label>
                    <label className="text-sm">
                      <span className="holiday-field-label-strong">Weather</span>
                      <select
                        value={search.weatherPreference}
                        onChange={(e) => setSearch({ ...search, weatherPreference: e.target.value as HolidaySearchRequest['weatherPreference'] })}
                        className="ha-control"
                      >
                        <option value="hot">Hot</option>
                        <option value="mild">Mild</option>
                        <option value="any">Any</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button type="submit" disabled={loading} className="ha-btn-primary rounded-2xl px-5 py-3.5 text-lg">
                  {loading ? 'Searching...' : 'Find family holidays'}
                </button>
                <button
                  type="button"
                  onClick={saveCurrentScenario}
                  className="ha-btn-secondary rounded-2xl border-rose-300/90 bg-white/75 px-5 py-3.5 text-base hover:bg-rose-50"
                >
                  Save Scenario
                </button>
                <Link
                  href="/holiday-agent/concierge"
                  className="ha-btn-secondary rounded-2xl border-emerald-300/90 bg-white/80 px-5 py-3.5 text-center text-base text-emerald-800 hover:bg-emerald-50"
                >
                  Talk to concierge agent
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-slate-300 bg-white/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                  Results found: {displayedResults.length}
                </span>
                <button
                  type="button"
                  onClick={jumpToResults}
                  disabled={displayedResults.length === 0}
                  className="rounded-full border border-rose-300/80 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Show results
                </button>
              </div>
            </div>

            <div className="holiday-panel border-rose-200/70 bg-gradient-to-br from-rose-50/80 via-white to-emerald-50/70 hover:shadow-[0_18px_44px_rgba(244,114,182,0.22)]">
              <div className="flex items-center justify-between gap-3">
                <p className="holiday-kicker text-rose-700">Optional Preferences</p>
                <p className="text-xs text-slate-600">Advanced filters and family setup</p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm">
                  <span className="holiday-field-label">Board Basis</span>
                  <select
                    value={search.boardBasis}
                    onChange={(e) => setSearch({ ...search, boardBasis: e.target.value as HolidaySearchRequest['boardBasis'] })}
                    className="ha-control"
                  >
                    <option value="self-catering">Self-catering</option>
                    <option value="b-and-b">B&B</option>
                    <option value="half-board">Half-board</option>
                    <option value="all-inclusive">All-inclusive</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="holiday-field-label">Min Hotel Stars</span>
                  <input
                    type="number"
                    min={3}
                    max={5}
                    value={search.minHotelStars}
                    onChange={(e) => setSearch({ ...search, minHotelStars: Number(e.target.value) })}
                    className="ha-control"
                  />
                </label>
                <label className="text-sm">
                  <span className="holiday-field-label">Max Flight Time (hours)</span>
                  <input
                    type="number"
                    min={2}
                    max={14}
                    step={0.5}
                    value={search.maxFlightHours}
                    onChange={(e) => setSearch({ ...search, maxFlightHours: Number(e.target.value) })}
                    className="ha-control"
                  />
                </label>
                <label className="text-sm">
                  <span className="holiday-field-label">Rooms</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={search.roomCount}
                    onChange={(e) => setSearch({ ...search, roomCount: clamp(Number(e.target.value) || 1, 1, 6) })}
                    className="ha-control"
                  />
                  <p className="mt-1 text-xs text-slate-500">Suggested for party size: {suggestedRoomsForParty}</p>
                </label>
              </div>

              <div className="mt-4 grid gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-slate-700">
                <label className="ha-check-row">
                  <input
                    type="checkbox"
                    className="ha-checkbox"
                    checked={search.directFlightPreferred}
                    onChange={(e) => setSearch({ ...search, directFlightPreferred: e.target.checked })}
                  />
                  Prefer direct flights
                </label>
                <label className="ha-check-row">
                  <input
                    type="checkbox"
                    className="ha-checkbox"
                    checked={search.liveFlightsOnly ?? false}
                    onChange={(e) => setSearch({ ...search, liveFlightsOnly: e.target.checked })}
                  />
                  Live flight prices only (hide estimated flight options)
                </label>
                <label className="ha-check-row">
                  <input
                    type="checkbox"
                    className="ha-checkbox"
                    checked={search.livePackagesOnly ?? false}
                    onChange={(e) => setSearch({ ...search, livePackagesOnly: e.target.checked })}
                  />
                  Live package only (flight + hotel both live-priced)
                </label>
                <label className="ha-check-row">
                  <input
                    type="checkbox"
                    className="ha-checkbox"
                    checked={(search.costMode || 'budget-first') === 'budget-first'}
                    onChange={(e) => setSearch({ ...search, costMode: e.target.checked ? 'budget-first' : 'balanced' })}
                  />
                  Budget API mode (avoid partner-gated paid APIs)
                </label>
              </div>

              <div className="mt-4 rounded-2xl border border-rose-200/80 bg-rose-50/70 p-4">
                <p className="holiday-kicker-soft text-slate-600">Preferred suppliers</p>
                <p className="mt-1 text-xs text-slate-500">Selected: {selectedSupplierCount}</p>
                <div className="mt-2 grid gap-2">
                  {holidaySuppliers.map((supplier) => {
                    const checked = search.preferredSuppliers?.includes(supplier.id) ?? false;
                    return (
                      <label key={supplier.id} className="flex items-center justify-between gap-3 text-sm text-slate-700">
                        <span>{supplier.name}</span>
                        <input
                          type="checkbox"
                          className="ha-checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const current = new Set(search.preferredSuppliers || []);
                            if (e.target.checked) {
                              current.add(supplier.id);
                            } else {
                              current.delete(supplier.id);
                            }
                            setSearch({ ...search, preferredSuppliers: Array.from(current) });
                          }}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid gap-4 rounded-2xl border border-rose-200/80 bg-white/80 p-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="holiday-field-label">Family Preset</span>
                  <select
                    value={familyPreset}
                    onChange={(e) => applyFamilyPreset(e.target.value as FamilyPreset)}
                    className="ha-control"
                  >
                    <option value="custom">Custom</option>
                    {(Object.keys(familyPresets) as BuiltInFamilyPreset[]).map((preset) => (
                      <option key={preset} value={preset}>
                        {familyPresets[preset].label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="holiday-field-label">Adults</span>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={search.family.adults}
                    onChange={(e) => handleAdultsChange(e.target.value)}
                    className="ha-control"
                  />
                </label>
                <label className="text-sm">
                  <span className="holiday-field-label">Children</span>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={search.family.children}
                    onChange={(e) => handleChildrenChange(e.target.value)}
                    className="ha-control"
                  />
                </label>
                <label className="text-sm">
                  <span className="holiday-field-label">Child Ages (comma separated)</span>
                  <input
                    value={search.family.childAges.join(', ')}
                    onChange={(e) => handleChildAgesChange(e.target.value)}
                    disabled={search.family.children === 0}
                    placeholder="14, 12"
                    className="ha-control"
                  />
                </label>
              </div>
            </div>
          </div>
        </form>

        <div ref={resultsSectionRef} className="mt-8 space-y-6">
          <div className="holiday-panel border-slate-200/80 hover:shadow-[0_18px_44px_rgba(16,185,129,0.2)]">
            <p className="holiday-kicker text-emerald-700">Live Search Diagnostics</p>
            <p className="text-sm text-slate-700">
              Trip length: <strong>{tripNights}</strong> nights from <strong>{search.origin}</strong>
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Advisor mode combines fit, value, sentiment, and live-pricing confidence.
            </p>
            {meta && (
              <div className="mt-3 grid gap-2 text-xs text-slate-700 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5">Mode: {meta.mode}</div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5">Flights: {meta.providers.flight}</div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-2.5">Hotels: {meta.providers.hotel}</div>
              </div>
            )}
            {meta?.supplierStatus?.length ? (
              <div className="mt-3 space-y-2">
                {meta.supplierStatus.map((supplier) => (
                  <div key={supplier.id} className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-2.5 text-xs text-slate-700">
                    <p>
                      {supplier.name}: {supplier.supportsSearchApi ? 'API' : 'Suggestion'} mode ({supplier.mode})
                    </p>
                    <p className="mt-1 text-slate-600">{supplier.note}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {meta?.liveFilters ? (
              <p className="mt-3 text-xs text-slate-600">
                Live filter: {meta.liveFilters.requested ? 'enabled' : 'off'} • Live-priced options: {meta.liveFilters.availableOptions}
              </p>
            ) : null}
            {meta?.livePackageFilters ? (
              <p className="mt-1 text-xs text-slate-600">
                Live package filter: {meta.livePackageFilters.requested ? 'enabled' : 'off'} • Live package options: {meta.livePackageFilters.availableOptions}
              </p>
            ) : null}
            {meta?.costMode ? (
              <p className="mt-1 text-xs text-slate-600">Cost mode: {meta.costMode}</p>
            ) : null}
            <div className="mt-3">
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={healthLoading}
                className="rounded-full border border-emerald-300/70 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-100 disabled:opacity-50"
              >
                {healthLoading ? 'Checking APIs...' : 'Run API health check'}
              </button>
              {health ? (
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700">
                  <p>
                    Amadeus health: {health.summary?.healthy ? 'healthy' : 'partial/unavailable'}
                    {health.checkedAt ? ` • ${new Date(health.checkedAt).toLocaleString()}` : ''}
                  </p>
                  {health.amadeus ? (
                    <p className="mt-1 text-slate-600">
                      configured={String(health.amadeus.configured)} auth={String(health.amadeus.authOk)} flight={String(health.amadeus.flightSearchOk)} hotel={String(health.amadeus.hotelSearchOk)}
                    </p>
                  ) : null}
                  {health.amadeus?.details?.length ? (
                    <p className="mt-1 text-slate-500">{health.amadeus.details.join(' | ')}</p>
                  ) : null}
                  {health.error ? <p className="mt-1 text-rose-700">{health.error}</p> : null}
                </div>
              ) : null}
            </div>
            {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}
          </div>

          {brief ? (
            <div className="holiday-panel border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-rose-50 hover:shadow-[0_18px_44px_rgba(16,185,129,0.24)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="holiday-kicker text-emerald-700">Travel Agent Brief</p>
                <button
                  type="button"
                  onClick={copyAdvisorBrief}
                  className="rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-100"
                >
                  Copy brief
                </button>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-emerald-900">{brief.headline}</h3>
              <p className="mt-2 text-sm text-slate-700">{brief.recommendation}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-600">Strengths</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                {brief.strengths.map((line, idx) => <li key={`s-${idx}`}>{line}</li>)}
              </ul>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-600">Watchouts</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                {brief.watchouts.map((line, idx) => <li key={`w-${idx}`}>{line}</li>)}
              </ul>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-600">Next steps</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-800">
                {brief.actionChecklist.map((line, idx) => <li key={`a-${idx}`}>{line}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="holiday-panel border-slate-200/80 hover:shadow-[0_18px_44px_rgba(99,102,241,0.15)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="holiday-kicker text-slate-700">Result Controls</p>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="ha-control w-full border-rose-300/80 bg-rose-50 sm:w-auto"
                >
                  <option value="fit">Sort: Fit</option>
                  <option value="value">Sort: Value</option>
                  <option value="sentiment">Sort: Sentiment</option>
                  <option value="price">Sort: Lowest Price</option>
                </select>
                <label className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
                  <input
                    type="checkbox"
                    className="ha-checkbox"
                    checked={withinBudgetOnly}
                    onChange={(e) => setWithinBudgetOnly(e.target.checked)}
                  />
                  Within budget only
                </label>
              </div>
            </div>
          </div>

          {savedScenarios.length ? (
            <div className="holiday-panel border-slate-200/80 hover:shadow-[0_18px_44px_rgba(244,114,182,0.22)]">
              <p className="holiday-kicker text-rose-700">Saved Scenarios</p>
              <div className="mt-3 space-y-2">
                {savedScenarios.map((entry) => (
                  <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/70 p-3.5 text-xs transition duration-300 hover:-translate-y-0.5 hover:bg-rose-100">
                    <div>
                      <p className="text-slate-800">{entry.title}</p>
                      <p className="text-slate-600">Top: {entry.topDestinations.join(', ')} • mode: {entry.mode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadScenario(entry)}
                      className="rounded-full border border-rose-300/80 bg-white px-3 py-1 text-slate-800 transition hover:-translate-y-0.5 hover:bg-rose-100"
                    >
                      Load criteria
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {compareItems.length ? (
            <div className="holiday-panel border-emerald-200 hover:shadow-[0_18px_44px_rgba(16,185,129,0.24)]">
              <p className="holiday-kicker text-emerald-700">Compare Shortlist ({compareItems.length}/3)</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {compareItems.map((item) => (
                  <div key={`compare-${item.destination}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs transition duration-300 hover:-translate-y-0.5 hover:bg-white">
                    <p className="text-sm font-semibold text-slate-900">{item.destination}</p>
                    <p className="mt-1">Total: EUR {item.totalEstimatedEUR.toLocaleString()}</p>
                    <p>Fit: {item.fitScore}/100 • Value: {item.valueScore}/100</p>
                    <p>Sentiment: {item.sentiment.score}/5 • Confidence: {item.confidence}</p>
                    <p>Transfer: {item.transferComplexity} • Jet lag: {item.jetLagImpact}</p>
                    <p>School fit: {item.schoolHolidayFit} • Crowds: {item.crowdLevel}</p>
                    <p>Package: {item.packageType} • Flight: {item.hasLiveFlightPricing ? 'live' : 'estimated'} • Hotel: {item.hasLiveHotelPricing ? 'live' : 'estimated'}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {displayedResults.length === 0 && !loading && (
            <div className="holiday-panel border-dashed border-slate-300 bg-white/85 p-12 text-center text-slate-600">
              Run a search to get ranked holiday options with sentiment summaries.
            </div>
          )}

          {displayedResults.map((item, index) => (
            <article
              key={`${item.destination}-${index}`}
              className="group rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-rose-50/35 to-emerald-50/35 p-6 text-slate-900 shadow-lg shadow-slate-200/70 transition duration-200 hover:border-rose-200/80 hover:shadow-xl hover:shadow-rose-200/35"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="holiday-kicker-soft text-emerald-700/70">#{index + 1} recommendation</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{item.destination}, {item.country}</h3>
                  <p className="mt-2 max-w-2xl text-sm text-slate-700">{item.reason}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-100 px-4 py-2 text-right transition duration-300 group-hover:bg-emerald-200/80">
                  <p className="text-xs text-emerald-800/80">Fit score</p>
                  <p className="text-xl font-bold text-emerald-700">{item.fitScore}/100</p>
                  <p className="mt-1 text-xs text-emerald-800/80">Value: {item.valueScore}/100</p>
                  <p className="mt-1 text-xs text-emerald-800/80">Confidence: {item.confidence}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">Budget: {item.budgetStatus}</span>
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">Transfer: {item.transferComplexity}</span>
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">Jet lag: {item.jetLagImpact}</span>
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">School timing: {item.schoolHolidayFit}</span>
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">Crowds: {item.crowdLevel}</span>
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">
                  Package: {item.packageType}
                </span>
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">
                  Flight price: {item.hasLiveFlightPricing ? 'live' : 'estimated'}
                </span>
                <span className="rounded-full border border-rose-300/80 bg-white/80 px-2 py-1 transition hover:bg-rose-100">
                  Hotel price: {item.hasLiveHotelPricing ? 'live' : 'estimated'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleCompare(item.destination)}
                  className="rounded-full border border-emerald-300/70 px-2 py-1 text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-300/15"
                >
                  {compareIds.includes(item.destination) ? 'Remove compare' : 'Compare'}
                </button>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-600">Flights</p>
                  <p className="mt-2 text-sm text-slate-800">{item.flight.airline}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.flight.direct ? 'Direct' : '1 stop likely'} • {item.flight.durationHours}h</p>
                  <p className="mt-2 text-lg font-semibold">EUR {item.flight.totalEUR.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-slate-500">Source: {item.flight.provider}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-600">Hotels</p>
                  <p className="mt-2 text-sm text-slate-800">{item.hotel.name}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.hotel.stars} stars • {item.hotel.boardBasis}</p>
                  <p className="mt-2 text-lg font-semibold">EUR {item.hotel.totalEUR.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-slate-500">Source: {item.hotel.provider}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-600">Sentiment</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-300">{item.sentiment.score}/5</p>
                  <p className="mt-1 text-xs text-slate-700">{item.sentiment.summary}</p>
                  <p className="mt-2 text-xs text-slate-600">Top positives: {item.sentiment.positives.join(', ')}</p>
                  <p className="mt-1 text-xs text-slate-500">Watchouts: {item.sentiment.negatives.join(', ')}</p>
                </div>
              </div>

              {item.packageDetails ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-600">At a glance</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {item.packageDetails.atGlance.map((line, detailIndex) => (
                      <p key={`${item.destination}-glance-${detailIndex}`} className="text-sm text-slate-800">
                        • {line}
                      </p>
                    ))}
                  </div>
                  {item.packageDetails.neighbourhoodSummary ? (
                    <p className="mt-3 text-xs text-slate-600">{item.packageDetails.neighbourhoodSummary}</p>
                  ) : null}
                </div>
              ) : null}

              {item.packageDetails?.sections?.length ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {item.packageDetails.sections.map((section) => (
                    <div key={`${item.destination}-${section.title}`} className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
                      <p className="text-base font-semibold text-slate-900">{section.title}</p>
                      <div className="mt-2 space-y-1">
                        {section.items.map((feature) => (
                          <p key={`${item.destination}-${section.title}-${feature}`} className="text-sm text-slate-700">
                            • {feature}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-slate-800">
                  {item.hasLivePackagePricing ? 'Live package total' : 'Estimated package total'}:
                  <span className="font-semibold"> EUR {item.totalEstimatedEUR.toLocaleString()}</span>
                </p>
                <p className="text-xs text-slate-600">
                  Per person: EUR {item.pricePerPersonEUR.toLocaleString()} • Review sources: {item.sentiment.sourceBreakdown.map((s) => s.source).join(', ')}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.bookingOptions.map((option) => (
                  <button
                    key={`${item.destination}-${option.supplierId}`}
                    type="button"
                    onClick={() => openBookingOption(option.searchUrl)}
                    className="rounded-full border border-emerald-300/60 bg-emerald-100 px-3 py-1 text-xs text-emerald-800 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-sm hover:shadow-emerald-300/40"
                  >
                    {option.supplierName} ({option.supportsSearchApi ? 'API' : 'suggest'})
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </HolidayPageShell>
  );
}
