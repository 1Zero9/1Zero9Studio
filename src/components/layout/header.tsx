import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  return (
    <header>
      <Container className="flex items-center justify-between py-8">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-fg transition-colors hover:text-muted"
        >
          1Zero9
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
