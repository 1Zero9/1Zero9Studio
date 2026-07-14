/*
 * Decorative full-width pulse echoing the logo's waveform — flatline,
 * spike, deep dip, recover. Draws itself on load, then a bright ember
 * pulse travels the line every 12s like a live transmission (CSS only;
 * static line under reduced motion). non-scaling-stroke keeps the line
 * crisp when the SVG compresses on small screens.
 *
 * Two waveforms: mobile relies on horizontal compression to sharpen the
 * spike; desktop renders near 1:1, so it gets a tighter path to match
 * that same snap.
 */
const WAVEFORM_MOBILE =
  "M0 60 H420 C450 60 456 54 464 34 L478 8 C482 0 490 0 494 8 L518 104 C522 114 532 114 536 104 L552 66 C555 60 558 58 566 58 H1200";

const WAVEFORM_DESKTOP =
  "M0 60 H420 C435 60 438 54 442 34 L449 8 C451 0 455 0 457 8 L469 104 C471 114 476 114 478 104 L486 66 C487.5 60 489 58 493 58 H1200";

function Wave({ d, className }: { d: string; className: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      fill="none"
      preserveAspectRatio="none"
      className={`h-14 w-full overflow-visible text-accent sm:h-16 ${className}`}
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className="animate-signal-draw opacity-60"
      />
      {/*
       * No non-scaling-stroke here: Chromium miscomputes animated dash
       * lengths in screen space when it's set, which strands the pulse
       * partway across wide viewports. Width 4.5 in viewBox units scales
       * to ~2px rendered.
       */}
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="animate-signal-pulse"
      />
    </svg>
  );
}

export function SignalLine({ className = "" }: { className?: string }) {
  return (
    <>
      <Wave d={WAVEFORM_MOBILE} className={`sm:hidden ${className}`} />
      <Wave d={WAVEFORM_DESKTOP} className={`hidden sm:block ${className}`} />
    </>
  );
}
