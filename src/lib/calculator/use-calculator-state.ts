import { useReducer } from "react";
import { addons, tiers, type Tier } from "./data";

export type CalculatorState = {
  tier: string;
  tierFactors: Record<string, boolean[]>;
  tierManual: Record<string, { on: boolean; pos: number }>;
  addonOn: Record<string, boolean>;
  addonPrice: Record<string, number>;
  addonQty: Record<string, number>;
  discount: number;
};

export type CalculatorAction =
  | { type: "SELECT_TIER"; tierId: string }
  | { type: "TOGGLE_FACTOR"; tierId: string; index: number; checked: boolean }
  | { type: "TOGGLE_MANUAL_OVERRIDE"; tierId: string; checked: boolean }
  | { type: "SET_MANUAL_POS"; tierId: string; pos: number }
  | { type: "TOGGLE_ADDON"; addonId: string; checked: boolean }
  | { type: "SET_ADDON_PRICE"; addonId: string; price: number }
  | { type: "SET_ADDON_QTY"; addonId: string; qty: number }
  | { type: "SET_DISCOUNT"; discount: number }
  | { type: "RESET" };

export function getTierPos(state: CalculatorState, tier: Tier) {
  const manual = state.tierManual[tier.id];
  if (manual?.on) return manual.pos;
  const checked = (state.tierFactors[tier.id] ?? []).filter(Boolean).length;
  return tier.factors.length ? checked / tier.factors.length : 0;
}

export function initCalculatorState(): CalculatorState {
  const tierFactors: Record<string, boolean[]> = {};
  const tierManual: Record<string, { on: boolean; pos: number }> = {};
  tiers.forEach((t) => {
    tierFactors[t.id] = t.factors.map(() => false);
    tierManual[t.id] = { on: false, pos: 0.3 };
  });

  const addonOn: Record<string, boolean> = {};
  const addonPrice: Record<string, number> = {};
  const addonQty: Record<string, number> = {};
  addons.forEach((a) => {
    addonOn[a.id] = false;
    addonPrice[a.id] = (a.min + a.max) / 2;
    addonQty[a.id] = 1;
  });

  return {
    tier: "foundation",
    tierFactors,
    tierManual,
    addonOn,
    addonPrice,
    addonQty,
    discount: 0,
  };
}

function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case "SELECT_TIER":
      return { ...state, tier: action.tierId };

    case "TOGGLE_FACTOR": {
      const factors = [...(state.tierFactors[action.tierId] ?? [])];
      factors[action.index] = action.checked;
      return {
        ...state,
        tierFactors: { ...state.tierFactors, [action.tierId]: factors },
      };
    }

    case "TOGGLE_MANUAL_OVERRIDE": {
      const tier = tiers.find((t) => t.id === action.tierId);
      const pos = tier
        ? getTierPos(state, tier)
        : state.tierManual[action.tierId]?.pos ?? 0.3;
      return {
        ...state,
        tierManual: {
          ...state.tierManual,
          [action.tierId]: {
            on: action.checked,
            pos: action.checked ? pos : state.tierManual[action.tierId]?.pos ?? pos,
          },
        },
      };
    }

    case "SET_MANUAL_POS":
      return {
        ...state,
        tierManual: {
          ...state.tierManual,
          [action.tierId]: { ...state.tierManual[action.tierId]!, pos: action.pos },
        },
      };

    case "TOGGLE_ADDON":
      return {
        ...state,
        addonOn: { ...state.addonOn, [action.addonId]: action.checked },
      };

    case "SET_ADDON_PRICE":
      return {
        ...state,
        addonPrice: { ...state.addonPrice, [action.addonId]: action.price },
      };

    case "SET_ADDON_QTY":
      return {
        ...state,
        addonQty: {
          ...state.addonQty,
          [action.addonId]: Math.max(1, action.qty),
        },
      };

    case "SET_DISCOUNT":
      return { ...state, discount: Math.min(40, Math.max(0, action.discount)) };

    case "RESET":
      return initCalculatorState();

    default:
      return state;
  }
}

export function useCalculatorState() {
  return useReducer(calculatorReducer, undefined, initCalculatorState);
}

export type QuoteLine = { name: string; amt: number };

export type Quote = {
  tier: Tier;
  tierSetup: number;
  tierMonthly: number;
  oneOffLines: QuoteLine[];
  monthlyLines: QuoteLine[];
  annualLines: QuoteLine[];
  oneOffTotal: number;
  monthlyTotal: number;
  annualTotal: number;
  oneOffAfter: number;
  monthlyAfter: number;
  year1: number;
  year2plus: number;
};

export function computeQuote(state: CalculatorState): Quote {
  const tier = tiers.find((t) => t.id === state.tier) ?? tiers[0]!;
  const pos = getTierPos(state, tier);
  const tierSetup = Math.round(tier.setupMin + (tier.setupMax - tier.setupMin) * pos);
  const tierMonthly = Math.round(
    tier.monthlyMin + (tier.monthlyMax - tier.monthlyMin) * pos,
  );

  const oneOffLines: QuoteLine[] = [{ name: `${tier.name} — setup`, amt: tierSetup }];
  const monthlyLines: QuoteLine[] = [
    { name: `${tier.name} — monthly care`, amt: tierMonthly },
  ];
  const annualLines: QuoteLine[] = [];

  let oneOffTotal = tierSetup;
  let monthlyTotal = tierMonthly;
  let annualTotal = 0;

  addons.forEach((a) => {
    if (!state.addonOn[a.id]) return;
    const qty = a.hasQty ? state.addonQty[a.id]! : 1;
    const unitPrice = a.fixed ? a.min : state.addonPrice[a.id]!;
    const total = unitPrice * qty;

    if (a.id === "domain") {
      annualLines.push({ name: a.label + (qty > 1 ? ` ×${qty}` : ""), amt: total });
      annualTotal += total;
    } else if (a.id === "email") {
      monthlyLines.push({
        name: `${a.label}${qty > 1 ? ` ×${qty}` : ""}`,
        amt: unitPrice * qty,
      });
      monthlyTotal += unitPrice * qty;
      const setupFee = 50 * qty;
      oneOffLines.push({ name: `Email setup (${qty} mailbox${qty > 1 ? "es" : ""})`, amt: setupFee });
      oneOffTotal += setupFee;
    } else if (a.unit === "monthly") {
      monthlyLines.push({ name: `${a.label}${qty > 1 ? ` ×${qty}` : ""}`, amt: total });
      monthlyTotal += total;
    } else {
      oneOffLines.push({ name: `${a.label}${qty > 1 ? ` ×${qty}` : ""}`, amt: total });
      oneOffTotal += total;
    }
  });

  const discountMult = 1 - state.discount / 100;
  const oneOffAfter = oneOffTotal * discountMult;
  const monthlyAfter = monthlyTotal * discountMult;
  const year1 = oneOffAfter + monthlyAfter * 12 + annualTotal;
  const year2plus = monthlyAfter * 12 + annualTotal;

  return {
    tier,
    tierSetup,
    tierMonthly,
    oneOffLines,
    monthlyLines,
    annualLines,
    oneOffTotal,
    monthlyTotal,
    annualTotal,
    oneOffAfter,
    monthlyAfter,
    year1,
    year2plus,
  };
}
