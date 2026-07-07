import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Prose } from "@/components/ui/prose";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Colophon",
  description: "How this site is designed and built.",
  path: "/colophon",
});

export default function ColophonPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl tracking-tight">colophon</h1>
      <div className="mt-12">
        <Prose>
          <p>
            This site is its own first case study. It was rebuilt from
            scratch in July 2026 — the entire previous site was archived to
            git history, and only the logo survived.
          </p>
          <h2>Concept</h2>
          <p>
            The mark is a single continuous line drawing &ldquo;109&rdquo; as
            a waveform. The site follows the same idea: signal over noise. A
            near-monochrome palette, one accent used only to carry
            information, and typography doing the work decoration usually
            pretends to do.
          </p>
          <h2>Type</h2>
          <p>
            Headings are set in Fraunces, body text in Inter, and metadata in
            JetBrains Mono — all variable fonts, self-hosted at build time
            via <code>next/font</code>, so no third-party requests and no
            layout shift.
          </p>
          <h2>Stack</h2>
          <ul>
            <li>
              Next.js 16 (App Router), static-first with on-demand
              revalidation for project media managed via a private admin
              tool, on Vercel
            </li>
            <li>TypeScript strict, React 19</li>
            <li>Tailwind CSS 4 — tokens as CSS variables, dark mode first</li>
            <li>
              MDX via content-collections, with Zod-validated frontmatter:
              invalid content fails the build
            </li>
            <li>Syntax highlighting rendered at build time with shiki</li>
          </ul>
          <h2>Principles</h2>
          <ul>
            <li>
              Entrance motion is pure CSS, so content paints before any
              JavaScript loads and <code>prefers-reduced-motion</code> is
              honoured by one global rule.
            </li>
            <li>
              The only client-side JavaScript on most pages is the theme
              toggle.
            </li>
            <li>
              Accessibility is verified with axe and a keyboard pass on every
              change; performance is gated at Lighthouse 95+.
            </li>
          </ul>
          <p>
            The full story of the rebuild is in{" "}
            <Link href="/writing/rebuilding-1zero9-in-the-open">
              rebuilding 1zero9.com in the open
            </Link>
            .
          </p>
        </Prose>
      </div>
    </Container>
  );
}
