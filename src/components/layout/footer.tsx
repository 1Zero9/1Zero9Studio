import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="1Zero9 — home"
            className="text-muted transition-colors hover:text-fg"
          >
            <Logo className="h-5 w-auto" />
          </Link>
          <nav aria-label="Footer">
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
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-faint">
            © {new Date().getFullYear()} {site.author.name} · signal over
            noise
          </p>
          <span className="flex items-center gap-6">
            <Link
              href="/colophon"
              className="font-mono text-xs text-muted transition-colors hover:text-fg"
            >
              colophon
            </Link>
            <a
              href="/feed.xml"
              className="font-mono text-xs text-muted transition-colors hover:text-fg"
            >
              rss
            </a>
            <a
              href={`mailto:${site.author.email}`}
              className="font-mono text-xs text-muted transition-colors hover:text-fg"
            >
              {site.author.email}
            </a>
          </span>
        </div>
      </Container>
    </footer>
  );
}
