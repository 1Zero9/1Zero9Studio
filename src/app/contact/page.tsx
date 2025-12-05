'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage("Thanks—you're on our radar. We'll reply within 24 hours.")
      setFormData({
        name: '',
        email: '',
        message: '',
      })
    }, 800)
  }

  return (
    <div className="bg-surface text-ink">
      <section className="hero-gradient rounded-b-[50px] px-6 pt-36 pb-24 text-center text-white lg:px-12 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <p className="text-xs uppercase tracking-[0.5em] text-white/70 animate-fadeInUp">Start a project</p>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            Tell us about the future you need to launch.
          </h1>
          <p className="mt-6 text-lg text-white/85 sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            Give us the quick version. We'll respond with a short plan for how we'd approach it, timeline assumptions, and next steps.
          </p>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      </section>

      <section className="bg-white py-20">
        <div className="container-custom grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200/80 bg-white p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm uppercase tracking-[0.2em] text-slate-600 font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-cyan-50/30 px-4 py-3 text-ink placeholder:text-slate-400 focus:border-cyan-400 focus:bg-cyan-50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all"
                    placeholder="Jordan Reed"
                  />
                </div>
                <div>
                  <label className="text-sm uppercase tracking-[0.2em] text-slate-600 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-cyan-50/30 px-4 py-3 text-ink placeholder:text-slate-400 focus:border-cyan-400 focus:bg-cyan-50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm uppercase tracking-[0.2em] text-slate-600 font-medium">Message</label>
                <textarea
                  name="message"
                  required
                  rows={7}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-cyan-50/30 px-4 py-4 text-ink placeholder:text-slate-400 focus:border-cyan-400 focus:bg-cyan-50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              {submitMessage && (
                <div className="rounded-2xl border border-green-400/30 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {submitMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary btn-large disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending…' : 'Send project brief'}
              </button>
            </form>
          </section>

          <aside className="space-y-8 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-10 shadow-lg text-slate-700">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--nova-red)] font-semibold">Response time</p>
              <h3 className="mt-4 text-2xl font-bold text-ink">24 hours</h3>
              <p className="mt-3 leading-relaxed">Direct line to the studio director. No automated replies.</p>
            </div>
            <div className="border-t border-slate-200 pt-8">
              <p className="text-xs uppercase tracking-[0.4em] text-[var(--nova-red)] font-semibold">Direct email</p>
              <a href="mailto:hello@1zero9studio.com" className="mt-3 block text-lg font-bold text-ink hover:text-[var(--nova-red)] transition-colors">
                hello@1zero9studio.com
              </a>
            </div>
            <div className="border-t border-slate-200 pt-8">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium mb-4">What to include</p>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>Your project goal</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>Timeline if you have one</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>Budget range</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
