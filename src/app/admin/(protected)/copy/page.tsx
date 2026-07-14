import { TextLink } from "@/components/ui/text-link";
import { prisma } from "@/lib/db";
import { saveSiteCopy } from "./actions";
import { copySlots } from "./slots";

export default async function AdminCopyPage() {
  const rows = await prisma.siteCopy.findMany();
  const values = new Map(rows.map((row) => [row.key, row.value]));

  return (
    <div>
      <TextLink href="/admin">back to projects</TextLink>
      <h1 className="mt-4 font-display text-3xl tracking-tight">Site copy</h1>
      <p className="mt-2 text-sm text-muted">
        Editable lines that appear on the public site. Empty fields are hidden
        from visitors entirely.
      </p>

      <form action={saveSiteCopy} className="mt-8 flex max-w-xl flex-col gap-6">
        {copySlots.map((slot) => (
          <div key={slot.key} className="flex flex-col gap-2">
            <label htmlFor={slot.key} className="font-mono text-xs tracking-wide text-faint">
              {slot.label}
            </label>
            <textarea
              id={slot.key}
              name={slot.key}
              rows={2}
              defaultValue={values.get(slot.key) ?? ""}
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
            />
            <p className="text-xs text-muted">{slot.hint}</p>
          </div>
        ))}
        <button
          type="submit"
          className="self-start rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-faint"
        >
          save
        </button>
      </form>
    </div>
  );
}
