"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to send message");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 rounded-2xl bg-signal/10 border border-signal/30 text-center">
        <p className="text-signal-text font-semibold">Message sent — thanks for reaching out!</p>
        <p className="text-muted text-sm mt-1">I&apos;ll get back to you as soon as I can.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs font-mono text-muted hover:text-fg underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot field — hidden from real visitors, catches simple bots */}
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      <div>
        <label htmlFor="contact-name" className="block text-xs font-mono uppercase text-muted mb-1.5">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 bg-bg-subtle border border-border rounded-xl text-sm text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-xs font-mono uppercase text-muted mb-1.5">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-bg-subtle border border-border rounded-xl text-sm text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-mono uppercase text-muted mb-1.5">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          minLength={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell me a bit about what you're working on..."
          className="w-full px-4 py-3 bg-bg-subtle border border-border rounded-xl text-sm text-fg placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
        />
      </div>

      {status === "error" && error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary justify-center text-center w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span>{status === "submitting" ? "Sending..." : "Send Message"}</span>
        {status !== "submitting" && <span aria-hidden="true">↗</span>}
      </button>
    </form>
  );
}
