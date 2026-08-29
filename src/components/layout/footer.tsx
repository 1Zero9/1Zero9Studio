import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand-block">
            <h3>
              <Logo className="h-6 w-auto text-signal" />
              <span>1Zero9 Studio</span>
            </h3>
            <p>
              Product thinking, interface design, and working software. Based in Dublin, building for the open web.
            </p>
          </div>

          <div className="site-footer__nav">
            <div className="site-footer__nav-group">
              <span className="site-footer__nav-title">Navigation</span>
              <Link href="/projects" className="site-footer__nav-link">Selected Work</Link>
              <Link href="/#labs" className="site-footer__nav-link">Active Labs</Link>
              <Link href="/about" className="site-footer__nav-link">About</Link>
              <Link href="/writing" className="site-footer__nav-link">Notes & Writing</Link>
            </div>

            <div className="site-footer__nav-group">
              <span className="site-footer__nav-title">Studio & Info</span>
              <Link href="/colophon" className="site-footer__nav-link">Colophon</Link>
              <a href="mailto:onezeronine@gmail.com" className="site-footer__nav-link">
                onezeronine@gmail.com ↗
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} 1Zero9 Studio · Dublin, Ireland</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted">Designed & Built at 1Zero9</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
