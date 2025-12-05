'use client'

import Link from 'next/link'
import Image from 'next/image'
import ContactForm from '../components/ContactForm'

const differentiators = [
  {
    title: 'Lightning Fast',
    description: 'Performance-first builds, Core Web Vitals tuned, and codebases that scale with you.',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Quality Driven',
    description: 'Design systems, QA, and production rituals that make your launch feel inevitable.',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Client Focused',
    description: 'Work directly with the team building your product. Clean comms, zero handoffs.',
    icon: (
      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
]

const aiHighlights = [
  {
    title: 'Rapid Development',
    description:
      'AI-assisted coding accelerates how we ship complex flows. Weeks collapse into days without sacrificing quality.',
  },
  {
    title: 'Enhanced Creativity',
    description:
      'Systematic ideation, story-driven messaging, and brand territories generated faster with human direction on top.',
  },
  {
    title: 'Smarter Solutions',
    description:
      'Intelligent UX, automation, and personalization layered into every build so your site feels alive.',
  },
  {
    title: 'Future-Ready',
    description:
      'We stay ahead on tooling, ops, and AI privacy so your investment today is ready for what’s next.',
  },
]

const services = [
  {
    title: 'Web Development',
    description: 'Custom Next.js, CMS, and API builds tailored for launch velocity and long-term maintainability.',
  },
  {
    title: 'Product UI/UX',
    description: 'Experience design, prototyping, and research to translate messy ideas into clear journeys.',
  },
  {
    title: 'Brand & Content',
    description: 'Narratives, identity systems, and content ops that keep every touchpoint consistent.',
  },
  {
    title: 'Growth Foundations',
    description: 'SEO, CRM, analytics, and automation—from baseline instrumentation to experimentation frameworks.',
  },
  {
    title: 'Platform Ops',
    description: 'Secure hosting, observability, and runbooks so your platform scales confidently.',
  },
  {
    title: 'Ongoing Partnership',
    description: 'Fractional studio model with weekly releases, roadmap prioritization, and embedded leadership.',
  },
]

export default function Home() {
  return (
    <div className="bg-surface text-ink">
      <section className="hero-gradient mb-16 rounded-b-[50px] px-6 pt-36 pb-24 text-center text-white lg:px-12 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70 animate-fadeInUp">Design · Code · Launch</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            Launch your next chapter with 1Zero9 Studio.
          </h1>
          <p className="mt-6 text-lg text-white/85 sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            Strategy, design, and engineering under one roof—so you get a site that looks sharp, moves fast, and converts.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <Link href="/builder" className="btn-primary btn-large glow-effect text-base">
              Build Your Site
            </Link>
            <Link href="/portfolio" className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 text-base font-semibold text-white hover:from-cyan-300 hover:to-blue-400 transition-all duration-250 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-105">
              View Our Work
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </section>

      <section id="about" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--nova-red)]">Why founders call us</p>
            <h2 className="mt-4 text-4xl font-bold text-ink">Built like an embedded product team.</h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              We pair creative directors with senior engineers so every release balances aesthetics, performance, and business impact.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {differentiators.map((item, idx) => (
              <div key={item.title} className="card text-center group">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--nova-red)] to-red-600 text-white shadow-lg shadow-[var(--nova-red)]/30 group-hover:shadow-[var(--nova-red)]/50 transition-shadow duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-ink">{item.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--nova-red)]">Powered by AI</p>
            <h2 className="mt-4 text-4xl font-bold text-ink">Software that thinks ahead.</h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              Automation, personalization, and smart ops are baked into every engagement so your launch stays future-facing.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {aiHighlights.map((highlight) => (
              <div key={highlight.title} className="card text-left group">
                <div className="h-12 w-12 rounded-xl bg-[var(--nova-red)]/10 flex items-center justify-center mb-5 group-hover:bg-[var(--nova-red)]/20 transition-colors duration-300">
                  <div className="h-2 w-2 rounded-full bg-[var(--nova-red)] animate-pulse-subtle" />
                </div>
                <h3 className="text-xl font-bold text-ink">{highlight.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--nova-red)]">Services</p>
            <h2 className="mt-4 text-4xl font-bold text-ink">Everything you need from first draft to launch day.</h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">Pick a single sprint or plug us in as your fractional studio.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="card text-left group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--nova-red)]" />
                  <p className="text-xs uppercase tracking-[0.5em] text-slate-400 font-semibold">{service.title}</p>
                </div>
                <p className="text-slate-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section-padding bg-slate-50">
        <div className="container-custom">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
              <Image src="/images/109-logo-circle-white2.png" alt="1Zero9 Studio" width={48} height={48} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rocket-red">Let’s talk</p>
            <h2 className="mt-3 text-4xl font-bold text-ink">Tell us about the future you need to launch.</h2>
            <p className="mt-4 text-lg text-slate-600">
              Share some quick context and we’ll respond with a suggested engagement model, budget ranges, and a first sprint outline.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className="bg-slate-950 text-white">
        <div className="container-custom py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/images/109-logo-circle-white2.png" alt="1Zero9 Studio" width={48} height={48} />
                <p className="text-lg font-semibold tracking-[0.4em] uppercase">1Zero9 Studio</p>
              </div>
              <p className="text-white/70">
                Launching digital experiences that move as fast as ambitious teams. Strategy, design, and engineering in one tight loop.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-[0.4em] uppercase text-white/70">Navigate</h4>
              <ul className="mt-4 space-y-2 text-white/80">
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/portfolio">Portfolio</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-[0.4em] uppercase text-white/70">Contact</h4>
              <p className="mt-4 text-white/80">hello@1zero9studio.com</p>
              <p className="text-white/80">+1 (234) 567-8900</p>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-white/60 text-sm">
            &copy; {new Date().getFullYear()} 1Zero9 Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
