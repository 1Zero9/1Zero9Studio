export const metadata = {
  title: "Park Run Dash | 1Zero9 Studio",
  description: "A playful Park Run 5km side-scrolling game built by 1Zero9 Studio.",
}

export default function ParkRunPage() {
  return (
    <main className="min-h-screen bg-[#86c7e8] px-3 py-4 text-[#17324d] sm:px-5 sm:py-6">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em]">1Zero9 Studio</p>
            <h1 className="font-mono text-3xl font-black leading-none sm:text-5xl">Park Run Dash</h1>
          </div>
          <a
            href="/parkrun-dash/index.html"
            className="inline-flex min-h-11 items-center justify-center border-[3px] border-[#17324d] bg-[#ffd85a] px-5 font-mono text-sm font-black uppercase text-[#17324d] shadow-[0_4px_0_#17324d] transition active:translate-y-[3px] active:shadow-[0_1px_0_#17324d]"
          >
            Open Full Screen
          </a>
        </header>

        <div className="min-h-0 flex-1 overflow-hidden border-[4px] border-[#17324d] bg-[#73c5ef] shadow-[0_8px_0_#17324d]">
          <iframe
            src="/parkrun-dash/index.html"
            title="Park Run Dash game"
            className="block h-[78vh] min-h-[560px] w-full border-0"
            allow="fullscreen"
          />
        </div>
      </section>
    </main>
  )
}
