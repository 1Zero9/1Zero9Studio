"use client";

import Link from "next/link";
import { useRef } from "react";
import { Logo } from "@/components/brand/logo";

export function KineticHero() {
  const identity = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (!identity.current) return;
    const bounds = identity.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    identity.current.style.setProperty("--hero-x", `${(x * 12).toFixed(1)}px`);
    identity.current.style.setProperty("--hero-y", `${(y * 10).toFixed(1)}px`);
    identity.current.style.setProperty("--signal-x", `${(x * -18).toFixed(1)}px`);
    identity.current.style.setProperty("--signal-y", `${(y * -14).toFixed(1)}px`);
  }

  function reset() {
    identity.current?.style.setProperty("--hero-x", "0px");
    identity.current?.style.setProperty("--hero-y", "0px");
    identity.current?.style.setProperty("--signal-x", "0px");
    identity.current?.style.setProperty("--signal-y", "0px");
  }

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

      <div ref={identity} onPointerMove={move} onPointerLeave={reset} className="portfolio-hero__identity">
        <span>01 / Portfolio</span>
        <Logo title="1Zero9 Studio" />
        <p>Product thinking<br />Interface design<br />Working software</p>
      </div>
    </section>
  );
}
