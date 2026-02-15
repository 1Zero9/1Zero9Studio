'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-bold">We hit a runtime error</h1>
        <p className="mt-2 text-sm text-slate-600">
          Try again. If this keeps happening, refresh the page or restart the dev server.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
