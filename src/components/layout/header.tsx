import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function Header() {
  return (
    <header className="folio-header">
      <Link href="/" className="folio-header__brand" aria-label="1Zero9 — home">
        <Logo className="h-8 w-auto" />
        <span>1Zero9</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/projects">Work</Link>
        <Link href="/about">About</Link>
        <Link href="/writing">Notes</Link>
      </nav>
      <a href="mailto:onezeronine@gmail.com" className="folio-header__hello">Hello ↗</a>
    </header>
  );
}
