import Image from "next/image";
import { notFound } from "next/navigation";
import { Meta } from "@/components/ui/meta";
import { TextLink } from "@/components/ui/text-link";
import { getProject, getProjectLinks, getProjectMedia } from "@/lib/content";
import {
  addProjectLink,
  addProjectMedia,
  deleteProjectLink,
  deleteProjectMedia,
  moveProjectLink,
  moveProjectMedia,
} from "./actions";

type Params = { slug: string };

export default async function AdminProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const [media, links] = await Promise.all([
    getProjectMedia(slug),
    getProjectLinks(slug),
  ]);

  return (
    <div>
      <TextLink href="/admin">back to projects</TextLink>
      <h1 className="mt-4 font-display text-3xl tracking-tight">{project.title}</h1>
      <Meta className="mt-1">{project.slug}</Meta>

      <section className="mt-10">
        <h2 className="font-mono text-xs tracking-wide text-faint">screenshots</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {media.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="overflow-hidden rounded-md border border-border">
                <Image src={item.url} alt={item.alt} width={400} height={250} className="w-full" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="truncate text-muted">{item.alt}</span>
                <div className="flex shrink-0 gap-2">
                  <form action={moveProjectMedia.bind(null, slug, item.id, "up")}>
                    <button type="submit" className="text-faint hover:text-fg">↑</button>
                  </form>
                  <form action={moveProjectMedia.bind(null, slug, item.id, "down")}>
                    <button type="submit" className="text-faint hover:text-fg">↓</button>
                  </form>
                  <form action={deleteProjectMedia.bind(null, slug, item.id)}>
                    <button type="submit" className="text-faint hover:text-accent">
                      delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form
          action={addProjectMedia.bind(null, slug)}
          className="mt-6 flex flex-wrap items-end gap-3"
        >
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm text-muted"
          />
          <input
            type="text"
            name="alt"
            placeholder="alt text"
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          />
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-faint"
          >
            upload
          </button>
        </form>
      </section>

      <section className="mt-12 border-t border-border pt-10">
        <h2 className="font-mono text-xs tracking-wide text-faint">links</h2>
        <ul className="mt-4 divide-y divide-border">
          {links.map((link) => (
            <li key={link.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{link.label}</p>
                <p className="truncate text-xs text-faint">
                  {link.url}
                  {link.kind ? ` · ${link.kind}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 text-xs">
                <form action={moveProjectLink.bind(null, slug, link.id, "up")}>
                  <button type="submit" className="text-faint hover:text-fg">↑</button>
                </form>
                <form action={moveProjectLink.bind(null, slug, link.id, "down")}>
                  <button type="submit" className="text-faint hover:text-fg">↓</button>
                </form>
                <form action={deleteProjectLink.bind(null, slug, link.id)}>
                  <button type="submit" className="text-faint hover:text-accent">
                    delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
        <form
          action={addProjectLink.bind(null, slug)}
          className="mt-6 flex flex-wrap items-end gap-3"
        >
          <input
            type="text"
            name="label"
            placeholder="label"
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          />
          <input
            type="url"
            name="url"
            placeholder="https://…"
            required
            className="min-w-[16rem] rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          />
          <input
            type="text"
            name="kind"
            placeholder="kind (optional)"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          />
          <button
            type="submit"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-faint"
          >
            add link
          </button>
        </form>
      </section>
    </div>
  );
}
