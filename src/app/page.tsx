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

const capabilities = [
  "ai systems",
  "security",
  "automation",
  "web platforms",
  "games",
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
            I design and build products where technology becomes{" "}
            <em className="text-accent">useful</em>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted">
            {allProjects.length} real projects — shipped for sport, security,
            healthcare and education. Told honestly: the problem, the build,
            and what it taught me.
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-2">
            {capabilities.map((capability) => (
              <li key={capability}>
                <Tag>{capability}</Tag>
              </li>
            ))}
          </ul>
          <Meta className="mt-10">
            <span
              aria-hidden="true"
              className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-accent align-middle"
            />
            currently: rebuilding 1zero9.com in the open
          </Meta>
        </Container>
        <SignalLine className="relative" />
      </div>

      <Container className="pt-20 pb-28">
        <section aria-labelledby="selected-work">
          <SectionLabel>
            <span id="selected-work">selected work</span>
          </SectionLabel>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
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
