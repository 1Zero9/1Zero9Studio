// Portfolio data - easily add new projects here
const portfolioProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution built with Next.js and Stripe integration",
    image: "/api/placeholder/400/300",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    link: "#"
  },
  {
    id: 2,
    title: "Corporate Website",
    description: "Professional corporate website with CMS integration",
    image: "/api/placeholder/400/300",
    tags: ["React", "CMS", "SEO", "Responsive"],
    link: "#"
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "Clean and minimal portfolio site for a creative agency",
    image: "/api/placeholder/400/300",
    tags: ["Next.js", "Animation", "Modern Design"],
    link: "#"
  }
];

export default function Portfolio() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore some of our recent projects and see how we help businesses succeed online
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  className="inline-block bg-[#E72F2F] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#d02626] transition-colors"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 p-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to start your project?
          </h2>
          <p className="text-gray-600 mb-6">
            Let's discuss your requirements and create something amazing together.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#E72F2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d02626] transition-colors"
          >
            Start Your Project
          </a>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            💡 Adding New Portfolio Projects
          </h3>
          <p className="text-gray-600">
            To add new projects, simply edit the <code className="bg-white px-2 py-1 rounded text-sm">portfolioProjects</code> array 
            at the top of <code className="bg-white px-2 py-1 rounded text-sm">src/app/portfolio/page.tsx</code>. 
            Each project needs: title, description, image, tags, and link.
          </p>
        </div>
      </div>
    </div>
  )
}
