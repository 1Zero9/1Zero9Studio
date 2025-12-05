'use client'

const serviceTiers = [
  {
    title: 'Launch Systems',
    description:
      'Fractional product and engineering team delivering a high-polish marketing site or conversion funnel in weeks, not months.',
    deliverables: ['Brand system + design direction', 'Next.js build with analytics', 'Marketing automation', 'Optimization sprint'],
    price: 'from $15k',
  },
  {
    title: 'Studio Partnership',
    description:
      'Ongoing product design, content, and engineering support packaged like an internal studio—perfect for founders and lean teams.',
    deliverables: ['Prioritized roadmap', 'Dedicated design/dev lead', 'Weekly releases', 'Performance + growth reporting'],
    price: 'from $4k/mo',
  },
  {
    title: 'Managed Platform',
    description:
      'We own your entire digital platform—including infrastructure, compliance, and lifecycle updates—so you can focus on the business.',
    deliverables: ['Ops playbook', 'Security + accessibility', '24/7 monitoring', 'Support desk + success enablement'],
    price: 'custom',
  },
]

const capabilityStack = [
  {
    category: 'Strategy',
    items: ['Digital positioning', 'Journey mapping', 'System architecture', 'Content playbooks'],
  },
  {
    category: 'Design',
    items: ['Brand + art direction', 'Design systems', 'Product UX', 'Motion + prototyping'],
  },
  {
    category: 'Engineering',
    items: ['Next.js + React', 'Headless CMS', 'Supabase / DB design', 'API + integration work'],
  },
]

export default function Services() {
  return (
    <div className="bg-surface text-ink">
      <section className="hero-gradient rounded-b-[50px] px-6 pt-36 pb-24 text-center text-white lg:px-12 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70 animate-fadeInUp">Service Models</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            Full-stack studio for ambitious launches.
          </h1>
          <p className="mt-6 text-lg text-white/85 sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            Every engagement blends strategy, design, code, and growth. Pick the operating model that fits your rhythm and we plug in as your
            product team.
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </section>

      <section className="bg-white py-20">
        <div className="container-custom grid gap-8 lg:grid-cols-3">
          {serviceTiers.map((tier, idx) => (
            <article
              key={tier.title}
              className="group rounded-3xl border border-slate-200/80 bg-white p-9 shadow-lg transition-all duration-350 hover:shadow-2xl hover:border-[var(--nova-red)]/30 hover:-translate-y-2 relative overflow-hidden"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--nova-red)]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium relative z-10">Model</p>
              <h3 className="mt-3 text-2xl font-bold text-ink relative z-10">{tier.title}</h3>
              <p className="mt-5 text-slate-600 leading-relaxed relative z-10">{tier.description}</p>
              <ul className="mt-7 space-y-3.5 text-sm text-slate-700 relative z-10">
                {tier.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="h-2 w-2 rounded-full bg-[var(--nova-red)] mt-1.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-slate-500 relative z-10">
                <span className="text-xs uppercase tracking-[0.4em] font-medium">Investment</span>
                <span className="text-2xl font-bold text-ink">{tier.price}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-custom">
          <div className="flex flex-col gap-10 rounded-3xl border border-slate-200/80 bg-white p-10 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--nova-red)] font-semibold">Capabilities</p>
              <h2 className="text-3xl font-bold text-ink">A modular stack to support the entire lifecycle.</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                From positioning through to release engineering, we run fluid engagements that let us handle the messy middle—so you can make
                sharper decisions, faster.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {capabilityStack.flatMap(({ items }) => items).map((capability) => (
                <span key={capability} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-600 font-medium hover:bg-slate-100 hover:border-slate-300 transition-colors">
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {capabilityStack.map((stack) => (
              <div key={stack.category} className="card">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium">{stack.category}</p>
                <ul className="mt-5 space-y-3 text-slate-700">
                  {stack.items.map((item) => (
                    <li key={item} className="text-sm flex items-start gap-2">
                      <span className="h-1 w-1 rounded-full bg-[var(--nova-red)] mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="rounded-3xl border border-slate-200/80 bg-white px-8 py-16 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-[var(--nova-red)]/5 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--nova-red)] font-semibold">Still evaluating?</p>
              <h2 className="mt-5 text-3xl font-bold text-ink max-w-2xl mx-auto">Let's map your launch plan together.</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 leading-relaxed">
                Book a 30-minute session and walk away with a recommended engagement model, draft budget envelope, and first sprint outline.
              </p>
              <a href="/contact" className="mt-8 inline-flex items-center justify-center btn-primary btn-large">
                Plan My Launch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
