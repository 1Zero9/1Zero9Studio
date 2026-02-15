import { SentimentInsight } from './types';

type SourceRating = {
  source: string;
  rating: number;
  reviewCount: number;
  positiveTags: string[];
  negativeTags: string[];
};

const reviewDataset: Record<string, SourceRating[]> = {
  Tenerife: [
    { source: 'Tripadvisor', rating: 4.5, reviewCount: 5600, positiveTags: ['great family beaches', 'good value'], negativeTags: ['busy in peak season'] },
    { source: 'Google Reviews', rating: 4.4, reviewCount: 11800, positiveTags: ['warm weather', 'lots of activities'], negativeTags: ['car hire queues'] },
    { source: 'Booking.com', rating: 4.2, reviewCount: 3900, positiveTags: ['resort pool quality', 'clean hotels'], negativeTags: ['mixed food quality'] },
  ],
  Lanzarote: [
    { source: 'Tripadvisor', rating: 4.4, reviewCount: 4300, positiveTags: ['safe for kids', 'relaxed pace'], negativeTags: ['windy days'] },
    { source: 'Google Reviews', rating: 4.3, reviewCount: 10200, positiveTags: ['volcanic scenery', 'easy transport'], negativeTags: ['limited nightlife'] },
    { source: 'Booking.com', rating: 4.2, reviewCount: 2800, positiveTags: ['quiet resorts', 'good half-board'], negativeTags: ['some dated hotels'] },
  ],
  Algarve: [
    { source: 'Tripadvisor', rating: 4.6, reviewCount: 8200, positiveTags: ['family resorts', 'clean beaches'], negativeTags: ['higher summer prices'] },
    { source: 'Google Reviews', rating: 4.5, reviewCount: 14700, positiveTags: ['friendly locals', 'excellent food'], negativeTags: ['airport transfer times'] },
    { source: 'Booking.com', rating: 4.3, reviewCount: 4500, positiveTags: ['strong hotel quality', 'good breakfast options'], negativeTags: ['parking challenges'] },
  ],
  Antalya: [
    { source: 'Tripadvisor', rating: 4.3, reviewCount: 4900, positiveTags: ['all-inclusive value', 'water parks'], negativeTags: ['very hot in August'] },
    { source: 'Google Reviews', rating: 4.2, reviewCount: 9400, positiveTags: ['large resort choice', 'good entertainment'], negativeTags: ['distance from old town'] },
    { source: 'Booking.com', rating: 4.1, reviewCount: 3300, positiveTags: ['strong service levels', 'family rooms'], negativeTags: ['crowded buffets'] },
  ],
  Barcelona: [
    { source: 'Tripadvisor', rating: 4.4, reviewCount: 10100, positiveTags: ['culture and food', 'great transport'], negativeTags: ['tourist crowds'] },
    { source: 'Google Reviews', rating: 4.5, reviewCount: 21500, positiveTags: ['city attractions', 'beach + city combo'], negativeTags: ['pickpocket risk in hotspots'] },
    { source: 'Booking.com', rating: 4.2, reviewCount: 6100, positiveTags: ['hotel variety', 'walkable center'], negativeTags: ['smaller family rooms'] },
  ],
  Orlando: [
    { source: 'Tripadvisor', rating: 4.5, reviewCount: 9200, positiveTags: ['theme park quality', 'family activities'], negativeTags: ['long queue times'] },
    { source: 'Google Reviews', rating: 4.4, reviewCount: 19800, positiveTags: ['entertainment options', 'service quality'], negativeTags: ['higher overall cost'] },
    { source: 'Booking.com', rating: 4.1, reviewCount: 5200, positiveTags: ['large family suites', 'resort facilities'], negativeTags: ['car dependency'] },
  ],
};

const fallback: SourceRating[] = [
  { source: 'Tripadvisor', rating: 4.1, reviewCount: 1200, positiveTags: ['good family options'], negativeTags: ['seasonal crowding'] },
  { source: 'Google Reviews', rating: 4.2, reviewCount: 3000, positiveTags: ['solid destination value'], negativeTags: ['mixed peak-season experience'] },
  { source: 'Booking.com', rating: 4.0, reviewCount: 900, positiveTags: ['reliable accommodation'], negativeTags: ['hotel quality varies'] },
];

export function summarizeDestinationSentiment(destination: string): SentimentInsight {
  const sources = reviewDataset[destination] ?? fallback;
  const totalReviews = sources.reduce((sum, item) => sum + item.reviewCount, 0);
  const weighted = sources.reduce((sum, item) => sum + item.rating * item.reviewCount, 0);
  const score = Number((weighted / totalReviews).toFixed(1));

  const positives = [...new Set(sources.flatMap((item) => item.positiveTags))].slice(0, 3);
  const negatives = [...new Set(sources.flatMap((item) => item.negativeTags))].slice(0, 3);

  let tone = 'Positive overall sentiment with consistently good family feedback.';
  if (score < 3.8) {
    tone = 'Mixed feedback. Suitable for value-focused planning with careful hotel selection.';
  } else if (score > 4.4) {
    tone = 'Very strong feedback across major review platforms.';
  }

  return {
    score,
    summary: tone,
    positives,
    negatives,
    sourceBreakdown: sources.map((item) => ({
      source: item.source,
      rating: item.rating,
      reviewCount: item.reviewCount,
    })),
  };
}
