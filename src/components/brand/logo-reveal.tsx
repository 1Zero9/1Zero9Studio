import { Logo } from "@/components/brand/logo";

/* The mark wipes in left-to-right — the signal drawing across. CSS-only. */
export function LogoReveal({ className }: { className?: string }) {
  return (
    <div className="animate-wipe-in w-fit">
      <Logo className={className} />
    </div>
  );
}
