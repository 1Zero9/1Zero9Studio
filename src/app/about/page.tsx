import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Meta } from "@/components/ui/meta";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "About",
  description:
    "Who I am, how I work, and how to reach me.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-16">
      <h1 className="font-display text-4xl tracking-tight">about</h1>

      <div className="mt-12 flex max-w-prose flex-col gap-6 text-fg">
        <p>
          I&apos;m {site.author.name}. I design and build products — AI
          systems, web platforms, automation, and the occasional game. 1Zero9
          is my workshop: the place where ideas get built, shipped, and
          written about honestly.
        </p>
        <p>
          I care about the whole stack of a product: the thinking before the
          first line of code, the architecture that keeps it maintainable,
          the design that makes it feel inevitable, and the details most
          people never notice. The projects here tell those stories in full —
          problems, decisions, and lessons included.
        </p>
        <p>
          The fastest way to reach me is email:{" "}
          <a
            href={`mailto:${site.author.email}`}
            className="underline decoration-faint underline-offset-4 transition-colors hover:decoration-fg"
          >
            {site.author.email}
          </a>
          .
        </p>
      </div>

      <Meta className="mt-16">
        curious how this site is built? see the{" "}
        <Link href="/colophon" className="underline underline-offset-4">
          colophon
        </Link>
      </Meta>
    </Container>
  );
}
