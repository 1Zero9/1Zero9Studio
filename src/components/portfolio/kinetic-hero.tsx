import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function KineticHero() {
  return (
    <section className="portfolio-hero">
      <div className="portfolio-hero__copy">
        <p className="portfolio-eyebrow">Stephen Cranfield · Designer and builder</p>
        <h1>
          I turn useful ideas into <em>working products.</em>
        </h1>
        <p className="portfolio-hero__intro">
          A portfolio of websites, progressive web apps and software I design,
          build and ship outside my work in enterprise IT.
        </p>
        <div className="portfolio-hero__actions">
          <Link href="#work">Explore the work <span aria-hidden="true">↓</span></Link>
          <Link href="/about">About me <span aria-hidden="true">↗</span></Link>
        </div>
      </div>

      <div className="portfolio-hero__identity">
        <Logo title="1Zero9 Studio" />
        <p>Ideas · interface · code · launch</p>
      </div>
    </section>
  );
}
