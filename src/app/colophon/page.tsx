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
            This site is the working index of 1Zero9: a place for products,
            websites and experiments to live together without pretending to be
            a traditional agency catalogue. The logo is the one element carried
            across every version.
          </p>
          <h2>Concept</h2>
          <p>
            The mark is a single continuous line drawing &ldquo;109&rdquo; as a
            waveform. The site treats that signal as an active system: a grid,
            status lights, project-specific colour and interfaces that respond
            as the work is explored.
          </p>
          <h2>Type</h2>
          <p>
            The display and body type is Inter, with JetBrains Mono reserved
            for labels and project metadata. Both are loaded at build time via
            <code>next/font</code>.
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
