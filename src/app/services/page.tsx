import Link from "next/link";
import { Container } from "@/components/layout/container";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Working together",
  description: "A short note on working with Stephen Cranfield.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <Container className="maker-page">
      <header className="maker-page__hero">
        <p>Working together</p>
        <h1>Good collaborations start with an <span>interesting problem.</span></h1>
      </header>
      <div className="maker-page__grid">
        <aside><p>No fixed packages</p><p>Direct collaboration</p><p>Idea to launch</p></aside>
        <div className="maker-page__copy">
          <p className="maker-page__lead">
            This is a portfolio, not a catalogue of services. But I do work with
            people when the idea and the fit are right.
          </p>
          <p>
            That might mean shaping and building a product, creating a website
            that does more than sit online, or exploring a useful application of
            AI. I work directly across the idea, interface and implementation.
          </p>
          <p>
            The best way to understand how I work is through the projects. The
            best way to start a conversation is simply to tell me what you’re
            thinking about.
          </p>
          <div className="maker-page__links">
            <Link href="/projects">See the work ↗</Link>
            <a href={`mailto:${site.author.email}`}>Start a conversation ↗</a>
          </div>
        </div>
      </div>
    </Container>
  );
}
