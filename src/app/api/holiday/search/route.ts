import { NextRequest, NextResponse } from 'next/server';
import { buildHolidayRecommendations } from '@/lib/holiday/planner';
import { HolidaySearchRequest } from '@/lib/holiday/types';
import { getSuppliersById, holidaySuppliers } from '@/lib/holiday/providers';
import { buildAgentBrief } from '@/lib/holiday/advisor';

function sanitizePayload(payload: Partial<HolidaySearchRequest>): HolidaySearchRequest {
  return {
    origin: payload.origin || 'DUB',
    departureDate: payload.departureDate || new Date().toISOString().slice(0, 10),
    returnDate: payload.returnDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    budgetEUR: Math.max(600, Number(payload.budgetEUR) || 3500),
    family: {
      adults: Math.max(1, Number(payload.family?.adults) || 3),
      children: Math.max(0, Number(payload.family?.children) || 2),
      childAges: payload.family?.childAges?.length ? payload.family.childAges : [14, 12],
    },
    holidayStyle: payload.holidayStyle || 'mixed',
    boardBasis: payload.boardBasis || 'half-board',
    weatherPreference: payload.weatherPreference || 'hot',
    maxFlightHours: Math.max(2, Number(payload.maxFlightHours) || 6),
    directFlightPreferred: payload.directFlightPreferred ?? true,
    roomCount: Math.max(1, Number(payload.roomCount) || 2),
    minHotelStars: Math.max(3, Math.min(5, Number(payload.minHotelStars) || 4)),
    preferredSuppliers: payload.preferredSuppliers?.length ? payload.preferredSuppliers : ['loveholidays', 'clickandgo', 'tui', 'amadeus'],
    liveFlightsOnly: payload.liveFlightsOnly ?? false,
    livePackagesOnly: payload.livePackagesOnly ?? false,
    costMode: payload.costMode || 'budget-first',
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Partial<HolidaySearchRequest>;
    const input = sanitizePayload(payload);
    const recommendations = await buildHolidayRecommendations(input);
    const brief = buildAgentBrief(input, recommendations);
    const selectedSuppliers = getSuppliersById(input.preferredSuppliers, input.costMode || 'budget-first');
    const liveAmadeusEnabled =
      Boolean(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) &&
      (input.preferredSuppliers?.includes('amadeus') ?? true);
    const liveAmadeusUsed = recommendations.some((item) => item.flight.provider === 'Amadeus live');
    const liveHotelUsed = recommendations.some((item) => item.hasLiveHotelPricing);
    const livePackageUsed = recommendations.some((item) => item.hasLivePackagePricing);

    return NextResponse.json({
      ok: true,
      meta: {
        mode: livePackageUsed
          ? 'live-package'
          : liveAmadeusUsed
            ? 'live-amadeus'
          : process.env.AMADEUS_API_KEY || process.env.BOOKING_RAPIDAPI_KEY
            ? 'mixed-live'
            : 'estimate-only',
        providers: {
          flight: liveAmadeusEnabled
            ? liveAmadeusUsed
              ? 'Amadeus live data in use'
              : 'Amadeus configured (fallback used for some/all routes)'
            : 'Amadeus not configured/selected',
          hotel: liveHotelUsed
            ? 'Amadeus live hotel data in use'
            : process.env.BOOKING_RAPIDAPI_KEY
              ? 'Booking API enabled (estimator/hybrid fallback)'
              : 'Hotel live API not configured/available',
          reviews: 'Aggregated review intelligence model',
        },
        supplierStatus: selectedSuppliers.map((supplier) => ({
          id: supplier.id,
          name: supplier.name,
          mode: supplier.kind,
          supportsSearchApi: supplier.supportsSearchApi,
          website: supplier.website,
          note: supplier.note,
        })),
        allSuppliers: holidaySuppliers.length,
        liveFilters: {
          requested: input.liveFlightsOnly ?? false,
          availableOptions: recommendations.filter((item) => item.hasLiveFlightPricing).length,
        },
        livePackageFilters: {
          requested: input.livePackagesOnly ?? false,
          availableOptions: recommendations.filter((item) => item.hasLivePackagePricing).length,
        },
        costMode: input.costMode || 'budget-first',
      },
      agentBrief: brief,
      recommendations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Unable to process holiday search request.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
