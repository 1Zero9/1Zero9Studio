"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid passcode");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-card">
        <div className="text-center mb-8">
          <span className="inline-block size-3 rounded-full bg-signal mb-3 animate-pulse" />
          <h1 className="text-2xl font-bold tracking-tight text-fg">1Zero9 Studio Admin</h1>
          <p className="text-sm text-muted mt-1">
            Project vetting, section management & thumbnail studio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="passcode"
              className="block text-xs font-mono uppercase tracking-wider text-muted mb-2"
            >
              Admin Passcode
            </label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode (default: 109studio)"
              required
              autoFocus
              className="w-full px-4 py-3 bg-bg-subtle border border-border rounded-xl text-fg placeholder:text-faint focus:outline-none focus:border-accent text-sm font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-fg text-bg font-semibold rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Authenticating..." : "Enter Admin Portal →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <Link
            href="/"
            className="text-xs text-muted hover:text-fg transition-colors"
          >
            ← Back to public portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
