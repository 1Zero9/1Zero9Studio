'use client';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 p-8 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">Application error</p>
          <h1 className="mt-2 text-2xl font-bold">A critical error occurred</h1>
          <p className="mt-2 text-sm text-slate-600">
            Please refresh the page. If the problem persists, restart the app.
          </p>
          <p className="mt-3 text-xs text-slate-500">{error.message}</p>
        </div>
      </body>
    </html>
  );
}
