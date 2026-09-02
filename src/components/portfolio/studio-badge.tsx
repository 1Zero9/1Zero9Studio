import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function StudioBadge() {
  return (
    <section className="studio-footprint-section" id="studio">
      <div className="studio-badge-card">
        <div className="studio-badge-card__copy">
          <span className="section-eyebrow">
            04 / Studio Footprint & Philosophy
          </span>
          <h2>Arrived from a site built by 1Zero9?</h2>
          <p>
            Whether you found this page via a community football club, a healthcare service, or an AI workflow tool, 1Zero9 is the studio where it was imagined, designed, and built.
          </p>
          <p className="mt-3">
            I don’t build generic cookie-cutter templates. Every project is crafted with direct attention to typography, lightning-fast web performance, accessible interfaces, and pragmatic engineering.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <Link href="/about" className="btn-primary">
              <span>About the maker</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className="btn-secondary">
              <span>Discuss a collaboration</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="studio-mark-display">
          <Logo className="h-12 w-auto text-signal" />
          <span className="font-bold text-fg text-sm mt-2">1Zero9 Studio</span>
          <span>Crafted in Dublin</span>
        </div>
      </div>
    </section>
  );
}
