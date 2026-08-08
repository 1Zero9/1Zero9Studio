import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { site } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <Container className="site-header__inner">
        <Link href="/" aria-label="1Zero9 — home" className="site-header__brand">
          <Logo className="h-6 w-auto" />
          <span>Stephen Cranfield</span>
        </Link>
        <nav aria-label="Main navigation">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <ThemeToggle />
          <a href={`mailto:${site.author.email}`} className="site-header__contact">
            Let’s talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </Container>
    </header>
  );
}
