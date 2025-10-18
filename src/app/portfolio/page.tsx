'use client'

import { useState } from 'react'
import Image from 'next/image'
import SubpageHeader from '@/components/SubpageHeader'

// Portfolio data - easily add new projects here
const portfolioProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Modern e-commerce solution with Stripe integration and real-time inventory",
    category: "E-Commerce",
    image: "/images/109-logo-circle-white2.png", // Placeholder - replace with actual project images
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    link: "#",
    year: "2024"
  },
  {
    id: 2,
    title: "Corporate Website",
    description: "Professional corporate website with headless CMS and SEO optimization",
    category: "Corporate",
    image: "/images/109-logo-circle-white2.png",
    tags: ["React", "CMS", "SEO", "Responsive"],
    link: "#",
    year: "2024"
  },
  {
    id: 3,
    title: "Creative Portfolio",
    description: "Minimal portfolio site with smooth animations and modern design",
    category: "Portfolio",
    image: "/images/109-logo-circle-white2.png",
    tags: ["Next.js", "Framer Motion", "Modern Design"],
    link: "#",
    year: "2024"
  },
  {
    id: 4,
    title: "SaaS Dashboard",
    description: "Analytics dashboard with real-time data visualization and reporting",
    category: "SaaS",
    image: "/images/109-logo-circle-white2.png",
    tags: ["React", "D3.js", "API Integration"],
    link: "#",
    year: "2023"
  },
  {
    id: 5,
    title: "Restaurant Booking",
    description: "Table reservation system with payment processing and email notifications",
    category: "Hospitality",
    image: "/images/109-logo-circle-white2.png",
    tags: ["Next.js", "PostgreSQL", "Payments"],
    link: "#",
    year: "2023"
  },
  {
    id: 6,
    title: "Fitness App",
    description: "Workout tracking application with social features and progress analytics",
    category: "Mobile",
    image: "/images/109-logo-circle-white2.png",
    tags: ["React Native", "Firebase", "Mobile"],
    link: "#",
    year: "2023"
  }
];

const categories = ["All", ...Array.from(new Set(portfolioProjects.map(p => p.category)))];

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const filteredProjects = selectedCategory === "All"
    ? portfolioProjects
    : portfolioProjects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-dark-bg text-text-light">
      {/* Header */}
      <SubpageHeader
        title="OUR"
        titleHighlight="PORTFOLIO"
        description="Explore our recent projects and see how we transform ideas into powerful digital experiences"
        icon="💼"
      />

      {/* Category Filter */}
      <section className="py-8 px-6 md:px-4 bg-dark-card border-b border-dark-lighter sticky top-20 z-40 backdrop-blur-sm bg-dark-card/95">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-rocket-red text-white shadow-lg scale-105'
                    : 'bg-dark-bg text-text-gray hover:text-text-light hover:bg-dark-lighter'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 px-6 md:px-4 bg-gradient-to-b from-dark-bg via-dark-bg/90 to-dark-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <a
                key={project.id}
                href={project.link}
                className="group relative bg-dark-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-dark-lighter block"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {/* Project Image */}
                <div className="relative aspect-video bg-gradient-to-br from-dark-bg to-dark-lighter overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={150}
                      height={150}
                      className="opacity-20 group-hover:opacity-30 transition-opacity"
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent transition-opacity duration-300 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-rocket-red font-bold text-sm">{project.category}</span>
                        <span className="text-text-gray text-sm">{project.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Play/View Button */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-light mb-2 group-hover:text-rocket-red transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-text-gray text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-dark-bg text-text-gray text-xs rounded-full border border-dark-lighter"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-3 py-1 text-text-gray text-xs">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-gray text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-4 bg-gradient-to-b from-dark-bg to-dark-card/50 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="text-text-light">READY TO CREATE</span>
            <br />
            <span className="text-rocket-red">SOMETHING AMAZING?</span>
          </h2>
          <p className="text-xl text-text-gray mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create a digital experience that stands out
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact"
              className="btn-primary btn-large glow-effect text-center"
            >
              Get in Touch
            </a>
            <a
              href="/builder"
              className="btn-secondary btn-large text-center"
            >
              Build Your Site
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
