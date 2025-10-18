'use client'

import Image from 'next/image';
import ContactForm from '../components/ContactForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark-bg text-text-light">

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center relative pt-32 md:pt-0 bg-gradient-to-b from-slate-950 via-slate-900 to-dark-bg">
        {/* Neon pulsing logo in background - fixed position */}
        <div className="fixed inset-0 flex items-center justify-center opacity-30 md:opacity-40 pointer-events-none z-0 mix-blend-screen">
          <Image
            src="/images/109-logo1.png"
            alt="109 Pulse"
            width={1000}
            height={1000}
            className="animate-pulse neon-glow scale-75 md:scale-125"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-bg/80 pointer-events-none"></div>

        <div className="container-custom px-6 md:px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight">
                  <span className="text-text-light">LAUNCH</span>
                  <br />
                  <span className="text-rocket-red">YOUR VISION</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-text-gray leading-relaxed mx-auto max-w-3xl">
                  Premium web development and digital solutions that propel your business to new heights.
                  From concept to launch, we make it happen.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <a
                  href="/builder"
                  className="btn-primary btn-large glow-effect text-base md:text-lg text-center"
                >
                  Build Your Site
                </a>
                <a
                  href="/portfolio"
                  className="btn-secondary btn-large text-base md:text-lg text-center"
                >
                  View Our Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gradient-to-b from-dark-bg/80 via-dark-bg/70 to-dark-bg/80 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/30 to-transparent pointer-events-none"></div>
        <div className="container-custom relative z-10">
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

      {/* AI Integration Section */}
      <section className="section-padding bg-gradient-to-b from-dark-bg/80 via-dark-card/60 to-dark-card/70 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-card/20 to-transparent pointer-events-none"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              <span className="text-text-light">POWERED BY </span>
              <span className="text-rocket-red">AI</span>
            </h2>
            <p className="text-xl text-text-gray max-w-4xl mx-auto leading-relaxed">
              We leverage cutting-edge artificial intelligence to accelerate development, enhance creativity,
              and deliver smarter solutions faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card group">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light">Rapid Development</h3>
                  <p className="text-text-gray leading-relaxed">
                    AI-assisted coding accelerates our development process, allowing us to build complex features
                    faster while maintaining the highest quality standards. What used to take weeks now takes days.
                  </p>
                </div>
              </div>
            </div>

            <div className="card group">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light">Enhanced Creativity</h3>
                  <p className="text-text-gray leading-relaxed">
                    AI helps us explore more design possibilities, generate innovative solutions, and provide
                    personalized recommendations that perfectly match your vision and business goals.
                  </p>
                </div>
              </div>
            </div>

            <div className="card group">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light">Smarter Solutions</h3>
                  <p className="text-text-gray leading-relaxed">
                    From intelligent user experiences to automated workflows, we integrate AI where it matters most—
                    creating applications that learn, adapt, and provide real value to your users.
                  </p>
                </div>
              </div>
            </div>

            <div className="card group">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-rocket-red to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-text-light">Future-Ready</h3>
                  <p className="text-text-gray leading-relaxed">
                    We stay at the forefront of AI technology, ensuring your projects leverage the latest innovations.
                    Your investment today is built for tomorrow's opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-dark-card/50 backdrop-blur-md border border-dark-lighter rounded-2xl px-8 py-6 max-w-3xl">
              <p className="text-lg text-text-gray leading-relaxed">
                <span className="text-rocket-red font-bold">Human creativity</span> meets <span className="text-rocket-red font-bold">AI efficiency</span>.
                <br className="hidden md:block" />
                We don't replace developers—we empower them to do more, faster, and better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-gradient-to-b from-dark-card/70 via-slate-800/60 to-dark-bg/80 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/15 to-transparent pointer-events-none"></div>
        <div className="container-custom relative z-10">
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

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-gradient-to-b from-dark-bg/80 via-slate-900/70 to-dark-bg/80 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rocket-red/3 to-transparent pointer-events-none"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/109-logo-circle-white2.png"
                alt="Get in Touch"
                width={80}
                height={80}
                className="glow-effect animate-pulse"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-text-light">
              LET'S <span className="text-rocket-red">CONNECT</span>
            </h2>
            <p className="text-lg md:text-xl text-text-gray max-w-2xl mx-auto">
              Have a project in mind? We'd love to hear about it. Get in touch and let's create something amazing together.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-dark-bg/80 to-slate-950/90 border-t border-dark-lighter py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none"></div>
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Image
                  src="/images/109-logo-circle-white2.png"
                  alt="1Zero9 Studio"
                  width={60}
                  height={60}
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
              &copy; 2025 1Zero9 Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
