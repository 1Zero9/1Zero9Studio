"use client";

import { useState } from "react";
import { fmt } from "@/lib/calculator/data";
import type { CalculatorAction, CalculatorState } from "@/lib/calculator/use-calculator-state";
import { computeQuote } from "@/lib/calculator/use-calculator-state";

export function QuoteSheet({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}) {
  const [clientName, setClientName] = useState("");
  const [note, setNote] = useState("");
  const quote = computeQuote(state);

  return (
    <div className="rounded-md border border-border p-5">
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Client / project name"
          className="min-w-0 flex-1 border-b border-transparent bg-transparent text-sm font-medium text-fg outline-none placeholder:text-faint focus-visible:border-border"
        />
        <span className="shrink-0 rounded-full border border-accent px-2 py-0.5 font-mono text-[10px] tracking-wide text-accent">
          {quote.tier.name.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <p className="font-mono text-xs tracking-wide text-faint">One-off (setup)</p>
        {quote.oneOffLines.map((l) => (
          <div key={l.name} className="flex justify-between text-sm">
            <span className="text-muted">{l.name}</span>
            <span className="font-mono text-fg">{fmt(l.amt)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1">
        <p className="font-mono text-xs tracking-wide text-faint">Monthly recurring</p>
        {quote.monthlyLines.map((l) => (
          <div key={l.name} className="flex justify-between text-sm">
            <span className="text-muted">{l.name}</span>
            <span className="font-mono text-fg">{fmt(l.amt)}/mo</span>
          </div>
        ))}
      </div>

      {quote.annualLines.length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="font-mono text-xs tracking-wide text-faint">Annual recurring</p>
          {quote.annualLines.map((l) => (
            <div key={l.name} className="flex justify-between text-sm">
              <span className="text-muted">{l.name}</span>
              <span className="font-mono text-fg">{fmt(l.amt)}/yr</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs text-muted">Discount</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "SET_DISCOUNT", discount: state.discount - 5 })
              }
              className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-fg hover:border-faint"
            >
              −
            </button>
            <span className="w-10 text-center font-mono text-sm text-fg">
              {state.discount}%
            </span>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "SET_DISCOUNT", discount: state.discount + 5 })
              }
              className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-fg hover:border-faint"
            >
              +
            </button>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={40}
          value={state.discount}
          onChange={(e) =>
            dispatch({ type: "SET_DISCOUNT", discount: parseInt(e.target.value, 10) })
          }
          className="mt-2 w-full accent-[var(--accent)]"
        />

        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted">One-off subtotal</span>
          <span className="font-mono text-fg">{fmt(quote.oneOffTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Monthly subtotal</span>
          <span className="font-mono text-fg">{fmt(quote.monthlyTotal)}/mo</span>
        </div>
        {state.discount > 0 && (
          <div className="flex justify-between text-sm text-accent">
            <span>Discount ({state.discount}%)</span>
            <span className="font-mono">
              −{fmt(quote.oneOffTotal - quote.oneOffAfter)} / −
              {fmt(quote.monthlyTotal - quote.monthlyAfter)} mo
            </span>
          </div>
        )}

        <p className="mt-4 font-mono text-xs tracking-wide text-faint">Year 1 total</p>
        <p className="font-display text-3xl tracking-tight text-fg">
          {fmt(Math.round(quote.year1))}
        </p>
        <p className="text-xs text-faint">
          Setup + 12 months care
          {quote.annualTotal > 0 ? " + annual items" : ""}, after discount
        </p>

        <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted">Year 2 onward</span>
          <span className="font-mono text-fg">{fmt(Math.round(quote.year2plus))}/yr</span>
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notes (not printed elsewhere on the sheet)"
        rows={2}
        className="mt-5 w-full rounded-md border border-border bg-surface p-2 text-sm text-fg outline-none placeholder:text-faint focus-visible:border-accent"
      />

      <div className="mt-4 flex gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-fg px-4 py-2 text-sm font-medium text-bg hover:bg-muted"
        >
          Print / Save PDF
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "RESET" })}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-fg hover:border-faint"
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-xs text-faint">
        Estimate only, based on the July 2026 pricing framework. Tier 3 (Bespoke
        Platform) infrastructure cost scales with usage — confirm final figures before
        quoting in writing.
      </p>
    </div>
  );
}
