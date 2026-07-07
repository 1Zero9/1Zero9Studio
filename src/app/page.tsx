import Link from "next/link";
import { LogoReveal } from "@/components/brand/logo-reveal";
import { SignalLine } from "@/components/brand/signal-line";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";
import { ProjectCard } from "@/components/ui/project-card";
import { Tag } from "@/components/ui/tag";
import { TextLink } from "@/components/ui/text-link";
import { allProjects, allWriting, featuredProjects } from "@/lib/content";
import { site } from "@/lib/site";

const capabilities = ["ai systems", "automation", "security", "web platforms"];

const engagements = [
  {
    name: "Foundation",
    desc: "A clean, custom-built presence — the right first step when the business needs a real site, not a template with your logo on it.",
  },
  {
    name: "Growth",
    desc: "A working platform: content, bookings, integrations. For a business that's outgrown what a website builder can do.",
  },
  {
    name: "Bespoke Platform",
    desc: "A custom AI system or application built around a specific problem — accounts, data, logic, integrations. The kind of thing generic tools can't do.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-10 flex items-center gap-3 font-mono text-xs tracking-wide text-faint">
      <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
      {children}
    </h2>
  );
}

export default function Home() {
  const featured = featuredProjects();
  const latestWriting = allWriting.slice(0, 3);

  return (
    <>
      <div className="relative">
        <div
          aria-hidden="true"
          className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[36rem]"
        />
        <Container className="relative pt-16 pb-10 sm:pt-20">
          <LogoReveal className="h-20 w-auto sm:h-32" />
          <p className="mt-10 font-mono text-sm tracking-wide text-muted">
            {site.author.name} · 1Zero9
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Bespoke AI systems and software, built around{" "}
            <em className="text-accent">your</em> problem.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            Not a template with your logo on it, and not another generic
            AI wrapper. {allProjects.length} real projects — shipped for
            sport, security, healthcare and education — told honestly: the
            problem, the build, and what it taught me.
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-2">
            {capabilities.map((capability) => (
              <li key={capability}>
                <Tag>{capability}</Tag>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm">
            <TextLink href="/services">what I build →</TextLink>
          </p>
        </Container>
        <SignalLine className="relative" />
      </div>

      <Container className="pt-20 pb-28">
        <section aria-labelledby="engagements">
          <SectionLabel>
            <span id="engagements">how I engage</span>
          </SectionLabel>
          <div className="grid gap-6 sm:grid-cols-3">
            {engagements.map((e) => (
              <div key={e.name} className="rounded-md border border-border p-5">
                <p className="font-display text-lg tracking-tight">{e.name}</p>
                <p className="mt-2 text-sm text-muted">{e.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm">
            <TextLink href="/services">full breakdown of how I work</TextLink>
          </p>
        </section>
      </Container>

      <Container className="pb-28">
        <section aria-labelledby="selected-work">
          <SectionLabel>
            <span id="selected-work">selected work</span>
          </SectionLabel>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                lead={i === 0 && featured.length % 2 === 1}
              />
            ))}
          </div>
          <p className="mt-10 text-sm">
            <TextLink href="/projects">
              all projects ({allProjects.length})
            </TextLink>
          </p>
        </section>
      </Container>

      {latestWriting.length > 0 && (
        <Container className="pb-28">
          <section aria-labelledby="writing">
            <SectionLabel>
              <span id="writing">writing</span>
            </SectionLabel>
            <ul>
              {latestWriting.map((post) => (
                <li key={post.slug} className="border-t border-border">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="font-display text-xl tracking-tight transition-colors group-hover:text-muted sm:text-2xl">
                      {post.title}
                    </span>
                    <Meta>{post.date}</Meta>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm">
              <TextLink href="/writing">all writing</TextLink>
            </p>
          </section>
        </Container>
      )}

      <Container className="pb-32">
        <section aria-labelledby="contact">
          <SectionLabel>
            <span id="contact">contact</span>
          </SectionLabel>
          <p className="max-w-3xl font-display text-3xl leading-snug tracking-tight sm:text-4xl">
            Building something interesting?{" "}
            <a
              href={`mailto:${site.author.email}`}
              className="underline decoration-accent underline-offset-8 transition-colors hover:text-muted"
            >
              Say hello.
            </a>
          </p>
        </section>
      </Container>
    </>
  );
}
