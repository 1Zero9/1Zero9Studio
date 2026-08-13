import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function KineticHero() {
  return (
    <section className="portfolio-hero">
      <div className="portfolio-hero__copy">
        <p className="portfolio-eyebrow">Stephen Cranfield · Independent work</p>
        <h1>
          Websites and apps I <em>design and build.</em>
        </h1>
        <p className="portfolio-hero__intro">
          A selection of independent projects made outside my work in enterprise
          IT—from small websites to installable products and software tools.
        </p>
        <div className="portfolio-hero__actions">
          <Link href="#work">Explore the work <span aria-hidden="true">↓</span></Link>
          <Link href="/about">About me <span aria-hidden="true">↗</span></Link>
        </div>
      </div>

      <div className="portfolio-hero__identity">
        <Logo title="1Zero9 Studio" />
        <p>Product · interface · code</p>
      </div>
    </section>
  );
}
