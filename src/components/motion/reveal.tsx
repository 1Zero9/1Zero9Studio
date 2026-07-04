/*
 * CSS-only entrance so content paints without waiting for hydration
 * (keeps LCP honest and works with JS disabled). Reduced motion is
 * handled by the global prefers-reduced-motion rule.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-rise-in ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
