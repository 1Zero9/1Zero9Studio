"use client";

import { fmt, tiers } from "@/lib/calculator/data";
import type { CalculatorAction, CalculatorState } from "@/lib/calculator/use-calculator-state";
import { getTierPos } from "@/lib/calculator/use-calculator-state";

export function TierPicker({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}) {
  return (
    <div className="space-y-4">
      {tiers.map((t) => {
        const active = state.tier === t.id;
        const pos = getTierPos(state, t);
        const setupVal = Math.round(t.setupMin + (t.setupMax - t.setupMin) * pos);
        const monthlyVal = Math.round(
          t.monthlyMin + (t.monthlyMax - t.monthlyMin) * pos,
        );
        const manual = state.tierManual[t.id]!;
        const checkedCount = (state.tierFactors[t.id] ?? []).filter(Boolean).length;

        return (
          <div
            key={t.id}
            onClick={() => dispatch({ type: "SELECT_TIER", tierId: t.id })}
            className={`cursor-pointer rounded-md border p-4 transition-colors ${
              active ? "border-accent" : "border-border hover:border-faint"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-medium text-fg">{t.name}</div>
                <div className="mt-1 text-sm text-muted">{t.desc}</div>
              </div>
              <div className="shrink-0 text-right font-mono text-xs text-faint">
                {fmt(t.setupMin)}–{fmt(t.setupMax)}
                <br />+ {fmt(t.monthlyMin)}–{fmt(t.monthlyMax)}/mo
              </div>
            </div>

            {active && (
              <div
                className="mt-4 space-y-4 border-t border-border pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-xs text-faint">
                  Tick what actually applies to this project — the price is calculated
                  from how many of these are true, not a guess.
                </p>
                <div className="space-y-2">
                  {t.factors.map((f, i) => (
                    <label
                      key={f}
                      className="flex items-center gap-2 text-sm text-fg"
                    >
                      <input
                        type="checkbox"
                        checked={state.tierFactors[t.id]?.[i] ?? false}
                        disabled={manual.on}
                        onChange={(e) =>
                          dispatch({
                            type: "TOGGLE_FACTOR",
                            tierId: t.id,
                            index: i,
                            checked: e.target.checked,
                          })
                        }
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <div className="font-mono text-xs text-faint">
                    {manual.on
                      ? "Manual override active"
                      : `Calculated from ${checkedCount} of ${t.factors.length} factors checked`}
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-surface">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${pos * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-xs text-faint">
                    <span>{fmt(t.setupMin)}</span>
                    <span>{fmt(t.setupMax)}</span>
                  </div>
                </div>

                {manual.on && (
                  <div className="flex items-center gap-3 font-mono text-xs text-faint">
                    <span>{fmt(t.setupMin)}</span>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={manual.pos}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_MANUAL_POS",
                          tierId: t.id,
                          pos: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 accent-[var(--accent)]"
                    />
                    <span>{fmt(t.setupMax)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Setup fee</span>
                  <strong className="text-fg">{fmt(setupVal)}</strong>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Monthly care plan</span>
                  <strong className="text-fg">{fmt(monthlyVal)}/mo</strong>
                </div>

                <label className="flex items-center gap-2 text-xs text-faint">
                  <input
                    type="checkbox"
                    checked={manual.on}
                    onChange={(e) =>
                      dispatch({
                        type: "TOGGLE_MANUAL_OVERRIDE",
                        tierId: t.id,
                        checked: e.target.checked,
                      })
                    }
                  />
                  <span>
                    Override — I know this project doesn&apos;t fit the checklist, let
                    me set the price directly
                  </span>
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
