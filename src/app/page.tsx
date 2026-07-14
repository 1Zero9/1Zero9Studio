import Link from "next/link";
import { LogoReveal } from "@/components/brand/logo-reveal";
import { ButtonLink } from "@/components/ui/button";
import { SignalLine } from "@/components/brand/signal-line";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";
import { ProjectCard } from "@/components/ui/project-card";
import { Tag } from "@/components/ui/tag";
import { TextLink } from "@/components/ui/text-link";
import {
  allProjects,
  allWriting,
  featuredProjects,
  getProject,
  getPublishedTestimonials,
  getSiteCopy,
} from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 3600;

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

export default async function Home() {
  const featured = featuredProjects();
  const latestWriting = allWriting.slice(0, 3);
  const [audience, testimonials] = await Promise.all([
    getSiteCopy("home.audience"),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <div className="relative">
        <div
          aria-hidden="true"
          className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[36rem]"
        />
        <Container className="relative pt-16 sm:pt-20">
          <LogoReveal className="h-20 w-auto sm:h-32" />
          <p className="mt-10 font-mono text-sm tracking-wide text-muted">
            {site.author.name} · 1Zero9
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Bespoke AI systems and software, built around{" "}
            <em className="text-accent">your</em> problem.
          </h1>
        </Container>
        <SignalLine className="relative my-2 sm:my-4" />
        <Container className="relative pb-10">
          <p className="mt-4 max-w-2xl text-xl text-fg">
            One person, start to finish — from the first conversation to
            something live and maintained. No handoffs between departments,
            no template with your logo on it.
          </p>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {allProjects.length} real projects shipped — for sport, security,
            healthcare and education — each told honestly: the problem, the
            build, and what it taught me.
          </p>
          {audience && (
            <p className="mt-4 max-w-2xl text-lg text-muted">{audience}</p>
          )}
          <ul className="mt-8 flex flex-wrap items-center gap-2">
            {capabilities.map((capability) => (
              <li key={capability}>
                <Tag>{capability}</Tag>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/contact">start a conversation</ButtonLink>
            <ButtonLink href="/projects" variant="ghost">
              see the work
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Container className="pt-20 pb-28">
        <section aria-labelledby="engagements">
          <SectionLabel>
            <span id="engagements">how I engage</span>
          </SectionLabel>
          <div className="grid gap-6 sm:grid-cols-3">
            {engagements.map((e) => (
              <Link
                key={e.name}
                href="/services"
                className="group flex flex-col rounded-md border border-border p-5 transition-colors hover:border-accent/60"
              >
                <p className="font-display text-lg tracking-tight">{e.name}</p>
                <p className="mt-2 flex-1 text-sm text-muted">{e.desc}</p>
                <Meta className="mt-4 flex items-center justify-between">
                  <span>how it works</span>
                  <span
                    aria-hidden="true"
                    className="transition-all group-hover:translate-x-1 group-hover:text-accent"
                  >
                    &rarr;
                  </span>
                </Meta>
              </Link>
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

      {testimonials.length > 0 && (
        <Container className="pb-28">
          <section aria-labelledby="testimonials">
            <SectionLabel>
              <span id="testimonials">what clients say</span>
            </SectionLabel>
            <div className="grid gap-6 sm:grid-cols-2">
              {testimonials.map((t) => {
                const project = t.projectSlug ? getProject(t.projectSlug) : null;
                return (
                  <figure
                    key={t.id}
                    className="flex flex-col rounded-md border border-border p-6"
                  >
                    <blockquote className="flex-1 font-display text-xl leading-snug tracking-tight sm:text-2xl">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-5">
                      <Meta>
                        {t.author}
                        {t.role ? ` · ${t.role}` : ""}
                        {project && (
                          <>
                            {" · "}
                            <Link
                              href={`/projects/${project.slug}`}
                              className="underline underline-offset-4 hover:text-fg"
                            >
                              {project.title}
                            </Link>
                          </>
                        )}
                      </Meta>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        </Container>
      )}

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
          <p className="mt-6 max-w-2xl text-muted">
            Tell me a bit about the problem you&apos;re solving and where you
            are with it — that&apos;s usually enough to start a real
            conversation.
          </p>
        </section>
      </Container>
    </>
  );
}
