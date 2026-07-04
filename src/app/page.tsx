import Link from "next/link";
import { LogoReveal } from "@/components/brand/logo-reveal";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";
import { ProjectRow } from "@/components/ui/project-row";
import { TextLink } from "@/components/ui/text-link";
import { allProjects, allWriting, featuredProjects } from "@/lib/content";
import { site } from "@/lib/site";

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
      <Container className="pt-20 pb-28 sm:pt-28">
        <LogoReveal className="h-12 w-auto sm:h-14" />
        <h1 className="mt-12 max-w-4xl font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          I design and build products where technology becomes useful.
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-muted">
          {site.author.name}. AI systems, web platforms, automation — and the
          occasional game. This site is the workshop: real projects, told
          honestly.
        </p>
        <Meta className="mt-12">
          <span
            aria-hidden="true"
            className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle"
          />
          currently: rebuilding 1zero9.com in the open
        </Meta>
      </Container>

      <Container className="pb-28">
        <section aria-labelledby="selected-work">
          <SectionLabel>
            <span id="selected-work">selected work</span>
          </SectionLabel>
          <ul>
            {featured.map((project, i) => (
              <ProjectRow key={project.slug} project={project} index={i} />
            ))}
          </ul>
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
              className="underline decoration-faint underline-offset-8 transition-colors hover:decoration-accent"
            >
              Say hello.
            </a>
          </p>
        </section>
      </Container>
    </>
  );
}
