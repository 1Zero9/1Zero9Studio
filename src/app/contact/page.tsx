import Link from "next/link";
import { Container } from "@/components/layout/container";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with Stephen Cranfield.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="maker-page">
      <header className="maker-page__hero">
        <p>Contact / Dublin</p>
        <h1>Have an idea you can’t stop <span>thinking about?</span></h1>
      </header>
      <div className="maker-page__grid">
        <aside><p>The inbox is open</p></aside>
        <div className="maker-page__copy">
          <p className="maker-page__lead">
            Tell me what it is, who it’s for, and why you think it should exist.
          </p>
          <a className="maker-page__email" href={`mailto:${site.author.email}`}>
            {site.author.email} ↗
          </a>
          <div className="maker-page__links"><Link href="/projects">See what I’ve made ↗</Link></div>
        </div>
      </div>
    </Container>
  );
}
