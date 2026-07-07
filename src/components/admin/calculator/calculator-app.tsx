"use client";

import { AddonsList } from "@/components/admin/calculator/addons-list";
import { QuoteSheet } from "@/components/admin/calculator/quote-sheet";
import { TierPicker } from "@/components/admin/calculator/tier-picker";
import { useCalculatorState } from "@/lib/calculator/use-calculator-state";

export function CalculatorApp() {
  const [state, dispatch] = useCalculatorState();

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-10">
        <section>
          <h2 className="font-mono text-xs tracking-wide text-faint">tier</h2>
          <div className="mt-4">
            <TierPicker state={state} dispatch={dispatch} />
          </div>
        </section>
        <section>
          <h2 className="font-mono text-xs tracking-wide text-faint">add-ons</h2>
          <div className="mt-4">
            <AddonsList state={state} dispatch={dispatch} />
          </div>
        </section>
      </div>
      <div className="lg:sticky lg:top-10 lg:self-start">
        <QuoteSheet state={state} dispatch={dispatch} />
      </div>
    </div>
  );
}
