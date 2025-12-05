const stats = [
  { label: 'Launches Delivered', value: '55+' },
  { label: 'Avg Time-to-Ship', value: '4 wks' },
  { label: 'Platforms Managed', value: '22' },
  { label: 'Revenue Impact', value: '$30M+' },
]

const principles = [
  {
    title: 'Technology with taste',
    description: 'It’s not enough to ship—it has to feel brilliant. We chase details that make founders proud and customers stay.',
  },
  {
    title: 'One seamless team',
    description: 'Designers, engineers, and strategists share the same source-of-truth documents, rituals, and accountability.',
  },
  {
    title: 'Momentum over noise',
    description: 'We optimize for clarity and measurable progress—not vanity metrics or bloated process.',
  },
]

export default function About() {
  return (
    <div className="bg-surface text-ink">
      <section className="hero-gradient rounded-b-[50px] px-6 pt-36 pb-24 text-center text-white lg:px-12 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70 animate-fadeInUp">Our Studio</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            We're the studio you call when it has to launch right—on the first try.
          </h1>
          <p className="mt-6 text-lg text-white/85 sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            1Zero9 is a hybrid design-engineering team built to own the digital experience end-to-end. No handoffs. No drama. Just traction.
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </section>

      <section className="bg-white py-20">
        <div className="container-custom grid gap-8 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="text-center group">
              <p className="text-4xl font-bold text-ink group-hover:text-[var(--nova-red)] transition-colors duration-300">{stat.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.4em] text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--nova-red)] font-semibold">Our approach</p>
              <h2 className="mt-4 text-3xl font-bold text-ink">Strategy, design, and engineering in one conversation.</h2>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed">
                We combine product strategy, art direction, and high-performance engineering into a single, accountable squad. The result: shorter
                feedback loops, tighter releases, and a team that feels in-house without the headcount lift.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium">Lead Team</p>
              <div className="mt-6 space-y-4 text-slate-700 leading-relaxed">
                <p className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--nova-red)] mt-2 flex-shrink-0" />
                  <span><strong className="text-ink">Studio Director (Steph)</strong> — product + delivery</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--nova-red)] mt-2 flex-shrink-0" />
                  <span><strong className="text-ink">Creative Director (Nick)</strong> — brand + motion systems</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--nova-red)] mt-2 flex-shrink-0" />
                  <span><strong className="text-ink">Tech Lead (Nova)</strong> — architecture, ops, AI integrations</span>
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-10 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium">Operating Framework</p>
                <h3 className="mt-3 text-2xl font-bold text-ink">Sprint 0 → Launch → Expand</h3>
              </div>
              <ul className="space-y-5 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--nova-red)] mt-2 flex-shrink-0" />
                  <span><strong className="text-ink">Sprint 0:</strong> narrative, creative direction, architecture, and roadmap lock</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--nova-red)] mt-2 flex-shrink-0" />
                  <span><strong className="text-ink">Build:</strong> cross-functional sprints with design + engineering paired from day one</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--nova-red)] mt-2 flex-shrink-0" />
                  <span><strong className="text-ink">Expand:</strong> growth experiments, platform operations, and ongoing iteration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-custom grid gap-8 lg:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="card group">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium">Principle</p>
              <h3 className="mt-5 text-2xl font-bold text-ink">{principle.title}</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-custom rounded-3xl border border-slate-200/80 bg-white px-8 py-16 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-[var(--nova-red)]/5 to-transparent rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--nova-red)] font-semibold">Next up</p>
            <h2 className="mt-5 text-3xl font-bold text-ink max-w-2xl mx-auto">Tell us how you work, we'll build a team around it.</h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
              We can start with a focused vision sprint or plug into your existing roadmap. Either way, you'll meet the leads actually doing the
              work on call one.
            </p>
            <a href="/contact" className="mt-8 inline-flex items-center justify-center btn-primary btn-large">
              Meet the team
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
