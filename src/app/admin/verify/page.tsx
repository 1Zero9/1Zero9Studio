"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"verifying" | "success" | "error">(() =>
    token ? "verifying" : "error"
  );
  const [errorMessage, setErrorMessage] = useState<string>(() =>
    token ? "" : "No login token was provided in the link."
  );

  useEffect(() => {
    if (!token) return;

    let ignore = false;

    async function performVerification() {
      try {
        const res = await fetch(
          `/api/admin/auth/verify?token=${encodeURIComponent(token!)}`,
          { redirect: "manual" }
        );

        if (res.ok || res.type === "opaqueredirect" || res.status === 307 || res.status === 302) {
          window.location.href = "/admin";
        } else {
          const data = await res.json().catch(() => ({}));
          if (!ignore) {
            setStatus("error");
            setErrorMessage(data.error || "Failed to verify magic link");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setStatus("error");
          setErrorMessage(
            err instanceof Error ? err.message : "Verification failed"
          );
        }
      }
    }

    performVerification();

    return () => {
      ignore = true;
    };
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-card text-center">
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <span className="size-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            <h2 className="text-xl font-bold text-fg">Verifying Magic Link...</h2>
            <p className="text-xs text-muted">Authenticating your 1Zero9 administrator session.</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-3xl">⚠️</span>
            <h2 className="text-xl font-bold text-fg">Authentication Failed</h2>
            <p className="text-xs text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/30">
              {errorMessage}
            </p>
            <Link
              href="/admin/login"
              className="mt-2 py-2.5 px-6 bg-fg text-bg font-semibold rounded-xl text-xs hover:opacity-90 transition-opacity"
            >
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <span className="size-4 rounded-full bg-signal animate-ping" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
