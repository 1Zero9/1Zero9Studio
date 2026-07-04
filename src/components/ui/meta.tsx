/* Mono metadata row — dates, reading time, tags. The "workshop label" texture. */
export function Meta({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-mono text-xs tracking-wide text-faint ${className}`}>
      {children}
    </p>
  );
}
