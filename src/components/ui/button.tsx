import Link from "next/link";

const variants = {
  primary:
    "bg-fg text-bg hover:bg-muted focus-visible:bg-muted",
  ghost:
    "border border-border text-fg hover:border-accent/60 focus-visible:border-accent/60",
} as const;

const base =
  "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors";

type Variant = keyof typeof variants;

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link {...props} className={`${base} ${variants[variant]} ${className}`} />
  );
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: React.ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      type={type}
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}
