import Link from 'next/link';
import { HolidayHero, HolidayPageShell, HolidayPanel } from '@/components/holiday-agent/ui';
import { holidayThemes } from '@/components/holiday-agent/theme';

const entries = [
  {
    href: '/holiday-agent/planner',
    title: 'Holiday Planner',
    subtitle: 'Build and rank package holiday options',
    accent: 'from-emerald-100 via-white to-emerald-50',
    border: 'border-emerald-200/80',
  },
  {
    href: '/holiday-agent/concierge',
    title: 'Concierge Agent',
    subtitle: 'Chat with your travel assistant and queue consultations',
    accent: 'from-rose-100 via-white to-rose-50',
    border: 'border-rose-200/80',
  },
  {
    href: '/holiday-agent/admin',
    title: 'Admin Console',
    subtitle: 'View jobs, logs, retries, and operations overview',
    accent: 'from-slate-100 via-white to-slate-50',
    border: 'border-slate-200/80',
  },
];

export default function HolidayAgentHubPage() {
  const theme = holidayThemes.hub;

  return (
    <HolidayPageShell className="pt-10">
      <section className="container-custom">
        <HolidayHero>
          <p className={`holiday-kicker ${theme.heroKickerClass}`}>Holiday Hub</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Choose your travel command center</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-200">
            Planner for instant package discovery, Concierge for interview-driven recommendations, and Admin for operational control.
          </p>
        </HolidayHero>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {entries.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className={`group rounded-3xl border ${entry.border} bg-gradient-to-br ${entry.accent} p-6 shadow-[0_14px_40px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.18)]`}
            >
              <p className="holiday-kicker-soft text-slate-500">Open</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{entry.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{entry.subtitle}</p>
              <p className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${theme.primaryAccentClass} transition group-hover:translate-x-1`}>
                Go to {entry.title} <span>→</span>
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <HolidayPanel className="rounded-2xl border-emerald-200/80 bg-emerald-50/85 p-4 shadow-none">
            <p className="holiday-kicker-soft text-emerald-700">Planner edge</p>
            <p className="mt-1 text-sm text-slate-700">Detailed package scoring with sentiment and budget-aware ranking.</p>
          </HolidayPanel>
          <HolidayPanel className="rounded-2xl border-fuchsia-200/80 bg-fuchsia-50/80 p-4 shadow-none">
            <p className="holiday-kicker-soft text-fuchsia-700">Concierge edge</p>
            <p className="mt-1 text-sm text-slate-700">Human-style interview that remembers preferences and queues work.</p>
          </HolidayPanel>
          <HolidayPanel className="rounded-2xl border-sky-200/80 bg-sky-50/80 p-4 shadow-none">
            <p className="holiday-kicker-soft text-sky-700">Admin edge</p>
            <p className="mt-1 text-sm text-slate-700">Trace jobs, retry failures, and monitor service health in one place.</p>
          </HolidayPanel>
        </div>
      </section>
    </HolidayPageShell>
  );
}
