import { HolidaySearchRequest } from './types';

interface AmadeusTokenResponse {
  access_token: string;
  expires_in: number;
}

interface AmadeusOffer {
  validatingAirlineCodes?: string[];
  itineraries: Array<{
    duration: string;
    segments: Array<{
      carrierCode: string;
      number: string;
      departure: { iataCode: string };
      arrival: { iataCode: string };
    }>;
  }>;
  price: {
    total: string;
    currency: string;
  };
}

interface AmadeusOffersResponse {
  data?: AmadeusOffer[];
}

interface AmadeusHotelsByCityResponse {
  data?: Array<{
    hotelId: string;
    name?: string;
  }>;
}

interface AmadeusHotelOfferResponse {
  data?: Array<{
    hotel: {
      hotelId?: string;
      name?: string;
      amenities?: string[];
      description?: {
        text?: string;
      };
    };
    offers?: Array<{
      price?: {
        total?: string;
      };
      room?: {
        description?: {
          text?: string;
        };
        typeEstimated?: {
          beds?: number;
          bedType?: string;
        };
      };
    }>;
  }>;
}

export interface LiveFlightQuote {
  airline: string;
  direct: boolean;
  durationHours: number;
  totalEUR: number;
  provider: string;
}

export interface LiveHotelQuote {
  hotelName: string;
  totalEUR: number;
  provider: string;
  amenities: string[];
  roomFeatures: string[];
}

export interface AmadeusHealthResult {
  configured: boolean;
  authOk: boolean;
  flightSearchOk: boolean;
  hotelSearchOk: boolean;
  details: string[];
}

const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
let accessTokenCache: { token: string; expiresAt: number } | null = null;

function parseIsoDurationHours(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) {
    return 0;
  }
  const hours = Number(match[1] || 0);
  const mins = Number(match[2] || 0);
  return Number((hours + mins / 60).toFixed(1));
}

async function getAccessToken(): Promise<string | null> {
  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;

  if (!key || !secret) {
    return null;
  }

  if (accessTokenCache && Date.now() < accessTokenCache.expiresAt) {
    return accessTokenCache.token;
  }

  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: key,
      client_secret: secret,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as AmadeusTokenResponse;
  if (!data.access_token) {
    return null;
  }

  const ttlMs = Math.max(30, data.expires_in - 60) * 1000;
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + ttlMs,
  };

  return data.access_token;
}

export async function checkAmadeusHealth(): Promise<AmadeusHealthResult> {
  const configured = Boolean(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET);
  const details: string[] = [];

  if (!configured) {
    details.push('Missing AMADEUS_API_KEY and/or AMADEUS_API_SECRET');
    return {
      configured: false,
      authOk: false,
      flightSearchOk: false,
      hotelSearchOk: false,
      details,
    };
  }

  const token = await getAccessToken();
  if (!token) {
    details.push('Failed to obtain OAuth token from Amadeus');
    return {
      configured: true,
      authOk: false,
      flightSearchOk: false,
      hotelSearchOk: false,
      details,
    };
  }
  details.push('OAuth token acquired');

  let flightSearchOk = false;
  let hotelSearchOk = false;

  try {
    const flight = await searchAmadeusBestFlight({
      request: {
        origin: 'DUB',
        departureDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
        returnDate: new Date(Date.now() + 52 * 86400000).toISOString().slice(0, 10),
        budgetEUR: 2000,
        family: { adults: 2, children: 0, childAges: [] },
        holidayStyle: 'city',
        boardBasis: 'b-and-b',
        weatherPreference: 'any',
        maxFlightHours: 8,
        directFlightPreferred: false,
        roomCount: 1,
        minHotelStars: 3,
        preferredSuppliers: ['amadeus'],
        liveFlightsOnly: false,
        livePackagesOnly: false,
        costMode: 'budget-first',
      },
      destinationIata: 'BCN',
    });
    flightSearchOk = Boolean(flight);
    details.push(flight ? 'Sample flight search returned data' : 'Sample flight search returned no offers');
  } catch {
    details.push('Sample flight search failed');
  }

  try {
    const hotel = await searchAmadeusBestHotel({
      request: {
        origin: 'DUB',
        departureDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
        returnDate: new Date(Date.now() + 52 * 86400000).toISOString().slice(0, 10),
        budgetEUR: 2000,
        family: { adults: 2, children: 0, childAges: [] },
        holidayStyle: 'city',
        boardBasis: 'b-and-b',
        weatherPreference: 'any',
        maxFlightHours: 8,
        directFlightPreferred: false,
        roomCount: 1,
        minHotelStars: 3,
        preferredSuppliers: ['amadeus'],
        liveFlightsOnly: false,
        livePackagesOnly: false,
        costMode: 'budget-first',
      },
      destinationCityCode: 'BCN',
    });
    hotelSearchOk = Boolean(hotel);
    details.push(hotel ? 'Sample hotel search returned data' : 'Sample hotel search returned no offers');
  } catch {
    details.push('Sample hotel search failed');
  }

  return {
    configured: true,
    authOk: true,
    flightSearchOk,
    hotelSearchOk,
    details,
  };
}

export async function searchAmadeusBestFlight(params: {
  request: HolidaySearchRequest;
  destinationIata: string;
}): Promise<LiveFlightQuote | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const travellers = params.request.family.adults + params.request.family.children;
  const children = Math.min(8, params.request.family.children);

  const query = new URLSearchParams({
    originLocationCode: params.request.origin,
    destinationLocationCode: params.destinationIata,
    departureDate: params.request.departureDate,
    returnDate: params.request.returnDate,
    adults: String(Math.max(1, params.request.family.adults)),
    max: '8',
    currencyCode: 'EUR',
  });

  if (children > 0) {
    query.set('children', String(children));
  }

  if (params.request.directFlightPreferred) {
    query.set('nonStop', 'true');
  }

  const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${query.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as AmadeusOffersResponse;
  const offers = data.data || [];
  if (!offers.length) {
    return null;
  }

  const sorted = [...offers].sort((a, b) => Number(a.price.total) - Number(b.price.total));
  const best = sorted[0];

  const firstItinerary = best.itineraries[0];
  const direct = firstItinerary ? firstItinerary.segments.length === 1 : false;
  const durationHours = firstItinerary ? parseIsoDurationHours(firstItinerary.duration) : 0;

  const airlineCode =
    best.validatingAirlineCodes?.[0] ||
    firstItinerary?.segments?.[0]?.carrierCode ||
    'N/A';

  return {
    airline: `${airlineCode} (Amadeus live)`,
    direct,
    durationHours,
    totalEUR: Math.round(Number(best.price.total) || travellers * 200),
    provider: 'Amadeus live',
  };
}

export async function searchAmadeusBestHotel(params: {
  request: HolidaySearchRequest;
  destinationCityCode: string;
}): Promise<LiveHotelQuote | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const hotelListResponse = await fetch(
    `${AMADEUS_BASE_URL}/v1/reference-data/locations/hotels/by-city?cityCode=${params.destinationCityCode}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );

  if (!hotelListResponse.ok) {
    return null;
  }

  const hotelListData = (await hotelListResponse.json()) as AmadeusHotelsByCityResponse;
  const hotelIds = (hotelListData.data || [])
    .map((item) => item.hotelId)
    .filter(Boolean)
    .slice(0, 8);

  if (!hotelIds.length) {
    return null;
  }

  const adults = Math.max(1, params.request.family.adults);
  const hotelQuery = new URLSearchParams({
    hotelIds: hotelIds.join(','),
    checkInDate: params.request.departureDate,
    checkOutDate: params.request.returnDate,
    adults: String(adults),
    roomQuantity: String(Math.max(1, params.request.roomCount)),
    currency: 'EUR',
    bestRateOnly: 'true',
  });

  const hotelOffersResponse = await fetch(
    `${AMADEUS_BASE_URL}/v3/shopping/hotel-offers?${hotelQuery.toString()}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    }
  );

  if (!hotelOffersResponse.ok) {
    return null;
  }

  const hotelOfferData = (await hotelOffersResponse.json()) as AmadeusHotelOfferResponse;
  const candidates = (hotelOfferData.data || [])
    .map((item) => {
      const firstOffer = item.offers?.[0];
      const total = Number(firstOffer?.price?.total || 0);
      const amenities = (item.hotel?.amenities || [])
        .map((value) => value.replace(/_/g, ' ').toLowerCase())
        .map((value) => value.charAt(0).toUpperCase() + value.slice(1));
      const roomFeatures = [
        firstOffer?.room?.description?.text,
        firstOffer?.room?.typeEstimated?.bedType
          ? `Bed type: ${firstOffer.room.typeEstimated.bedType}`
          : null,
      ].filter((value): value is string => Boolean(value));

      return {
        hotelName: item.hotel?.name || 'Amadeus Hotel',
        total,
        amenities,
        roomFeatures,
      };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => a.total - b.total);

  if (!candidates.length) {
    return null;
  }

  return {
    hotelName: candidates[0].hotelName,
    totalEUR: Math.round(candidates[0].total),
    provider: 'Amadeus live',
    amenities: candidates[0].amenities || [],
    roomFeatures: candidates[0].roomFeatures || [],
  };
}
