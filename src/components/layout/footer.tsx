import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__headline">
          <Logo className="h-10 w-auto" />
          <p>Have an idea worth making real?</p>
          <a href={`mailto:${site.author.email}`}>Start a conversation ↗</a>
        </div>
        <div className="site-footer__base">
          <p>© {new Date().getFullYear()} Stephen Cranfield · Dublin</p>
          <nav aria-label="Footer navigation">
            {site.nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/colophon">Colophon</Link>
          </nav>
          <p>Ideas → interfaces → working products</p>
        </div>
      </Container>
    </footer>
  );
}
