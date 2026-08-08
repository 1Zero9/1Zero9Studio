import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "About",
  description: "About Stephen Cranfield, the maker behind 1Zero9.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="maker-page">
      <Reveal as="header" className="maker-page__hero">
        <p>About / Stephen Cranfield</p>
        <h1>I like taking an idea all the way to <span>working software.</span></h1>
      </Reveal>

      <div className="maker-page__grid">
        <Reveal as="aside">
          <p>Based in Dublin</p>
          <p>Designing since curiosity</p>
          <p>Building at 1Zero9</p>
        </Reveal>
        <Reveal as="div" className="maker-page__copy" delay={80}>
          <p className="maker-page__lead">
            I’m Stephen. 1Zero9 is my workshop and public record of the things I
            design, build, test and learn from.
          </p>
          <p>
            Alongside 1Zero9, I work in enterprise governance, security and AI
            enablement — helping large organisations adopt AI responsibly and
            turning ambiguous, high-risk areas into structured, workable
            practice. This site is where that same instinct plays out
            hands-on: building the thing, not just governing it.
          </p>
          <p>
            My projects often begin as small questions: could household jobs be
            shared more fairly? Could a personal media guide learn someone’s
            taste? Could security teams get the value of generative AI without
            losing judgement and control?
          </p>
          <p>
            I’m most interested in the whole product—not only the code or the
            surface. That means shaping the idea, deciding what deserves to
            exist, designing how it behaves, building it properly and noticing
            what changes once people use it.
          </p>
          <p>
            Some projects are personal products, some are client websites and
            some are experiments. They all belong here because they show the
            same thing: how I think and how I execute.
          </p>
          <div className="maker-page__links">
            <Link href="/projects">Explore the work ↗</Link>
            <Link href="/writing">Read the notes ↗</Link>
            <a href={`mailto:${site.author.email}`}>Email me ↗</a>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
