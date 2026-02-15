export type HolidayPageTheme = {
  id: 'planner' | 'concierge' | 'hub' | 'admin';
  heroKickerClass: string;
  heroTitleClass?: string;
  primaryAccentClass: string;
  secondaryAccentClass: string;
};

export const holidayThemes: Record<HolidayPageTheme['id'], HolidayPageTheme> = {
  planner: {
    id: 'planner',
    heroKickerClass: 'text-emerald-200',
    heroTitleClass: 'text-white',
    primaryAccentClass: 'text-emerald-700',
    secondaryAccentClass: 'text-rose-700',
  },
  concierge: {
    id: 'concierge',
    heroKickerClass: 'text-emerald-200',
    heroTitleClass: 'text-white',
    primaryAccentClass: 'text-emerald-700',
    secondaryAccentClass: 'text-fuchsia-700',
  },
  hub: {
    id: 'hub',
    heroKickerClass: 'text-emerald-200',
    heroTitleClass: 'text-white',
    primaryAccentClass: 'text-emerald-700',
    secondaryAccentClass: 'text-sky-700',
  },
  admin: {
    id: 'admin',
    heroKickerClass: 'text-amber-200',
    heroTitleClass: 'text-white',
    primaryAccentClass: 'text-amber-700',
    secondaryAccentClass: 'text-rose-700',
  },
};
