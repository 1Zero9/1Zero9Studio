import { CalculatorApp } from "@/components/admin/calculator/calculator-app";

export default function AdminCalculatorPage() {
  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Quote calculator</h1>
      <p className="mt-2 text-sm text-muted">
        Internal pricing tool. Not linked or exposed anywhere on the public site.
      </p>
      <div className="mt-10">
        <CalculatorApp />
      </div>
    </div>
  );
}
