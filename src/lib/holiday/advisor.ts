import { HolidayPackageResult, HolidaySearchRequest } from './types';

export interface AgentBrief {
  headline: string;
  recommendation: string;
  strengths: string[];
  watchouts: string[];
  actionChecklist: string[];
}

function formatEUR(amount: number): string {
  return `EUR ${amount.toLocaleString()}`;
}

export function buildAgentBrief(
  input: HolidaySearchRequest,
  recommendations: HolidayPackageResult[]
): AgentBrief {
  if (!recommendations.length) {
    return {
      headline: 'No options currently match your strict filters',
      recommendation:
        'Try increasing max flight hours, widening supplier selection, or disabling live-flights-only mode.',
      strengths: ['Your search constraints are clearly defined.'],
      watchouts: ['Current filter combination removed all available options.'],
      actionChecklist: [
        'Turn off Live flights only',
        'Increase flight duration limit by 1-2 hours',
        'Add at least one suggestion supplier',
      ],
    };
  }

  const top = recommendations[0];
  const overBudgetCount = recommendations.filter((item) => item.budgetStatus === 'over').length;
  const liveCount = recommendations.filter((item) => item.hasLiveFlightPricing).length;
  const livePackageCount = recommendations.filter((item) => item.hasLivePackagePricing).length;

  const headline = `Best-fit pick: ${top.destination} (${top.fitScore}/100 fit, sentiment ${top.sentiment.score}/5)`;
  const recommendation =
    top.budgetStatus === 'over'
      ? `${top.destination} is strongest for family fit, but currently above your ${formatEUR(input.budgetEUR)} budget. Consider shorter stay or lower board basis.`
      : `${top.destination} gives the best balance of family suitability, sentiment, and price for your current inputs.`;

  const strengths = [
    `Top option total estimate: ${formatEUR(top.totalEstimatedEUR)} (${formatEUR(top.pricePerPersonEUR)} per traveller).`,
    `Value score: ${top.valueScore}/100 with ${top.confidence} confidence.`,
    `${liveCount} of ${recommendations.length} options include live flight pricing.`,
    `${livePackageCount} options are fully live-priced packages (flight + hotel).`,
    `Family profile applied: ${input.family.adults} adults + ${input.family.children} children (ages ${input.family.childAges.join(', ')}).`,
  ];

  const watchouts = [
    overBudgetCount > 0
      ? `${overBudgetCount} options exceed budget; validate ancillary costs (bags/transfers) before booking.`
      : 'Most shortlisted options are currently within budget range.',
    top.sentiment.negatives[0]
      ? `Destination watchout: ${top.sentiment.negatives[0]}.`
      : 'Review quality appears stable across common sources.',
    input.directFlightPreferred && !top.flight.direct
      ? 'Top option may need at least one stop despite direct-flight preference.'
      : 'Flight constraints align with your direct/connection preference.',
    top.jetLagImpact !== 'low'
      ? `Travel fatigue risk for children is ${top.jetLagImpact}; plan recovery time on arrival day.`
      : 'Travel fatigue risk is low for this route duration.',
    top.crowdLevel === 'high'
      ? 'Peak-season crowd pressure expected; book flights/hotels early and pre-book activities.'
      : 'Crowd pressure is manageable for this travel window.',
  ];

  const actionChecklist = [
    `Shortlist top 2: ${recommendations.slice(0, 2).map((item) => item.destination).join(' and ')}.`,
    'Open at least 2 supplier links per shortlisted destination and compare baggage + transfer inclusions.',
    'Re-run with live-package-only enabled before final payment decision.',
  ];

  return {
    headline,
    recommendation,
    strengths,
    watchouts,
    actionChecklist,
  };
}
