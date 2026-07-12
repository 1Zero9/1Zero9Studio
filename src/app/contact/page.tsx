import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch about a project — email is the fastest way to reach me.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl tracking-tight">contact</h1>

      <div className="mt-12 flex max-w-prose flex-col gap-6">
        <p className="max-w-2xl font-display text-3xl leading-snug tracking-tight sm:text-4xl">
          Building something interesting?{" "}
          <a
            href={`mailto:${site.author.email}`}
            className="underline decoration-accent underline-offset-8 transition-colors hover:text-muted"
          >
            Say hello.
          </a>
        </p>
        <p className="text-fg">
          Tell me a bit about the problem you&apos;re solving and where
          you are with it — that&apos;s usually enough to start a real
          conversation.
        </p>
      </div>

      <Meta className="mt-16">
        want the longer version first? see{" "}
        <Link href="/about" className="underline underline-offset-4">
          about
        </Link>{" "}
        or{" "}
        <Link href="/services" className="underline underline-offset-4">
          services
        </Link>
      </Meta>
    </Container>
  );
}
