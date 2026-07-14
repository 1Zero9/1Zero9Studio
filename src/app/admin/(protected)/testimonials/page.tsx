import { Meta } from "@/components/ui/meta";
import { TextLink } from "@/components/ui/text-link";
import { allProjects } from "@/lib/content";
import { prisma } from "@/lib/db";
import {
  addTestimonial,
  deleteTestimonial,
  moveTestimonial,
  toggleTestimonialPublished,
} from "./actions";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <TextLink href="/admin">back to projects</TextLink>
      <h1 className="mt-4 font-display text-3xl tracking-tight">Testimonials</h1>
      <p className="mt-2 text-sm text-muted">
        Published testimonials appear on the homepage in order. Unpublished
        ones are drafts only you can see.
      </p>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {testimonials.map((t) => (
          <li key={t.id} className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-sm">&ldquo;{t.quote}&rdquo;</p>
              <Meta className="mt-2">
                {t.author}
                {t.role ? ` · ${t.role}` : ""}
                {t.projectSlug ? ` · ${t.projectSlug}` : ""}
                {" · "}
                <span className={t.published ? "text-accent" : ""}>
                  {t.published ? "published" : "draft"}
                </span>
              </Meta>
            </div>
            <div className="flex shrink-0 gap-2 text-xs">
              <form action={moveTestimonial.bind(null, t.id, "up")}>
                <button type="submit" className="text-faint hover:text-fg">↑</button>
              </form>
              <form action={moveTestimonial.bind(null, t.id, "down")}>
                <button type="submit" className="text-faint hover:text-fg">↓</button>
              </form>
              <form action={toggleTestimonialPublished.bind(null, t.id)}>
                <button type="submit" className="text-faint hover:text-fg">
                  {t.published ? "unpublish" : "publish"}
                </button>
              </form>
              <form action={deleteTestimonial.bind(null, t.id)}>
                <button type="submit" className="text-faint hover:text-accent">
                  delete
                </button>
              </form>
            </div>
          </li>
        ))}
        {testimonials.length === 0 && (
          <li className="py-4 text-sm text-muted">No testimonials yet.</li>
        )}
      </ul>

      <form action={addTestimonial} className="mt-8 flex max-w-xl flex-col gap-3">
        <textarea
          name="quote"
          placeholder="quote"
          required
          rows={3}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
        />
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            name="author"
            placeholder="author"
            required
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          />
          <input
            type="text"
            name="role"
            placeholder="role / company (optional)"
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          />
          <select
            name="projectSlug"
            aria-label="linked project"
            defaultValue=""
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          >
            <option value="">no linked project</option>
            {allProjects.map((project) => (
              <option key={project.slug} value={project.slug}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="self-start rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-faint"
        >
          add testimonial (as draft)
        </button>
      </form>
    </div>
  );
}
