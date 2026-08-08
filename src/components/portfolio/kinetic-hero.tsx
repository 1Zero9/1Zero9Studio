"use client";

import Link from "next/link";
import { useRef } from "react";
import { Logo } from "@/components/brand/logo";

export function KineticHero() {
  const hero = useRef<HTMLElement>(null);

  function move(event: React.PointerEvent<HTMLElement>) {
    if (!hero.current) return;
    const bounds = hero.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    hero.current.style.setProperty("--mx", `${(x * 38).toFixed(1)}px`);
    hero.current.style.setProperty("--my", `${(y * 30).toFixed(1)}px`);
  }

  return (
    <section ref={hero} onPointerMove={move} className="kinetic-hero">
      <div className="kinetic-hero__topline">
        <p>Stephen Cranfield</p>
        <p>Designer + builder</p>
        <p>Dublin / Ireland</p>
      </div>

      <div className="kinetic-hero__mark" aria-hidden="true">
        <Logo title="" />
      </div>

      <div className="kinetic-hero__headline">
        <p>I turn</p>
        <h1>
          <span>ideas</span>
          <span>into things</span>
          <span>you can use.</span>
        </h1>
      </div>

      <div className="kinetic-hero__foot">
        <p>
          Apps, websites and experiments—imagined, designed and built from the
          first question to the working thing.
        </p>
        <Link href="#work">See what I’ve made <span aria-hidden="true">↓</span></Link>
      </div>
      <span className="kinetic-hero__orbit kinetic-hero__orbit--one" aria-hidden="true" />
      <span className="kinetic-hero__orbit kinetic-hero__orbit--two" aria-hidden="true" />
    </section>
  );
}
