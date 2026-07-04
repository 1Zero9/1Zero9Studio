import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";

export const metadata: Metadata = {
  title: "Type comparison",
  robots: { index: false, follow: false },
};

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const samples = [
  {
    key: "a",
    label: "A — Fraunces (current)",
    note: "Warm, characterful serif with optical sizing. Distinctive; a touch editorial.",
    style: { fontFamily: "var(--font-fraunces), Georgia, serif" },
  },
  {
    key: "b",
    label: "B — Newsreader",
    note: "Quieter editorial serif. Calmer voice, less personality, very readable at scale.",
    style: { fontFamily: "var(--font-newsreader), Georgia, serif" },
  },
  {
    key: "c",
    label: "C — All-sans (Inter)",
    note: "Headings in the body face. Most restrained; leans technical/Linear-like.",
    style: { fontFamily: "var(--font-inter), ui-sans-serif, sans-serif" },
  },
];

export default function TypeComparison() {
  return (
    <Container className={`${newsreader.variable} py-16`}>
      <h1 className="font-display text-3xl tracking-tight">Type comparison</h1>
      <p className="mt-4 max-w-prose text-muted">
        The display face carries the site&apos;s voice. Same content, three
        candidates — check both themes and mobile width.
      </p>

      {samples.map((sample) => (
        <section key={sample.key} className="mt-16 border-t border-border pt-10">
          <Meta>{sample.label}</Meta>
          <p
            className="mt-6 max-w-2xl text-4xl leading-tight tracking-tight sm:text-5xl"
            style={sample.style}
          >
            I design and build products where technology becomes useful.
          </p>
          <p
            className="mt-8 text-2xl tracking-tight"
            style={sample.style}
          >
            Signal over noise — projects, told honestly.
          </p>
          <p className="mt-6 max-w-prose text-sm text-muted">{sample.note}</p>
        </section>
      ))}
    </Container>
  );
}
