'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const portfolioProjects = [
  {
    id: 101,
    title: 'Learning Through Motion',
    description: 'Education platform refreshed in five weeks with messaging, art direction, and a high-speed Next.js build.',
    category: 'Education',
    image: '/images/logos/learningthroughmotion.svg',
    tags: ['Next.js', 'CMS', 'Design System'],
    link: 'https://learningthroughmotion.vercel.app/',
    year: '2024',
  },
  {
    id: 102,
    title: '1Zero9 Studio',
    description: 'Our flagship experience showcasing the studio, builder workflow, and premium service stack.',
    category: 'Agency',
    image: '/images/logos/1zero9.svg',
    tags: ['Next.js', 'Motion', 'AI'],
    link: 'https://www.1zero9.com/',
    year: '2024',
  },
  {
    id: 103,
    title: 'River Valley Rangers',
    description: 'Match-day hub, fixtures, and content engine for a fast-growing football club community.',
    category: 'Sports',
    image: '/images/logos/rivervalley.svg',
    tags: ['Responsive', 'Content Ops'],
    link: 'https://rivervalleyrangers.ie/home',
    year: '2024',
  },
  {
    id: 104,
    title: 'Astra Intelligence',
    description: 'Launch program for Astra’s AI platform with marketing site, prompt builder, and lifecycle ops.',
    category: 'SaaS',
    image: '/images/logos/astra.svg',
    tags: ['Product UX', 'Next.js', 'AI'],
    link: 'https://astra.1zero9.com/',
    year: '2024',
  },
  {
    id: 105,
    title: 'Prompt Builder',
    description: 'Standalone experience for Astra users to craft and preview AI workflows in real time.',
    category: 'Tools',
    image: '/images/logos/prompt-builder.svg',
    tags: ['Product', 'AI UX'],
    link: 'https://astra.1zero9.com/prompt-builder',
    year: '2024',
  },
  {
    id: 106,
    title: 'Clenica Care',
    description: 'Healthcare microsite + onboarding funnel with a focus on trust signals and conversion.',
    category: 'Healthcare',
    image: '/images/logos/clenica.svg',
    tags: ['Marketing', 'SEO'],
    link: 'https://clenicacare.com/',
    year: '2024',
  },
]

const categories = ['All', ...Array.from(new Set(portfolioProjects.map((p) => p.category)))]

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const filteredProjects = selectedCategory === 'All' ? portfolioProjects : portfolioProjects.filter((p) => p.category === selectedCategory)

  return (
    <div className="bg-surface text-ink">
      <section className="hero-gradient mb-16 rounded-b-[50px] px-6 pt-36 pb-24 text-center text-white lg:px-12 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70 animate-fadeInUp">Our Work</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            Proof that design × engineering wins faster.
          </h1>
          <p className="mt-6 text-lg text-white/85 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            We ship measurable outcomes for founders, marketing leads, and product teams who need a studio that moves as fast as they do.
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </section>

      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition-all duration-250 ${
                  selectedCategory === category
                    ? 'border-[var(--nova-red)] bg-[var(--nova-red)]/10 text-[var(--nova-red)] shadow-lg shadow-[var(--nova-red)]/20'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-350 hover:-translate-y-2 hover:shadow-xl hover:border-[var(--nova-red)]/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--nova-red)]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100/50 p-3 group-hover:border-[var(--nova-red)]/30 transition-colors duration-300">
                    <Image src={project.image} alt={project.title} width={48} height={48} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium">{project.category}</p>
                    <p className="text-sm text-slate-500 font-medium">{project.year}</p>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-ink group-hover:text-[var(--nova-red)] transition-colors duration-300 relative z-10">{project.title}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed relative z-10">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2 relative z-10">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-medium">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && <span className="text-xs text-slate-500 font-medium">+{project.tags.length - 3}</span>}
                </div>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-500">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-custom">
          <div className="rounded-3xl border border-slate-200/80 bg-white px-8 py-16 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br from-[var(--nova-red)]/5 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--nova-red)] font-semibold">Next Up</p>
              <h2 className="mt-5 text-3xl font-bold text-ink max-w-2xl mx-auto">Ready to create your own case study?</h2>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                Let's discuss your goals, timelines, and success metrics. We'll come back with a plan made for your business.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link href="/contact" className="btn-primary btn-large">
                  Start a project
                </Link>
                <Link href="/services" className="rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-ink hover:border-ink hover:bg-slate-50 transition-all duration-250">
                  Explore services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
