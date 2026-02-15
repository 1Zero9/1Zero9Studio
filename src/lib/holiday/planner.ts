import {
  FlightOption,
  HolidayPackageResult,
  HolidaySearchRequest,
  HotelOption,
} from './types';
import { summarizeDestinationSentiment } from './sentiment';
import { buildSupplierSearchLink, getSuppliersById } from './providers';
import { searchAmadeusBestFlight, searchAmadeusBestHotel } from './amadeus';

type DestinationProfile = {
  destination: string;
  country: string;
  airportCode: string;
  cityCode: string;
  weather: 'hot' | 'mild';
  style: Array<HolidaySearchRequest['holidayStyle']>;
  avgFlightHours: number;
  baseFlightPerPersonEUR: number;
  avgHotelNightEUR: number;
  defaultDirect: boolean;
};

type DetailTemplate = {
  atGlance: string[];
  sections: Array<{ title: string; items: string[] }>;
  baseTransferDistanceKm: number;
  neighbourhoodSummary: string;
};

const destinationProfiles: DestinationProfile[] = [
  {
    destination: 'Tenerife',
    country: 'Spain',
    airportCode: 'TFS',
    cityCode: 'TCI',
    weather: 'hot',
    style: ['beach', 'mixed'],
    avgFlightHours: 4.5,
    baseFlightPerPersonEUR: 220,
    avgHotelNightEUR: 185,
    defaultDirect: true,
  },
  {
    destination: 'Lanzarote',
    country: 'Spain',
    airportCode: 'ACE',
    cityCode: 'ACE',
    weather: 'hot',
    style: ['beach', 'adventure', 'mixed'],
    avgFlightHours: 4.2,
    baseFlightPerPersonEUR: 210,
    avgHotelNightEUR: 170,
    defaultDirect: true,
  },
  {
    destination: 'Algarve',
    country: 'Portugal',
    airportCode: 'FAO',
    cityCode: 'FAO',
    weather: 'hot',
    style: ['beach', 'mixed'],
    avgFlightHours: 2.8,
    baseFlightPerPersonEUR: 140,
    avgHotelNightEUR: 160,
    defaultDirect: true,
  },
  {
    destination: 'Antalya',
    country: 'Turkey',
    airportCode: 'AYT',
    cityCode: 'AYT',
    weather: 'hot',
    style: ['beach', 'mixed'],
    avgFlightHours: 5,
    baseFlightPerPersonEUR: 260,
    avgHotelNightEUR: 150,
    defaultDirect: false,
  },
  {
    destination: 'Barcelona',
    country: 'Spain',
    airportCode: 'BCN',
    cityCode: 'BCN',
    weather: 'mild',
    style: ['city', 'mixed'],
    avgFlightHours: 2.6,
    baseFlightPerPersonEUR: 120,
    avgHotelNightEUR: 210,
    defaultDirect: true,
  },
  {
    destination: 'Orlando',
    country: 'USA',
    airportCode: 'MCO',
    cityCode: 'ORL',
    weather: 'hot',
    style: ['theme-park', 'mixed'],
    avgFlightHours: 9.2,
    baseFlightPerPersonEUR: 650,
    avgHotelNightEUR: 280,
    defaultDirect: false,
  },
];

const detailTemplates: Record<string, DetailTemplate> = {
  Tenerife: {
    atGlance: ['Large family resort', 'Multiple pools', 'Kids club', 'Beach transfer'],
    sections: [
      { title: 'Amenities', items: ['24-hour reception', 'WiFi in public areas', 'Air conditioning', 'Luggage storage', 'Laundry service*'] },
      { title: 'Children', items: ['Kids club', 'Playground', 'Family rooms', 'Babysitting service*'] },
      { title: 'Activities', items: ['Mini golf', 'Table tennis', 'Beach volleyball', 'Evening shows'] },
      { title: 'Pool and wellness', items: ['Indoor pool', 'Outdoor pool', 'Gym', 'Spa and wellness centre*'] },
      { title: 'Food and drink', items: ['Restaurant', 'Pool bar', 'Snack bar', 'Room service*'] },
      { title: 'Room', items: ['Air conditioning', 'WiFi', 'Balcony', 'Interconnecting rooms (selected)'] },
    ],
    baseTransferDistanceKm: 18,
    neighbourhoodSummary: 'Resort zone with family restaurants and walkable promenade.',
  },
  Lanzarote: {
    atGlance: ['Short transfer routes', 'Family pools', 'Great weather reliability', 'Strong value'],
    sections: [
      { title: 'Amenities', items: ['24-hour reception', 'WiFi', 'Safe*', 'Parking', 'Medical support*'] },
      { title: 'Children', items: ['Kids pool', 'Play area', 'High chairs', 'Cot on request'] },
      { title: 'Activities', items: ['Tennis', 'Darts', 'Games room', 'Water activities nearby'] },
      { title: 'Pool and wellness', items: ['Outdoor swimming pool', 'Gym', 'Sauna*', 'Massage service*'] },
      { title: 'Food and drink', items: ['Buffet restaurant', 'Cafe', 'Bar', 'All-day snacks'] },
      { title: 'Room', items: ['Air conditioning', 'WiFi', 'Kitchenette (selected rooms)', 'Family suites'] },
    ],
    baseTransferDistanceKm: 14,
    neighbourhoodSummary: 'Calm resort areas with beaches and low-rise family hotels.',
  },
  Algarve: {
    atGlance: ['Quick flight from Dublin', 'Beach-focused stays', 'Great for mixed ages', 'Excellent value'],
    sections: [
      { title: 'Amenities', items: ['24-hour desk', 'Beach shuttle', 'Garden', 'Parking', 'Laundry*'] },
      { title: 'Children', items: ['Kids club', 'Children menu', 'Family pool zones', 'Babysitting*'] },
      { title: 'Activities', items: ['Mini golf', 'Bike rental*', 'Boat trips*', 'Beach sports'] },
      { title: 'Pool and wellness', items: ['Indoor pool', 'Outdoor pool', 'Spa treatments*', 'Fitness room'] },
      { title: 'Food and drink', items: ['Restaurant', 'Snack bar', 'Bar', 'Room service*'] },
      { title: 'Room', items: ['Air conditioning', 'WiFi', 'Balcony', 'Sea view options*'] },
    ],
    baseTransferDistanceKm: 42,
    neighbourhoodSummary: 'Family resorts near beaches with good choice of excursions.',
  },
  Antalya: {
    atGlance: ['Excellent all-inclusive scene', 'Large resort compounds', 'High activity variety', 'Great pool complexes'],
    sections: [
      { title: 'Amenities', items: ['24-hour reception', 'Airport shuttle*', 'Private beach access', 'Medical services*'] },
      { title: 'Children', items: ['Kids club', 'Water slides', 'Playground', 'Kids entertainment'] },
      { title: 'Activities', items: ['Tennis', 'Aerobics', 'Beach volleyball', 'Games room'] },
      { title: 'Pool and wellness', items: ['Indoor pool', 'Outdoor pools', 'Hammam*', 'Spa and wellness centre*'] },
      { title: 'Food and drink', items: ['Main buffet', 'A la carte restaurants*', 'Cafe', 'Bar'] },
      { title: 'Room', items: ['Air conditioning', 'WiFi', 'Family rooms', 'Pool view options'] },
    ],
    baseTransferDistanceKm: 65,
    neighbourhoodSummary: 'Large beach resorts with strong all-inclusive family services.',
  },
  Barcelona: {
    atGlance: ['City + beach mix', 'Short transfer options', 'Culture and attractions', 'Best for active families'],
    sections: [
      { title: 'Amenities', items: ['24-hour reception', 'WiFi', 'Luggage storage', 'Concierge desk'] },
      { title: 'Children', items: ['Family rooms', 'Kids menu', 'Cot on request', 'Board-game area'] },
      { title: 'Activities', items: ['City tours*', 'Beach access', 'Museums', 'Local markets'] },
      { title: 'Pool and wellness', items: ['Rooftop pool (selected)', 'Gym', 'Spa access*'] },
      { title: 'Food and drink', items: ['Restaurant', 'Cafe', 'Tapas bar', 'Breakfast options'] },
      { title: 'Room', items: ['Air conditioning', 'WiFi', 'City view options', 'Soundproofing'] },
    ],
    baseTransferDistanceKm: 22,
    neighbourhoodSummary: 'Urban base with quick transport to beach and attractions.',
  },
  Orlando: {
    atGlance: ['Theme park capital', 'Family suites', 'Transfer-heavy destination', 'Best for longer stays'],
    sections: [
      { title: 'Amenities', items: ['24-hour front desk', 'WiFi', 'Free parking', 'Theme park shuttle*'] },
      { title: 'Children', items: ['Kids splash areas', 'Arcade room', 'Family suites', 'Kids dining plan*'] },
      { title: 'Activities', items: ['Theme parks*', 'Mini golf', 'Pool games', 'Evening entertainment'] },
      { title: 'Pool and wellness', items: ['Outdoor pools', 'Lazy river (selected)', 'Gym', 'Spa services*'] },
      { title: 'Food and drink', items: ['Family restaurant', 'Pool bar', 'Cafe', 'Room service*'] },
      { title: 'Room', items: ['Air conditioning', 'WiFi', 'Suites with sofa beds', 'Kitchenette (selected)'] },
    ],
    baseTransferDistanceKm: 38,
    neighbourhoodSummary: 'Car-oriented destination with major attractions spread across zones.',
  },
};

function getTripNights(from: string, to: string): number {
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 7;
  }
  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
}

function boardMultiplier(board: HolidaySearchRequest['boardBasis']): number {
  switch (board) {
    case 'all-inclusive':
      return 1.35;
    case 'half-board':
      return 1.2;
    case 'b-and-b':
      return 1.1;
    default:
      return 1;
  }
}

async function createFlightOption(input: HolidaySearchRequest, profile: DestinationProfile): Promise<FlightOption> {
  const useLiveAmadeus =
    Boolean(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) &&
    (input.preferredSuppliers?.includes('amadeus') ?? true);

  if (useLiveAmadeus) {
    try {
      const liveQuote = await searchAmadeusBestFlight({
        request: input,
        destinationIata: profile.airportCode,
      });
      if (liveQuote) {
        return {
          provider: liveQuote.provider,
          airline: liveQuote.airline,
          direct: liveQuote.direct,
          durationHours: liveQuote.durationHours || profile.avgFlightHours,
          totalEUR: liveQuote.totalEUR,
        };
      }
    } catch {
      // Fallback handled below.
    }
  }

  const travellers = input.family.adults + input.family.children;
  const directPenalty = input.directFlightPreferred && !profile.defaultDirect ? 1.2 : 1;
  const totalEUR = Math.round(profile.baseFlightPerPersonEUR * travellers * directPenalty);

  return {
    provider: useLiveAmadeus ? 'Smart fare estimator (Amadeus fallback)' : 'Smart fare estimator',
    airline: profile.defaultDirect ? 'Aer Lingus / Ryanair mix' : 'Multi-carrier via EU hub',
    direct: profile.defaultDirect,
    durationHours: profile.avgFlightHours,
    totalEUR,
  };
}

async function createHotelOption(
  input: HolidaySearchRequest,
  profile: DestinationProfile,
  nights: number
): Promise<HotelOption> {
  const useLiveAmadeusHotel =
    Boolean(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) &&
    (input.preferredSuppliers?.includes('amadeus') ?? true);

  if (useLiveAmadeusHotel) {
    try {
      const liveHotel = await searchAmadeusBestHotel({
        request: input,
        destinationCityCode: profile.cityCode,
      });
      if (liveHotel) {
        return {
          provider: liveHotel.provider,
          name: liveHotel.hotelName,
          stars: Math.max(3, Math.min(5, input.minHotelStars)),
          boardBasis: input.boardBasis,
          totalEUR: liveHotel.totalEUR,
          hasLivePricing: true,
          amenities: liveHotel.amenities,
          roomFeatures: liveHotel.roomFeatures,
        };
      }
    } catch {
      // fallback below
    }
  }

  const multiplier = boardMultiplier(input.boardBasis);
  const starsPremium = 1 + Math.max(0, input.minHotelStars - 3) * 0.08;
  const totalEUR = Math.round(profile.avgHotelNightEUR * input.roomCount * nights * multiplier * starsPremium);

  return {
    provider: process.env.BOOKING_RAPIDAPI_KEY ? 'Booking provider (live/mixed)' : 'Smart hotel estimator',
    name: `${profile.destination} Family Resort`,
    stars: Math.max(3, Math.min(5, input.minHotelStars)),
    boardBasis: input.boardBasis,
    totalEUR,
    hasLivePricing: false,
  };
}

function computeFitScore(input: HolidaySearchRequest, profile: DestinationProfile, totalEUR: number): number {
  let score = 55;

  if (input.weatherPreference === 'any' || input.weatherPreference === profile.weather) {
    score += 10;
  }

  if (profile.style.includes(input.holidayStyle) || input.holidayStyle === 'mixed') {
    score += 12;
  }

  if (profile.avgFlightHours <= input.maxFlightHours) {
    score += 10;
  }

  if (!input.directFlightPreferred || profile.defaultDirect) {
    score += 6;
  }

  const budgetDelta = input.budgetEUR - totalEUR;
  if (budgetDelta >= 0) {
    score += Math.min(12, Math.floor(budgetDelta / 300));
  } else {
    score -= Math.min(20, Math.ceil(Math.abs(budgetDelta) / 250));
  }

  return Math.max(1, Math.min(100, score));
}

function destinationReason(profile: DestinationProfile, fitScore: number): string {
  if (fitScore >= 85) {
    return `Strong match for family travel from Dublin with good value and activity balance.`;
  }
  if (fitScore >= 70) {
    return `Good option with a solid mix of flight time, family amenities, and review sentiment.`;
  }
  return `Viable alternative, but check budget and travel-time tradeoffs before booking.`;
}

function confidenceFromSignals(hasLiveFlightPricing: boolean, sentimentScore: number, fitScore: number): 'high' | 'medium' | 'low' {
  if (hasLiveFlightPricing && sentimentScore >= 4.3 && fitScore >= 80) {
    return 'high';
  }
  if (fitScore >= 68 && sentimentScore >= 4.0) {
    return 'medium';
  }
  return 'low';
}

function budgetStatus(total: number, budget: number): 'within' | 'near-limit' | 'over' {
  if (total > budget) {
    return 'over';
  }
  if (total >= budget * 0.9) {
    return 'near-limit';
  }
  return 'within';
}

function transferComplexity(flight: FlightOption): 'low' | 'medium' | 'high' {
  if (flight.direct) {
    return 'low';
  }
  if (flight.durationHours <= 6.5) {
    return 'medium';
  }
  return 'high';
}

function jetLagImpact(hours: number): 'low' | 'medium' | 'high' {
  if (hours <= 4.5) {
    return 'low';
  }
  if (hours <= 8) {
    return 'medium';
  }
  return 'high';
}

function valueScore(total: number, budget: number, sentiment: number, fitScore: number): number {
  const budgetFactor = total <= budget ? 1 : Math.max(0.5, budget / total);
  const score = fitScore * 0.45 + sentiment * 15 * 0.35 + budgetFactor * 100 * 0.2;
  return Math.max(1, Math.min(100, Math.round(score)));
}

function timingSignals(departureDate: string): {
  schoolHolidayFit: 'strong' | 'moderate' | 'weak';
  crowdLevel: 'low' | 'medium' | 'high';
} {
  const month = new Date(departureDate).getMonth() + 1;

  if ([7, 8].includes(month)) {
    return { schoolHolidayFit: 'strong', crowdLevel: 'high' };
  }
  if ([6, 12, 4].includes(month)) {
    return { schoolHolidayFit: 'moderate', crowdLevel: 'medium' };
  }
  if ([1, 2, 11].includes(month)) {
    return { schoolHolidayFit: 'weak', crowdLevel: 'low' };
  }
  return { schoolHolidayFit: 'moderate', crowdLevel: 'medium' };
}

function buildPackageDetails(
  profile: DestinationProfile,
  input: HolidaySearchRequest,
  flight: FlightOption,
  hotel: HotelOption
): HolidayPackageResult['packageDetails'] {
  const template = detailTemplates[profile.destination];
  if (!template) {
    return undefined;
  }

  const boardLine =
    input.boardBasis === 'all-inclusive'
      ? 'Board basis: All-inclusive'
      : input.boardBasis === 'half-board'
      ? 'Board basis: Half-board'
      : input.boardBasis === 'b-and-b'
      ? 'Board basis: B&B'
      : 'Board basis: Self-catering';
  const roomLine = `Rooms planned: ${input.roomCount}`;
  const flightLine = `Flight time: ${flight.durationHours}h${flight.direct ? ' direct' : ' with likely stop'}`;
  const transferDistanceKm = Math.max(8, Math.round(template.baseTransferDistanceKm + (flight.direct ? 0 : 12)));
  const transferLine = `${profile.airportCode} transfer approx. ${transferDistanceKm}km`;

  const sectionMap = new Map<string, string[]>(
    template.sections.map((section) => [section.title, [...section.items]])
  );

  const normalizeLabel = (value: string) =>
    value
      .toLowerCase()
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const addToSection = (title: string, item: string) => {
    const existing = sectionMap.get(title);
    if (!existing) {
      sectionMap.set(title, [item]);
      return;
    }
    if (!existing.some((line) => normalizeLabel(line) === normalizeLabel(item))) {
      existing.push(item);
    }
  };

  (hotel.amenities || []).forEach((amenity) => {
    const key = normalizeLabel(amenity);
    if (/kids|child|playground|babysit/.test(key)) {
      addToSection('Children', amenity);
      return;
    }
    if (/pool|spa|wellness|gym|sauna|hammam|massage/.test(key)) {
      addToSection('Pool and wellness', amenity);
      return;
    }
    if (/restaurant|bar|cafe|breakfast|lunch|dinner|food|drink|room service/.test(key)) {
      addToSection('Food and drink', amenity);
      return;
    }
    if (/room|suite|balcony|kitchen|bed|air conditioning|wifi/.test(key)) {
      addToSection('Room', amenity);
      return;
    }
    if (/tennis|golf|games|volleyball|aerobics|activity|bike/.test(key)) {
      addToSection('Activities', amenity);
      return;
    }
    addToSection('Amenities', amenity);
  });

  (hotel.roomFeatures || []).forEach((feature) => addToSection('Room', feature));

  return {
    atGlance: [transferLine, ...template.atGlance, boardLine, roomLine, flightLine].slice(0, 10),
    sections: Array.from(sectionMap.entries()).map(([title, items]) => ({ title, items })),
    transferDistanceKm,
    neighbourhoodSummary: template.neighbourhoodSummary,
  };
}

export async function buildHolidayRecommendations(input: HolidaySearchRequest): Promise<HolidayPackageResult[]> {
  const nights = getTripNights(input.departureDate, input.returnDate);
  const selectedSuppliers = getSuppliersById(input.preferredSuppliers, input.costMode || 'budget-first');

  const results = await Promise.all(
    destinationProfiles.map(async (profile) => {
      const flight = await createFlightOption(input, profile);
      const hotel = await createHotelOption(input, profile, nights);
      const totalEstimatedEUR = flight.totalEUR + hotel.totalEUR;
      const fitScore = computeFitScore(input, profile, totalEstimatedEUR);
      const sentiment = summarizeDestinationSentiment(profile.destination);
      const hasLiveFlightPricing = flight.provider === 'Amadeus live';
      const hasLiveHotelPricing = Boolean(hotel.hasLivePricing);
      const hasLivePackagePricing = hasLiveFlightPricing && hasLiveHotelPricing;
      const travellerCount = input.family.adults + input.family.children;
      const pricePerPersonEUR = Math.round(totalEstimatedEUR / Math.max(1, travellerCount));
      const tripBudgetStatus = budgetStatus(totalEstimatedEUR, input.budgetEUR);
      const confidence = confidenceFromSignals(hasLiveFlightPricing, sentiment.score, fitScore);
      const routeTransferComplexity = transferComplexity(flight);
      const routeJetLagImpact = jetLagImpact(flight.durationHours);
      const optionValueScore = valueScore(totalEstimatedEUR, input.budgetEUR, sentiment.score, fitScore);
      const timing = timingSignals(input.departureDate);
      const packageType: 'live-dynamic-package' | 'estimated-package' =
        hasLivePackagePricing ? 'live-dynamic-package' : 'estimated-package';
      const packageDetails = buildPackageDetails(profile, input, flight, hotel);

      return {
        destination: profile.destination,
        country: profile.country,
        reason: destinationReason(profile, fitScore),
        weatherTag: profile.weather,
        totalEstimatedEUR,
        flight,
        hotel,
        sentiment,
        fitScore,
        confidence,
        budgetStatus: tripBudgetStatus,
        pricePerPersonEUR,
        hasLiveFlightPricing,
        valueScore: optionValueScore,
        transferComplexity: routeTransferComplexity,
        jetLagImpact: routeJetLagImpact,
        schoolHolidayFit: timing.schoolHolidayFit,
        crowdLevel: timing.crowdLevel,
        hasLiveHotelPricing,
        hasLivePackagePricing,
        packageType,
        packageDetails,
        bookingOptions: selectedSuppliers.map((supplier) => ({
          supplierId: supplier.id,
          supplierName: supplier.name,
          mode: supplier.kind,
          supportsSearchApi: supplier.supportsSearchApi,
          searchUrl: buildSupplierSearchLink(supplier.id, profile.destination),
        })),
      };
    })
  );

  return results
    .filter((item) => (input.livePackagesOnly ? item.hasLivePackagePricing : true))
    .filter((item) => (input.liveFlightsOnly ? item.hasLiveFlightPricing : true))
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 6);
}
