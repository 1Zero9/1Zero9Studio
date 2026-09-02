import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/brand/logo";
import { ContactForm } from "@/components/contact/contact-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact 1Zero9 Studio",
  description: "Get in touch with 1Zero9 Studio.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <header className="mb-12">
        <p className="font-mono text-xs text-signal-text uppercase tracking-wider mb-3">
          Contact / Get in Touch
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight">
          Have a project or problem you’d like to <span className="text-signal-text">explore?</span>
        </h1>
      </header>

      <div className="p-8 md:p-12 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
        <div className="flex flex-col gap-4 max-w-xl">
          <Logo className="h-8 w-auto text-signal" />
          <h2 className="text-2xl font-bold text-fg">Let’s start a conversation.</h2>
          <p className="text-muted leading-relaxed">
            Whether you want to discuss a new digital product, a website collaboration, an AI workflow experiment, or general engineering questions — fill out the form below and I&apos;ll get back to you.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <Link
            href="/projects"
            className="btn-secondary justify-center text-center w-full"
          >
            <span>Explore Work First</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 p-8 md:p-12 rounded-3xl bg-surface border border-border shadow-xl">
        <h2 className="text-xl font-bold text-fg mb-1">Send a message</h2>
        <p className="text-muted text-sm mb-6">
          Fill this out and it&apos;ll land straight in my inbox.
        </p>
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
