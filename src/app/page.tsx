import Link from "next/link";
import { LogoReveal } from "@/components/brand/logo-reveal";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Meta } from "@/components/ui/meta";
import { TextLink } from "@/components/ui/text-link";
import { allWriting, featuredProjects } from "@/lib/content";
import { site } from "@/lib/site";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 font-mono text-xs tracking-wide text-faint">
      {children}
    </h2>
  );
}

export default function Home() {
  const featured = featuredProjects();
  const latestWriting = allWriting.slice(0, 3);

  return (
    <>
      <Container className="pt-20 pb-24 sm:pt-28">
        <LogoReveal className="h-12 w-auto" />
        <h1 className="mt-10 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          I design and build products where technology becomes useful.
        </h1>
        <p className="mt-6 max-w-prose text-muted">
          {site.author.name}. AI systems, web platforms, automation — and the
          occasional game. This site is the workshop: real projects, told
          honestly.
        </p>
        <Meta className="mt-10">
          <span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
          currently: rebuilding 1zero9.com in the open
        </Meta>
      </Container>

      <Container className="pb-24">
        <section aria-labelledby="selected-work">
          <SectionLabel>
            <span id="selected-work">selected work</span>
          </SectionLabel>
          <ul>
            {featured.map((project, i) => (
              <li key={project.slug} className="border-t border-border">
                <Reveal delay={i * 0.06}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block py-8"
                  >
                    <div className="flex items-baseline justify-between gap-6">
                      <h3 className="font-display text-2xl tracking-tight transition-colors group-hover:text-muted">
                        {project.title}
                      </h3>
                      <Meta>{project.year}</Meta>
                    </div>
                    <p className="mt-2 max-w-prose text-sm text-muted">
                      {project.summary}
                    </p>
                    <Meta className="mt-4">{project.tags.join(" · ")}</Meta>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm">
            <TextLink href="/projects">all projects</TextLink>
          </p>
        </section>
      </Container>

      {latestWriting.length > 0 && (
        <Container className="pb-24">
          <section aria-labelledby="writing">
            <SectionLabel>
              <span id="writing">writing</span>
            </SectionLabel>
            <ul>
              {latestWriting.map((post) => (
                <li key={post.slug} className="border-t border-border">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="group flex items-baseline justify-between gap-6 py-5"
                  >
                    <span className="font-display text-xl tracking-tight transition-colors group-hover:text-muted">
                      {post.title}
                    </span>
                    <Meta>{post.date}</Meta>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm">
              <TextLink href="/writing">all writing</TextLink>
            </p>
          </section>
        </Container>
      )}

      <Container className="pb-28">
        <section aria-labelledby="contact">
          <SectionLabel>
            <span id="contact">contact</span>
          </SectionLabel>
          <p className="max-w-prose font-display text-2xl tracking-tight">
            Building something interesting?{" "}
            <a
              href={`mailto:${site.author.email}`}
              className="underline decoration-faint underline-offset-4 transition-colors hover:decoration-fg"
            >
              Say hello.
            </a>
          </p>
        </section>
      </Container>
    </>
  );
}
