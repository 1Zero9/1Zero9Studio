import { Container } from "@/components/layout/container";
import { Prose } from "@/components/ui/prose";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Colophon",
  description: "How this portfolio is designed and built.",
  path: "/colophon",
});

export default function ColophonPage() {
  return (
    <Container className="maker-page">
      <header className="maker-page__hero">
        <p>Colophon / Behind the portfolio</p>
        <h1>A website built to let the <span>work take over.</span></h1>
      </header>
      <div className="maker-page__grid">
        <aside><p>Designed at 1Zero9</p><p>Built with Next.js</p><p>Hosted on Vercel</p></aside>
        <Prose>
          <p>
            The 1Zero9 mark is the only fixed element. Everything around it is
            designed as an editorial canvas: warm paper, oversized type and
            full-page project chapters that borrow their colour from the work.
          </p>
          <h2>Principle</h2>
          <p>
            A portfolio should not make ten different projects look like ten
            versions of the same card. Here each project gets room to change the
            pace, colour and composition while the underlying reading experience
            remains clear.
          </p>
          <h2>Build</h2>
          <p>
            The site uses Next.js, TypeScript and Tailwind CSS. Project stories
            are validated MDX; screenshots, outcomes and links can be managed
            through the private publishing tool. Most movement is CSS, with a
            small amount of client-side interaction for the opening mark and the
            visual project index.
          </p>
          <h2>Care</h2>
          <p>
            The layouts respond from wide desktop canvases to small phones,
            reduced-motion preferences are respected, and the primary portfolio
            routes are checked automatically for accessibility.
          </p>
        </Prose>
      </div>
    </Container>
  );
}
