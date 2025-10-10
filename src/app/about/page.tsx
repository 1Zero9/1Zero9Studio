export default function About() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About 1Zero9 Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are passionate about creating exceptional web experiences that drive business growth
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-gray-600 mb-6">
              Founded with a vision to help businesses thrive in the digital world, 1Zero9 Studio combines 
              technical expertise with creative design to deliver web solutions that make a real impact.
            </p>
            <p className="text-gray-600 mb-6">
              We believe that every business deserves a professional online presence that not only looks 
              great but also performs exceptionally well. Our team is dedicated to turning your vision 
              into reality through modern web technologies and proven development practices.
            </p>
            <p className="text-gray-600">
              Whether you're a startup looking to establish your brand online or an established business 
              seeking to modernize your web presence, we're here to help you succeed.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">Lightning-fast websites that perform exceptionally well</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile First</h3>
              <p className="text-gray-600">Responsive designs that look great on all devices</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">Built with security best practices and regular updates</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600">Ongoing support and maintenance for peace of mind</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to take your business to the next level? We'd love to hear about your project 
            and discuss how we can help you achieve your goals.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#E72F2F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d02626] transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  )
}
