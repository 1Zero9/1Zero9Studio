import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="folio-footer">
      <div className="folio-footer__mark"><Logo title="" /></div>
      <p className="folio-footer__eyebrow">Interested in the work?</p>
      <a href="mailto:onezeronine@gmail.com" className="folio-footer__cta">
        Say hello.<span>↗</span>
      </a>
      <div className="folio-footer__base">
        <p>Stephen Cranfield · Dublin · {new Date().getFullYear()}</p>
        <nav aria-label="Footer navigation">
          <Link href="/projects">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/writing">Notes</Link>
          <Link href="/colophon">Colophon</Link>
        </nav>
        <p>Designed and built at 1Zero9</p>
      </div>
    </footer>
  );
}
