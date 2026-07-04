import Link from "next/link";

type TextLinkProps = React.ComponentProps<typeof Link>;

export function TextLink({ className = "", ...props }: TextLinkProps) {
  return (
    <Link
      {...props}
      className={`underline decoration-faint underline-offset-4 transition-colors hover:decoration-fg ${className}`}
    />
  );
}
