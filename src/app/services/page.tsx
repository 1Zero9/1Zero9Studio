import { Container } from "@/components/layout/container";
import { TextLink } from "@/components/ui/text-link";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Bespoke AI systems and custom software, built around a real problem — not a generic tool or a template.",
  path: "/services",
});

const engagements = [
  {
    name: "Foundation",
    tagline: "A real presence, built for you",
    desc: "A clean, custom-designed site — the right starting point when a business needs more than a template with its logo swapped in. Content, structure, and copy built around how the business actually talks to its customers.",
  },
  {
    name: "Growth",
    tagline: "A platform that does work for you",
    desc: "Bookings, enquiries, content that updates itself, integrations with the tools already in use. For a business that's outgrown a brochure site and needs the site to actually run part of the operation.",
  },
  {
    name: "Bespoke Platform",
    tagline: "Custom-built, end to end",
    desc: "A real application: accounts, a proper database, custom logic, third-party integrations, an AI system where one earns its place. Built the way software should be built when off-the-shelf doesn't fit.",
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

export default function ServicesPage() {
  return (
    <Container className="py-16">
      <h1 className="max-w-3xl font-display text-4xl tracking-tight sm:text-5xl">
        Software built around your problem, not the other way around.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        A lot of &ldquo;AI-powered&rdquo; services on the market are the same
        wrapper around the same model, sold to everyone. 1Zero9 builds the
        thing your business actually needs — sometimes that includes AI,
        sometimes it&apos;s a well-built platform with none — and takes it from
        first conversation to something live and maintained.
      </p>

      <div className="mt-20">
        <SectionLabel>
          <span>how I engage</span>
        </SectionLabel>
        <div className="grid gap-6 sm:grid-cols-3">
          {engagements.map((e) => (
            <div key={e.name} className="rounded-md border border-border p-6">
              <p className="font-display text-xl tracking-tight">{e.name}</p>
              <p className="mt-1 font-mono text-xs tracking-wide text-faint">
                {e.tagline}
              </p>
              <p className="mt-4 text-sm text-muted">{e.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-sm text-faint">
          These are shapes, not fixed packages — every engagement gets scoped
          and priced against the specific project once we&apos;ve talked it
          through.
        </p>
      </div>

      <div className="mt-20">
        <SectionLabel>
          <span>how I work</span>
        </SectionLabel>
        <div className="max-w-2xl space-y-6 text-fg">
          <p>
            One person, accountable for the whole build — not a project
            handed between departments. You talk to the person actually
            writing the code, from the first call to the thing going live.
          </p>
          <p>
            Every engagement starts with understanding the actual problem,
            not pitching a pre-built solution. If the right answer is a
            simple site and no AI at all, that&apos;s what gets built.
          </p>
          <p>
            The <TextLink href="/projects">projects</TextLink> section is the
            honest record of that: real builds, the decisions behind them,
            and what they taught me.
          </p>
        </div>
      </div>

      <div className="mt-20 border-t border-border pt-16">
        <p className="max-w-3xl font-display text-3xl leading-snug tracking-tight sm:text-4xl">
          Have a project in mind?{" "}
          <a
            href={`mailto:${site.author.email}`}
            className="underline decoration-accent underline-offset-8 transition-colors hover:text-muted"
          >
            Say hello.
          </a>
        </p>
      </div>
    </Container>
  );
}
