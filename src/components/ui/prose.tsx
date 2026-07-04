export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-neutral max-w-prose prose-headings:font-display prose-headings:font-medium prose-headings:tracking-tight prose-a:underline-offset-4 prose-pre:border prose-pre:border-border">
      {children}
    </div>
  );
}
