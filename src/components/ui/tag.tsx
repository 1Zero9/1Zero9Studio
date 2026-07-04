export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-sm border border-border px-1.5 py-0.5 font-mono text-xs lowercase text-muted">
      {children}
    </span>
  );
}
