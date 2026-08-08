import Link from "next/link";
import { LogoReveal } from "@/components/brand/logo-reveal";
import { Container } from "@/components/layout/container";
import {
  ProjectExplorer,
  ProjectStage,
  type ProjectPreview,
} from "@/components/portfolio/project-explorer";
import { allProjects, featuredProjects } from "@/lib/content";

function preview(project: (typeof allProjects)[number]): ProjectPreview {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    year: project.year,
    kind: project.kind,
    accent: project.accent,
    cover: project.cover,
    coverAlt: project.coverAlt,
    tags: project.tags,
    status: project.status,
  };
}

function SectionIntro({ index, eyebrow, title }: { index: string; eyebrow: string; title: string }) {
  return (
    <div className="section-intro">
      <p><span>{index}</span>{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default function Home() {
  const projects = allProjects.map(preview);
  const selected = featuredProjects().slice(0, 4).map(preview);

  return (
    <>
      <section className="home-hero">
        <Container className="relative">
          <div className="home-hero__status">
            <span aria-hidden="true" />
            Independent maker · Dublin, Ireland
          </div>

          <div className="home-hero__mark" aria-hidden="true">
            <LogoReveal className="h-auto w-full" />
          </div>

          <div className="home-hero__copy">
            <p className="home-hero__kicker">Stephen Cranfield / 1Zero9</p>
            <h1>
              Ideas, designed into <em>working things.</em>
            </h1>
            <div className="home-hero__support">
              <p>
                I design and build apps, digital products and websites—turning
                ideas into useful, finished experiences from first sketch to launch.
              </p>
              <div>
                <Link href="#selected-work">Explore the work <span>↓</span></Link>
                <Link href="/about">More about me <span>↗</span></Link>
              </div>
            </div>
          </div>

          <div className="home-hero__signal" aria-hidden="true">
            <span /><i /><b /><i /><span />
          </div>
        </Container>
      </section>

      <Container className="portfolio-section" id="selected-work">
        <SectionIntro
          index="01"
          eyebrow="Selected work"
          title="Made to be used, not just looked at."
        />
        <ProjectStage projects={selected} />
      </Container>

      <section className="manifesto-band">
        <Container>
          <p className="manifesto-band__label">The practice</p>
          <p className="manifesto-band__statement">
            One person across the entire product: <span>idea</span>, interaction,
            identity, code and the last ten percent that makes it feel finished.
          </p>
          <div className="manifesto-band__steps" aria-label="My process">
            {["Find the useful idea", "Shape the experience", "Build the real thing", "Learn and improve"].map((step, index) => (
              <div key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="portfolio-section">
        <SectionIntro
          index="02"
          eyebrow="Project index"
          title="Apps, websites and useful experiments."
        />
        <ProjectExplorer projects={projects} />
      </Container>

      <Container className="home-about">
        <div className="home-about__label">About the maker</div>
        <div>
          <p className="home-about__lead">
            I’m Stephen. I’m interested in the whole journey from “what if?” to
            something people can actually open, understand and use.
          </p>
          <p className="home-about__body">
            1Zero9 is where I collect that work—the personal products, client
            websites, experiments and lessons that come from making them real.
          </p>
          <div className="home-about__links">
            <Link href="/about">My approach ↗</Link>
            <Link href="/writing">Build notes ↗</Link>
            <a href="mailto:onezeronine@gmail.com">Say hello ↗</a>
          </div>
        </div>
      </Container>
    </>
  );
}
