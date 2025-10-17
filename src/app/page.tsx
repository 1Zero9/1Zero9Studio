'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg text-text-light">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-lighter">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image 
                src="/images/redrocket-logo.jpg" 
                alt="Red Rocket Logo" 
                width={40} 
                height={40} 
                className="rounded-full glow-effect"
              />
              <Image 
                src="/images/109-black-bg-whitetext.png" 
                alt="1Zero9 Studio" 
                width={120} 
                height={30} 
                className="logo-title"
              />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-text-light hover:text-rocket-red transition-colors duration-300">Home</a>
              <a href="#about" className="text-text-light hover:text-rocket-red transition-colors duration-300">About</a>
              <a href="#services" className="text-text-light hover:text-rocket-red transition-colors duration-300">Services</a>
              <a href="#contact" className="text-text-light hover:text-rocket-red transition-colors duration-300">Contact</a>
            </div>
            <div className="md:hidden">
              <button className="text-text-light">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-gradient min-h-screen flex items-center pt-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl font-black leading-tight">
                  <span className="text-text-light">LAUNCH</span>
                  <br />
                  <span className="text-rocket-red">YOUR VISION</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-gray leading-relaxed max-w-2xl">
                  Premium web development and digital solutions that propel your business to new heights. 
                  From concept to launch, we make it happen.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="btn-primary btn-large glow-effect">
                  🚀 Launch Project
                </button>
                <button className="btn-secondary btn-large">
                  View Our Work
                </button>
              </div>
              
              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-rocket-red">50+</div>
                  <div className="text-sm text-text-gray">Projects Launched</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rocket-red">100%</div>
                  <div className="text-sm text-text-gray">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-rocket-red">24/7</div>
                  <div className="text-sm text-text-gray">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-rocket-red to-red-700 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-dark-card border border-dark-lighter rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <Image 
                      src="/images/redrocket-logo.jpg" 
                      alt="Red Rocket" 
                      width={80} 
                      height={80} 
                      className="rounded-full glow-effect"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-6 text-text-light">Ready for Takeoff?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-rocket-red rounded-full animate-pulse"></div>
                      <span className="text-text-gray">Modern Tech Stack</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-rocket-red rounded-full animate-pulse"></div>
                      <span className="text-text-gray">Lightning Fast Performance</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-rocket-red rounded-full animate-pulse"></div>
                      <span className="text-text-gray">Mobile-First Design</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-rocket-red rounded-full animate-pulse"></div>
                      <span className="text-text-gray">SEO Optimized</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-dark-bg">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-text-light">WHO WE </span>
              <span className="text-rocket-red">ARE</span>
            </h2>
            <p className="text-xl text-text-gray max-w-4xl mx-auto leading-relaxed">
              We're not just developers - we're digital architects who transform ideas into powerful, 
              scalable web solutions that drive real business results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-rocket-red to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-light">Lightning Fast</h3>
              <p className="text-text-gray leading-relaxed">
                Blazing fast websites optimized for speed, performance, and user experience.
              </p>
            </div>
            
            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-rocket-red to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-light">Quality Driven</h3>
              <p className="text-text-gray leading-relaxed">
                Meticulous attention to detail ensures every project exceeds expectations.
              </p>
            </div>
            
            <div className="card text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-rocket-red to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-light">Client Focused</h3>
              <p className="text-text-gray leading-relaxed">
                Your success is our mission. We work as partners, not just vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-gradient-to-b from-dark-bg to-dark-card">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-text-light">OUR </span>
              <span className="text-rocket-red">SERVICES</span>
            </h2>
            <p className="text-xl text-text-gray max-w-3xl mx-auto">
              Full-stack solutions designed to launch your business into the digital stratosphere
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-light">Web Development</h3>
              <p className="text-text-gray leading-relaxed">
                Custom web applications built with cutting-edge technologies for maximum performance and scalability.
              </p>
            </div>
            
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-light">UI/UX Design</h3>
              <p className="text-text-gray leading-relaxed">
                Stunning, intuitive designs that convert visitors into customers and create memorable experiences.
              </p>
            </div>
            
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-light">SEO & Marketing</h3>
              <p className="text-text-gray leading-relaxed">
                Strategic optimization and digital marketing to boost your online presence and drive growth.
              </p>
            </div>
            
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-light">Cloud Solutions</h3>
              <p className="text-text-gray leading-relaxed">
                Scalable cloud infrastructure and hosting solutions for enterprise-level performance.
              </p>
            </div>
            
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-light">Support & Maintenance</h3>
              <p className="text-text-gray leading-relaxed">
                24/7 monitoring, updates, and support to keep your digital assets running smoothly.
              </p>
            </div>
            
            <div className="card group">
              <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-light">Strategy & Consulting</h3>
              <p className="text-text-gray leading-relaxed">
                Expert guidance and strategic planning to accelerate your digital transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section-padding bg-gradient-to-r from-rocket-red to-red-700">
        <div className="container-custom text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Image 
                src="/images/redrocket-logo.jpg" 
                alt="Ready to Launch" 
                width={100} 
                height={100} 
                className="rounded-full glow-effect"
              />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
              READY TO LAUNCH?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-red-100 leading-relaxed">
              Let's transform your vision into a digital reality that propels your business forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="mailto:hello@1zero9studio.com" 
                className="bg-white text-rocket-red px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                🚀 Launch My Project
              </a>
              <a 
                href="tel:+1234567890" 
                className="border-3 border-white text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-rocket-red transition-all duration-300"
              >
                📞 Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg border-t border-dark-lighter py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <Image 
                  src="/images/redrocket-logo.jpg" 
                  alt="1Zero9 Studio" 
                  width={50} 
                  height={50} 
                  className="rounded-full"
                />
                <Image 
                  src="/images/109-black-bg-whitetext.png" 
                  alt="1Zero9 Studio" 
                  width={150} 
                  height={40} 
                />
              </div>
              <p className="text-text-gray leading-relaxed max-w-md">
                Launching digital experiences that propel businesses into the future. 
                Your success is our trajectory.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-text-light">Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-text-gray hover:text-rocket-red transition-colors">Web Development</a></li>
                <li><a href="#" className="text-text-gray hover:text-rocket-red transition-colors">UI/UX Design</a></li>
                <li><a href="#" className="text-text-gray hover:text-rocket-red transition-colors">SEO & Marketing</a></li>
                <li><a href="#" className="text-text-gray hover:text-rocket-red transition-colors">Cloud Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-text-light">Contact</h4>
              <div className="space-y-3">
                <p className="text-text-gray">hello@1zero9studio.com</p>
                <p className="text-text-gray">+1 (234) 567-8900</p>
                <div className="flex space-x-4 pt-4">
                  <a href="#" className="text-text-gray hover:text-rocket-red transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-text-gray hover:text-rocket-red transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-dark-lighter mt-12 pt-8 text-center">
            <p className="text-text-gray">
              &copy; 2024 1Zero9 Studio. All rights reserved. Ready for liftoff? 🚀
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
