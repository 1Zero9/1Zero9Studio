import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

export function Header() {
  return (
    <header>
      <Container className="flex items-center justify-between py-8">
        <Link
          href="/"
          aria-label="1Zero9 — home"
          className="text-fg transition-colors hover:text-accent"
        >
          <Logo className="h-5 w-auto" />
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
            <li className="hidden sm:block">
              <ButtonLink
                href="/contact"
                variant="ghost"
                className="px-3 py-1.5"
              >
                say hello
              </ButtonLink>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
