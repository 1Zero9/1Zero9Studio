/*
 * Decorative full-width pulse echoing the logo's waveform — flatline,
 * spike, deep dip, recover. Draws itself on load, then a bright ember
 * pulse travels the line every 12s like a live transmission (CSS only;
 * static line under reduced motion). non-scaling-stroke keeps the line
 * crisp when the SVG compresses on small screens.
 */
const WAVEFORM =
  "M0 60 H420 C450 60 456 54 464 34 L478 8 C482 0 490 0 494 8 L518 104 C522 114 532 114 536 104 L552 66 C555 60 558 58 566 58 H1200";

export function SignalLine({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 120"
      fill="none"
      preserveAspectRatio="none"
      className={`h-14 w-full text-accent sm:h-16 ${className}`}
    >
      <path
        d={WAVEFORM}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className="animate-signal-draw opacity-60"
      />
      <path
        d={WAVEFORM}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        className="animate-signal-pulse"
      />
    </svg>
  );
}
