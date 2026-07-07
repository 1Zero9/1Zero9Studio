"use client";

import { useState } from "react";
import { addons, fmt, fmt2 } from "@/lib/calculator/data";
import type { CalculatorAction, CalculatorState } from "@/lib/calculator/use-calculator-state";

export function AddonsList({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}) {
  const [openDesc, setOpenDesc] = useState<Record<string, boolean>>({});

  return (
    <div className="divide-y divide-border">
      {addons.map((a) => {
        const on = state.addonOn[a.id] ?? false;
        const price = state.addonPrice[a.id] ?? a.min;
        const qty = state.addonQty[a.id] ?? 1;
        const rangeText = a.fixed ? fmt2(a.min) : `${fmt(a.min)}–${fmt(a.max)}`;

        return (
          <div key={a.id} className="flex gap-3 py-4">
            <input
              type="checkbox"
              checked={on}
              onChange={(e) =>
                dispatch({ type: "TOGGLE_ADDON", addonId: a.id, checked: e.target.checked })
              }
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-sm font-medium text-fg">{a.label}</span>
                  <span className="ml-2 font-mono text-xs text-faint">{a.unit}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDesc((prev) => ({ ...prev, [a.id]: !prev[a.id] }))
                    }
                    title="What's this?"
                    className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full border border-faint text-[10px] text-faint hover:border-fg hover:text-fg"
                  >
                    i
                  </button>
                </div>
                <div className="shrink-0 font-mono text-xs text-faint">
                  {rangeText}
                  {a.hasQty ? " ea" : ""}
                </div>
              </div>

              {openDesc[a.id] && (
                <p className="mt-2 text-sm text-muted">{a.desc}</p>
              )}

              {on && (
                <div className="mt-3 space-y-3">
                  {!a.fixed && (
                    <div>
                      <p className="text-xs text-faint">
                        Drag to set the exact price for this project — it starts in
                        the middle of the {fmt(a.min)}–{fmt(a.max)} range shown above,
                        higher for more work, lower for less.
                      </p>
                      <div className="mt-2 flex items-center gap-3 font-mono text-xs text-faint">
                        <span>{fmt(a.min)}</span>
                        <input
                          type="range"
                          min={a.min}
                          max={a.max}
                          step={5}
                          value={price}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_ADDON_PRICE",
                              addonId: a.id,
                              price: parseFloat(e.target.value),
                            })
                          }
                          className="flex-1 accent-[var(--accent)]"
                        />
                        <span>{fmt(a.max)}</span>
                      </div>
                      <div className="mt-1 font-mono text-xs text-fg">
                        Selected: <strong>{fmt(price)}</strong>
                        {a.hasQty ? " each" : ""}
                      </div>
                    </div>
                  )}

                  {a.hasQty && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">Quantity</span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch({ type: "SET_ADDON_QTY", addonId: a.id, qty: qty - 1 })
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-fg hover:border-faint"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-mono text-sm text-fg">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch({ type: "SET_ADDON_QTY", addonId: a.id, qty: qty + 1 })
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-fg hover:border-faint"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
