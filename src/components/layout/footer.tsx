import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/layout/container";

export function Footer() {
  return (
    <footer>
      <Container className="flex items-center justify-between border-t border-border py-8">
        <p className="font-mono text-xs text-faint">
          © {new Date().getFullYear()} {site.author.name}
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
      </Container>
    </footer>
  );
}
