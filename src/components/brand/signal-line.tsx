/*
 * Decorative full-width pulse echoing the logo's waveform — flatline,
 * spike, deep dip, recover. Draws itself on load (CSS only; instant
 * under reduced motion).
 */
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
        d="M0 60 H420 C450 60 456 54 464 34 L478 8 C482 0 490 0 494 8 L518 104 C522 114 532 114 536 104 L552 66 C555 60 558 58 566 58 H1200"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="animate-signal-draw"
      />
    </svg>
  );
}
