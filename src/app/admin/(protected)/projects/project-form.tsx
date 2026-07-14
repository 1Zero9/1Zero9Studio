"use client";

import { useActionState } from "react";

export type ProjectFormState = { error: string } | null;

export type ProjectFormDefaults = {
  title?: string;
  summary?: string;
  date?: string;
  updated?: string;
  tags?: string[];
  status?: string;
  order?: number;
  url?: string;
  repo?: string;
  cover?: string;
  coverAlt?: string;
  draft?: boolean;
  body?: string;
};

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent";
const labelClass = "block font-mono text-xs tracking-wide text-faint";

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className={labelClass}>{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </label>
  );
}

export function ProjectForm({
  action,
  defaults = {},
  sha,
  withSlugField = false,
  submitLabel,
}: {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  defaults?: ProjectFormDefaults;
  sha?: string;
  withSlugField?: boolean;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-8 max-w-3xl space-y-6">
      {sha && <input type="hidden" name="sha" value={sha} />}

      <div className="grid gap-6 sm:grid-cols-2">
        {withSlugField && (
          <Field
            label="slug"
            hint="Lowercase kebab-case — becomes the URL: /projects/<slug>. Can't be changed later."
            className="sm:col-span-2"
          >
            <input
              type="text"
              name="slug"
              required
              pattern="[a-z0-9-]+"
              placeholder="my-new-project"
              className={inputClass}
            />
          </Field>
        )}

        <Field label="title" className="sm:col-span-2">
          <input
            type="text"
            name="title"
            required
            maxLength={80}
            defaultValue={defaults.title}
            className={inputClass}
          />
        </Field>

        <Field
          label="summary"
          hint="One or two sentences shown on cards and at the top of the case study."
          className="sm:col-span-2"
        >
          <textarea
            name="summary"
            required
            maxLength={200}
            rows={2}
            defaultValue={defaults.summary}
            className={inputClass}
          />
        </Field>

        <Field label="date">
          <input
            type="date"
            name="date"
            required
            defaultValue={defaults.date}
            className={inputClass}
          />
        </Field>

        <Field label="updated (optional)">
          <input
            type="date"
            name="updated"
            defaultValue={defaults.updated}
            className={inputClass}
          />
        </Field>

        <Field label="tags" hint="Comma-separated, lowercase kebab-case — e.g. web, ai, business">
          <input
            type="text"
            name="tags"
            defaultValue={defaults.tags?.join(", ")}
            className={inputClass}
          />
        </Field>

        <Field label="status">
          <select
            name="status"
            defaultValue={defaults.status ?? "active"}
            className={inputClass}
          >
            <option value="featured">featured</option>
            <option value="active">active</option>
            <option value="archived">archived</option>
          </select>
        </Field>

        <Field label="order (optional)" hint="Lower numbers appear first.">
          <input
            type="number"
            name="order"
            defaultValue={defaults.order}
            className={inputClass}
          />
        </Field>

        <Field label="live url (optional)">
          <input
            type="url"
            name="url"
            placeholder="https://…"
            defaultValue={defaults.url}
            className={inputClass}
          />
        </Field>

        <Field label="repo url (optional)">
          <input
            type="url"
            name="repo"
            placeholder="https://github.com/…"
            defaultValue={defaults.repo}
            className={inputClass}
          />
        </Field>

        <Field
          label="cover image path or URL"
          hint="Leave empty for no cover, or upload a new image below to replace it."
        >
          <input type="text" name="cover" defaultValue={defaults.cover} className={inputClass} />
        </Field>

        <Field label="cover alt text" hint="Required whenever a cover is set.">
          <input
            type="text"
            name="coverAlt"
            defaultValue={defaults.coverAlt}
            className={inputClass}
          />
        </Field>

        <Field label="upload new cover (optional)" className="sm:col-span-2">
          <input type="file" name="coverFile" accept="image/*" className="text-sm text-muted" />
        </Field>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="draft" defaultChecked={defaults.draft} />
        <span className="text-sm text-muted">draft — hidden from the public site</span>
      </label>

      <Field
        label="case study body (markdown)"
        hint="Markdown with ## headings, lists and **bold** — same format as the existing case studies."
      >
        <textarea
          name="body"
          required
          rows={22}
          defaultValue={defaults.body}
          className={`${inputClass} font-mono text-xs leading-relaxed`}
        />
      </Field>

      {state?.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:border-faint disabled:opacity-50"
        >
          {isPending ? "saving…" : submitLabel}
        </button>
        <p className="text-xs text-faint">
          Saving commits to GitHub and redeploys the site — live in ~2–3 minutes.
        </p>
      </div>
    </form>
  );
}
