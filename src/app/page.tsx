export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Web Solutions
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We create, manage, and maintain exceptional websites that drive your business forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-[#E72F2F] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d02626] transition-colors"
            >
              Start Your Project
            </a>
            <a
              href="/portfolio"
              className="border border-black text-black px-8 py-4 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
            >
              View Our Work
            </a>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive web services to help your business succeed online
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Development</h3>
              <p className="text-gray-600">
                Custom websites built with modern technologies for optimal performance and user experience.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Management</h3>
              <p className="text-gray-600">
                Complete website management services to keep your online presence running smoothly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Maintenance</h3>
              <p className="text-gray-600">
                Regular updates and support to keep your website secure, fast, and up-to-date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Online Presence?
          </h2>
          <p className="text-xl mb-8">
            Let's discuss your project and create something amazing together.
          </p>
          <a
            href="/contact"
            className="bg-[#E72F2F] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d02626] transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}