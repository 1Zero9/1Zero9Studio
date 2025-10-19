'use client'

export default function Services() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive web solutions to help your business thrive online
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Development</h3>
            <p className="text-gray-600 mb-6">
              Custom website development using modern technologies like React, Next.js, and TypeScript. 
              We build fast, responsive, and user-friendly websites.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Custom web applications</li>
              <li>• E-commerce solutions</li>
              <li>• Mobile-responsive design</li>
              <li>• SEO optimization</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Management</h3>
            <p className="text-gray-600 mb-6">
              Complete website management services to keep your online presence running smoothly. 
              We handle the technical aspects so you can focus on your business.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Content management</li>
              <li>• Performance monitoring</li>
              <li>• Security management</li>
              <li>• Analytics reporting</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance</h3>
            <p className="text-gray-600 mb-6">
              Regular maintenance and updates to keep your website secure, fast, and up-to-date. 
              We provide ongoing support and improvements.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Regular updates</li>
              <li>• Security patches</li>
              <li>• Backup management</li>
              <li>• Technical support</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us today to discuss your project and see how we can help your business grow online.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#E72F2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d02626] transition-colors"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  )
}
