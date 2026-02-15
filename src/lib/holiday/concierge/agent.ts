import { HolidaySearchRequest } from '../types';

type PartialSpec = {
  likes?: string[];
  priorities?: string[];
  visitedDestinations?: string[];
  style?: HolidaySearchRequest['holidayStyle'];
  nights?: number;
  maxFlightHours?: number;
  weatherPreference?: HolidaySearchRequest['weatherPreference'];
  budgetEUR?: number;
  boardBasis?: HolidaySearchRequest['boardBasis'];
  directFlightPreferred?: boolean;
  departureDate?: string;
};

export type ConciergeSessionDraft = {
  spec: PartialSpec;
  asked: string[];
};

export type ConciergePrompt = {
  id: string;
  question: string;
};

export const conciergeFlow: ConciergePrompt[] = [
  {
    id: 'likes',
    question: 'Amazing, thanks for reaching out. What does a great family holiday look like for you: pool time, beach, culture, theme parks, adventure, or a mix?',
  },
  {
    id: 'visited',
    question: 'Where have you travelled before that you loved or disliked? This helps me avoid repeats and improve recommendations.',
  },
  {
    id: 'style',
    question: 'What holiday style should I prioritise first: beach, city, adventure, theme park, or mixed?',
  },
  {
    id: 'duration',
    question: 'How long do you want to travel for, roughly in nights?',
  },
  {
    id: 'flight',
    question: 'What is your comfortable max flight time from Dublin? Also, do you strongly prefer direct flights?',
  },
  {
    id: 'budget',
    question: 'What total package budget range should I target in EUR for the whole family?',
  },
  {
    id: 'timing',
    question: 'When are you thinking of travelling? A month or exact date is perfect.',
  },
  {
    id: 'board',
    question: 'For hotels, do you prefer self-catering, B&B, half-board, or all-inclusive?',
  },
];

export function buildDefaultDraft(): ConciergeSessionDraft {
  return { spec: {}, asked: [] };
}

function numbersFromText(text: string): number[] {
  const matches = text.match(/\d+(?:\.\d+)?/g);
  if (!matches) {
    return [];
  }
  return matches.map(Number).filter((n) => Number.isFinite(n));
}

function detectStyle(text: string): HolidaySearchRequest['holidayStyle'] | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('theme')) return 'theme-park';
  if (lower.includes('beach')) return 'beach';
  if (lower.includes('city')) return 'city';
  if (lower.includes('adventure')) return 'adventure';
  if (lower.includes('mixed') || lower.includes('mix')) return 'mixed';
  return undefined;
}

function detectBoard(text: string): HolidaySearchRequest['boardBasis'] | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('all')) return 'all-inclusive';
  if (lower.includes('half')) return 'half-board';
  if (lower.includes('b&b') || lower.includes('b and b') || lower.includes('breakfast')) return 'b-and-b';
  if (lower.includes('self')) return 'self-catering';
  return undefined;
}

function detectWeather(text: string): HolidaySearchRequest['weatherPreference'] | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('hot') || lower.includes('warm')) return 'hot';
  if (lower.includes('mild') || lower.includes('not too hot')) return 'mild';
  return undefined;
}

function detectDirectPreference(text: string): boolean | undefined {
  const lower = text.toLowerCase();
  if (/(direct only|direct flights|no stops|nonstop)/.test(lower)) return true;
  if (/(no problem with stops|stops are fine|connecting is fine)/.test(lower)) return false;
  return undefined;
}

export function updateDraftFromUserReply(draft: ConciergeSessionDraft, reply: string): ConciergeSessionDraft {
  const next = structuredClone(draft);
  const lower = reply.toLowerCase();
  const nums = numbersFromText(reply);

  const style = detectStyle(reply);
  const board = detectBoard(reply);
  const weather = detectWeather(reply);
  const direct = detectDirectPreference(reply);

  if (style) next.spec.style = style;
  if (board) next.spec.boardBasis = board;
  if (weather) next.spec.weatherPreference = weather;
  if (typeof direct === 'boolean') next.spec.directFlightPreferred = direct;

  if (nums.length) {
    const budgetCandidate = nums.find((n) => n >= 1000);
    if (budgetCandidate) {
      next.spec.budgetEUR = Math.round(budgetCandidate);
    }

    const hourCandidate = nums.find((n) => n >= 2 && n <= 16);
    if (hourCandidate) {
      next.spec.maxFlightHours = Number(hourCandidate);
    }

    const nightCandidate = nums.find((n) => n >= 3 && n <= 21);
    if (nightCandidate) {
      next.spec.nights = Math.round(nightCandidate);
    }
  }

  if (lower.includes('love') || lower.includes('like') || lower.includes('want')) {
    next.spec.likes = [reply.slice(0, 180)];
  }

  if (lower.includes('been') || lower.includes('visited') || lower.includes('before')) {
    next.spec.visitedDestinations = [reply.slice(0, 180)];
  }

  const monthMatch = reply.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  if (monthMatch) {
    const targetMonth = monthMatch[1].toLowerCase();
    const monthMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const today = new Date();
    const year = today.getFullYear() + (monthMap[targetMonth] < today.getMonth() ? 1 : 0);
    const date = new Date(year, monthMap[targetMonth], 10);
    next.spec.departureDate = date.toISOString().slice(0, 10);
  }

  return next;
}

export function getNextQuestion(draft: ConciergeSessionDraft): ConciergePrompt | null {
  const asked = new Set(draft.asked);
  const checks: Array<{ id: string; ready: boolean }> = [
    { id: 'likes', ready: Boolean(draft.spec.likes?.length) },
    { id: 'visited', ready: Boolean(draft.spec.visitedDestinations?.length) },
    { id: 'style', ready: Boolean(draft.spec.style) },
    { id: 'duration', ready: Boolean(draft.spec.nights) },
    { id: 'flight', ready: Boolean(draft.spec.maxFlightHours) },
    { id: 'budget', ready: Boolean(draft.spec.budgetEUR) },
    { id: 'timing', ready: Boolean(draft.spec.departureDate) },
    { id: 'board', ready: Boolean(draft.spec.boardBasis) },
  ];

  for (const item of checks) {
    if (!item.ready && !asked.has(item.id)) {
      return conciergeFlow.find((q) => q.id === item.id) || null;
    }
  }

  for (const item of checks) {
    if (!item.ready) {
      return conciergeFlow.find((q) => q.id === item.id) || null;
    }
  }

  return null;
}

export function buildSearchFromDraft(
  base: HolidaySearchRequest,
  draft: ConciergeSessionDraft
): HolidaySearchRequest {
  const departureDate = draft.spec.departureDate || base.departureDate;
  const nights = draft.spec.nights || 7;
  const returnDate = new Date(new Date(departureDate).getTime() + nights * 86400000)
    .toISOString()
    .slice(0, 10);

  return {
    ...base,
    departureDate,
    returnDate,
    budgetEUR: draft.spec.budgetEUR || base.budgetEUR,
    holidayStyle: draft.spec.style || base.holidayStyle,
    boardBasis: draft.spec.boardBasis || base.boardBasis,
    weatherPreference: draft.spec.weatherPreference || base.weatherPreference,
    maxFlightHours: draft.spec.maxFlightHours || base.maxFlightHours,
    directFlightPreferred: draft.spec.directFlightPreferred ?? base.directFlightPreferred,
  };
}

export function isDraftComplete(draft: ConciergeSessionDraft): boolean {
  return Boolean(
    draft.spec.style &&
    draft.spec.nights &&
    draft.spec.maxFlightHours &&
    draft.spec.budgetEUR &&
    draft.spec.departureDate &&
    draft.spec.boardBasis
  );
}

export function friendlyIntro(name?: string | null): string {
  const prefix = name ? `Hi ${name},` : 'Hi there,';
  return `${prefix} I am your holiday concierge. I will ask a few quick questions, then I will build a package shortlist for flights + hotels like a real travel agent.`;
}
