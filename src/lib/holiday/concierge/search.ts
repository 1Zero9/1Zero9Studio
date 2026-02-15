import { HolidaySearchRequest } from '../types';
import { ConciergeSessionDraft, buildSearchFromDraft } from './agent';

type ProfileRecord = {
  preferences?: Record<string, unknown> | null;
  household?: Record<string, unknown> | null;
};

function asNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return fallback;
}

function asStringArray(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value;
  }
  return fallback;
}

function asNumberArray(value: unknown, fallback: number[]): number[] {
  if (Array.isArray(value)) {
    const nums = value.map((item) => Number(item)).filter((n) => Number.isFinite(n));
    if (nums.length) {
      return nums;
    }
  }
  return fallback;
}

export function baseSearchFromProfile(profile: ProfileRecord | null): HolidaySearchRequest {
  const household = profile?.household || {};
  const preferences = profile?.preferences || {};
  const departure = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  const ret = new Date(Date.now() + 97 * 86400000).toISOString().slice(0, 10);

  return {
    origin: typeof preferences.origin === 'string' ? preferences.origin : 'DUB',
    departureDate: departure,
    returnDate: ret,
    budgetEUR: asNumber(preferences.budgetEUR, 4200),
    family: {
      adults: asNumber(household.adults, 3),
      children: asNumber(household.children, 2),
      childAges: asNumberArray(household.childAges, [14, 12]),
    },
    holidayStyle: (typeof preferences.holidayStyle === 'string' ? preferences.holidayStyle : 'mixed') as HolidaySearchRequest['holidayStyle'],
    boardBasis: (typeof preferences.boardBasis === 'string' ? preferences.boardBasis : 'half-board') as HolidaySearchRequest['boardBasis'],
    weatherPreference: (typeof preferences.weatherPreference === 'string' ? preferences.weatherPreference : 'hot') as HolidaySearchRequest['weatherPreference'],
    maxFlightHours: asNumber(preferences.maxFlightHours, 6),
    directFlightPreferred: typeof preferences.directFlightPreferred === 'boolean' ? preferences.directFlightPreferred : true,
    roomCount: asNumber(preferences.roomCount, 2),
    minHotelStars: asNumber(preferences.minHotelStars, 4),
    preferredSuppliers: asStringArray(preferences.preferredSuppliers, ['amadeus', 'loveholidays', 'clickandgo', 'tui']),
    liveFlightsOnly: typeof preferences.liveFlightsOnly === 'boolean' ? preferences.liveFlightsOnly : true,
    livePackagesOnly: typeof preferences.livePackagesOnly === 'boolean' ? preferences.livePackagesOnly : true,
    costMode:
      preferences.costMode === 'balanced' || preferences.costMode === 'budget-first'
        ? preferences.costMode
        : 'budget-first',
  };
}

export function buildQueuedSearchPayload(profile: ProfileRecord | null, draft: ConciergeSessionDraft): HolidaySearchRequest {
  const base = baseSearchFromProfile(profile);
  return buildSearchFromDraft(base, draft);
}
