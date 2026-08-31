"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [authMode, setAuthMode] = useState<"magic" | "passcode">("magic");
  const [email, setEmail] = useState("onezeronine@gmail.com");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null);
  const router = useRouter();

  async function handleMagicLinkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setDevMagicLink(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send magic link");
      }

      setSuccessMessage(data.message || `Magic link sent to ${email}!`);
      if (data.magicLinkUrl) {
        setDevMagicLink(data.magicLinkUrl);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasscodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
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
            Project vetting, section routing & thumbnail studio
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-bg-subtle border border-border rounded-xl p-1 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("magic");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === "magic"
                ? "bg-surface text-fg shadow-sm border border-border"
                : "text-muted hover:text-fg"
            }`}
          >
            ✉️ Magic Link Email
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("passcode");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              authMode === "passcode"
                ? "bg-surface text-fg shadow-sm border border-border"
                : "text-muted hover:text-fg"
            }`}
          >
            🔑 Passcode Access
          </button>
        </div>

        {authMode === "magic" ? (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-mono uppercase tracking-wider text-muted mb-2"
              >
                Admin Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="onezeronine@gmail.com"
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

            {successMessage && (
              <div className="p-3 bg-signal/15 border border-signal/40 rounded-xl text-xs text-fg">
                <p className="font-semibold mb-1">✓ Check your inbox</p>
                <p className="text-muted">{successMessage}</p>
                {devMagicLink && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <span className="text-[10px] text-muted block mb-1">Direct link (Local preview):</span>
                    <a
                      href={devMagicLink}
                      className="text-xs text-accent hover:underline font-mono break-all"
                    >
                      Click here to authenticate →
                    </a>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-fg text-bg font-semibold rounded-xl text-sm transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending link..." : "Send Magic Login Link →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
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
              {loading ? "Authenticating..." : "Enter with Passcode →"}
            </button>
          </form>
        )}

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
