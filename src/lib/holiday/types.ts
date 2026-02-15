export type HolidayStyle = 'beach' | 'city' | 'adventure' | 'theme-park' | 'mixed';
export type BoardBasis = 'self-catering' | 'b-and-b' | 'half-board' | 'all-inclusive';
export type WeatherPreference = 'hot' | 'mild' | 'any';
export type CostMode = 'budget-first' | 'balanced';

export interface FamilyProfile {
  adults: number;
  children: number;
  childAges: number[];
}

export interface HolidaySearchRequest {
  origin: string;
  departureDate: string;
  returnDate: string;
  budgetEUR: number;
  family: FamilyProfile;
  holidayStyle: HolidayStyle;
  boardBasis: BoardBasis;
  weatherPreference: WeatherPreference;
  maxFlightHours: number;
  directFlightPreferred: boolean;
  roomCount: number;
  minHotelStars: number;
  preferredSuppliers?: string[];
  liveFlightsOnly?: boolean;
  livePackagesOnly?: boolean;
  costMode?: CostMode;
}

export interface FlightOption {
  provider: string;
  airline: string;
  direct: boolean;
  durationHours: number;
  totalEUR: number;
}

export interface HotelOption {
  provider: string;
  name: string;
  stars: number;
  boardBasis: BoardBasis;
  totalEUR: number;
  hasLivePricing?: boolean;
  amenities?: string[];
  roomFeatures?: string[];
}

export interface SentimentInsight {
  score: number;
  summary: string;
  positives: string[];
  negatives: string[];
  sourceBreakdown: Array<{
    source: string;
    rating: number;
    reviewCount: number;
  }>;
}

export interface HolidayPackageResult {
  destination: string;
  country: string;
  reason: string;
  weatherTag: string;
  totalEstimatedEUR: number;
  flight: FlightOption;
  hotel: HotelOption;
  sentiment: SentimentInsight;
  fitScore: number;
  confidence: 'high' | 'medium' | 'low';
  budgetStatus: 'within' | 'near-limit' | 'over';
  pricePerPersonEUR: number;
  hasLiveFlightPricing: boolean;
  valueScore: number;
  transferComplexity: 'low' | 'medium' | 'high';
  jetLagImpact: 'low' | 'medium' | 'high';
  schoolHolidayFit: 'strong' | 'moderate' | 'weak';
  crowdLevel: 'low' | 'medium' | 'high';
  hasLiveHotelPricing: boolean;
  hasLivePackagePricing: boolean;
  packageType: 'live-dynamic-package' | 'estimated-package';
  bookingOptions: Array<{
    supplierId: string;
    supplierName: string;
    mode: 'api' | 'affiliate' | 'agent';
    supportsSearchApi: boolean;
    searchUrl: string;
  }>;
  packageDetails?: {
    atGlance: string[];
    sections: Array<{
      title: string;
      items: string[];
    }>;
    transferDistanceKm?: number;
    neighbourhoodSummary?: string;
  };
}
