import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function KineticHero() {
  return (
    <section className="portfolio-hero">
      <div className="portfolio-hero__copy">
        <p className="portfolio-eyebrow">Stephen Cranfield · Technology leader</p>
        <h1>
          I lead technology—and <em>still build things myself.</em>
        </h1>
        <p className="portfolio-hero__intro">
          By day, I work across governance, security and AI enablement in enterprise
          IT. Outside work, I design and build websites, PWAs and apps from idea to launch.
        </p>
        <div className="portfolio-hero__actions">
          <Link href="#work">Explore the work <span aria-hidden="true">↓</span></Link>
          <Link href="/about">About me <span aria-hidden="true">↗</span></Link>
        </div>
      </div>

      <div className="portfolio-hero__identity">
        <span>01 / Portfolio</span>
        <Logo title="1Zero9 Studio" />
        <p>Product thinking<br />Interface design<br />Working software</p>
      </div>
    </section>
  );
}
