import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { SignalLine } from "@/components/brand/signal-line";

export const metadata: Metadata = {
  title: "Direction comparison",
  robots: { index: false, follow: false },
};

function HeroMock({
  variant,
  bg,
  surface,
  border,
  fg,
  muted,
  accent,
  radius,
  displayFont,
}: {
  variant: string;
  bg: string;
  surface: string;
  border: string;
  fg: string;
  muted: string;
  accent: string;
  radius: string;
  displayFont: string;
}) {
  const chip = (label: string) => (
    <span
      key={label}
      style={{
        border: `1px solid ${border}`,
        borderRadius: radius,
        padding: "4px 10px",
        fontFamily: "var(--font-jetbrains-mono)",
        fontSize: 12,
        color: muted,
      }}
    >
      {label}
    </span>
  );

  return (
    <section
      style={{ backgroundColor: bg, color: fg }}
      className="overflow-hidden"
    >
      <div className="mx-auto max-w-5xl px-8 pt-14 pb-4">
        <p
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12,
            color: accent,
            letterSpacing: "0.08em",
          }}
        >
          {variant}
        </p>
        <div className="mt-8" style={{ color: fg }}>
          <Logo className="h-24 w-auto sm:h-28" title="" />
        </div>
        <p
          className="mt-8"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 13,
            color: muted,
          }}
        >
          Stephen Cranfield · 1Zero9
        </p>
        <h2
          className="mt-5 max-w-3xl text-5xl leading-[1.05] tracking-tight sm:text-6xl"
          style={{ fontFamily: displayFont }}
        >
          I design and build products where technology becomes{" "}
          <em style={{ color: accent }}>useful</em>.
        </h2>
        <p className="mt-6 max-w-xl" style={{ color: muted, fontSize: 17 }}>
          10 real projects — shipped for sport, security, healthcare and
          education.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          {["ai systems", "security", "automation", "web platforms", "games"].map(
            chip,
          )}
        </div>
        <div
          className="mt-9 inline-block"
          style={{
            backgroundColor: surface,
            border: `1px solid ${border}`,
            borderRadius: radius,
            padding: "10px 16px",
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12,
            color: muted,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: 999,
              backgroundColor: accent,
              marginRight: 8,
              verticalAlign: "middle",
            }}
          />
          currently: rebuilding 1zero9.com in the open
        </div>
      </div>
      <div style={{ color: accent }}>
        <SignalLine />
      </div>
    </section>
  );
}

export default function DirectionComparison() {
  return (
    <div className="flex flex-col">
      <HeroMock
        variant="A — DEEPER + EMBER (evolved current)"
        bg="#080809"
        surface="#101013"
        border="#2a2a2f"
        fg="#f2f2f0"
        muted="#a3a3a0"
        accent="#ff6740"
        radius="8px"
        displayFont="var(--font-fraunces), Georgia, serif"
      />
      <HeroMock
        variant="B — BRUTALIST + NEON"
        bg="#000000"
        surface="#0a0a0a"
        border="#333333"
        fg="#ffffff"
        muted="#9a9a9a"
        accent="#3fff8c"
        radius="0px"
        displayFont="var(--font-inter), ui-sans-serif, sans-serif"
      />
      <HeroMock
        variant="C — HYBRID: BLACK + EMBER TURNED UP, FRAUNCES KEPT"
        bg="#000000"
        surface="#0c0c0c"
        border="#2e2e2e"
        fg="#f5f5f2"
        muted="#a8a8a4"
        accent="#ff5a2d"
        radius="4px"
        displayFont="var(--font-fraunces), Georgia, serif"
      />
    </div>
  );
}
