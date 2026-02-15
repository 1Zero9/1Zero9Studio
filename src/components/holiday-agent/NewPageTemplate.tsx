import { HolidayHero, HolidayPageShell, HolidayPanel } from './ui';
import { holidayThemes } from './theme';

export default function HolidayAgentNewPageTemplate() {
  const theme = holidayThemes.hub;

  return (
    <HolidayPageShell className="pt-10">
      <section className="container-custom space-y-6">
        <HolidayHero>
          <p className={`holiday-kicker ${theme.heroKickerClass}`}>New Holiday Page</p>
          <h1 className={`mt-2 text-4xl font-bold tracking-tight ${theme.heroTitleClass || 'text-white'}`}>
            Replace with your page title
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-200">
            Use this template for all future Holiday Agent pages to keep layout and style consistency.
          </p>
        </HolidayHero>

        <div className="grid gap-4 lg:grid-cols-2">
          <HolidayPanel>
            <p className={`holiday-kicker ${theme.primaryAccentClass}`}>Primary Section</p>
            <p className="mt-2 text-sm text-slate-700">Add your main controls/content here.</p>
          </HolidayPanel>
          <HolidayPanel>
            <p className={`holiday-kicker ${theme.secondaryAccentClass}`}>Secondary Section</p>
            <p className="mt-2 text-sm text-slate-700">Add supporting filters/details here.</p>
          </HolidayPanel>
        </div>
      </section>
    </HolidayPageShell>
  );
}
