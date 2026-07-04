import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { LogoReveal } from "@/components/brand/logo-reveal";
import { Button, ButtonLink } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Tag } from "@/components/ui/tag";
import { Meta } from "@/components/ui/meta";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  "bg",
  "surface",
  "border",
  "fg",
  "muted",
  "faint",
  "accent",
] as const;

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mb-8 font-mono text-xs tracking-wide text-faint">
        {label}
      </h2>
      {children}
    </section>
  );
}

export default function Styleguide() {
  return (
    <Container className="py-16">
      <h1 className="mb-12 font-display text-3xl tracking-tight">
        Styleguide
      </h1>

      <Section label="mark">
        <div className="flex items-end gap-12">
          <Logo className="h-16 w-auto" />
          <Logo className="h-8 w-auto" />
          <span className="text-accent">
            <Logo className="h-8 w-auto" title="1Zero9 in accent" />
          </span>
          <LogoReveal className="h-16 w-auto" />
        </div>
      </Section>

      <Section label="colour">
        <ul className="flex flex-wrap gap-4">
          {swatches.map((name) => (
            <li key={name} className="flex flex-col gap-2">
              <span
                className="block size-16 rounded-md border border-border"
                style={{ backgroundColor: `var(--${name})` }}
              />
              <Meta>{name}</Meta>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="type">
        <div className="flex flex-col gap-6">
          <p className="font-display text-6xl tracking-tight">
            Signal over noise
          </p>
          <p className="font-display text-3xl tracking-tight">
            Where ideas become products
          </p>
          <p className="max-w-prose text-base">
            Body — Projects are the heart of this site. Each one tells a
            complete story: the problem, the thinking, the build, and what it
            taught me.
          </p>
          <p className="max-w-prose text-sm text-muted">
            Secondary — used for summaries and supporting copy.
          </p>
          <Meta>2026-07-04 · 6 min read · workshop label texture</Meta>
        </div>
      </Section>

      <Section label="interactive">
        <div className="flex flex-wrap items-center gap-4">
          <Button>Button</Button>
          <Button variant="ghost">Ghost</Button>
          <ButtonLink href="/dev/styleguide">Button link</ButtonLink>
          <TextLink href="/dev/styleguide">Text link</TextLink>
          <Tag>ai</Tag>
          <Tag>security</Tag>
          <Tag>design</Tag>
        </div>
      </Section>

      <Section label="card">
        <a
          href="#main"
          className="group block max-w-md rounded-lg border border-border p-6 transition-colors hover:border-faint"
        >
          <h3 className="font-display text-xl tracking-tight">
            A sample project
          </h3>
          <p className="mt-2 text-sm text-muted">
            One-line outcome that says what shipped and why it mattered.
          </p>
          <Meta className="mt-4">2026 · ai · automation</Meta>
        </a>
      </Section>

      <Section label="prose">
        <Prose>
          <h2>Prose heading</h2>
          <p>
            Long-form text uses the typography plugin mapped to design tokens,
            so it flips with the theme. <a href="#main">Inline links</a> keep
            the offset underline.
          </p>
          <blockquote>Quiet confidence, demonstrated not described.</blockquote>
          <pre>
            <code>{`const signal = (noise: number) => 0;`}</code>
          </pre>
        </Prose>
      </Section>

      <Section label="motion">
        <Reveal>
          <p className="max-w-prose text-muted">
            This block reveals with an 8px rise and fade — or a plain fade when
            reduced motion is set.
          </p>
        </Reveal>
      </Section>
    </Container>
  );
}
