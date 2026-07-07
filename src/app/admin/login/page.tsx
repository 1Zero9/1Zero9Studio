"use client";

import { useActionState } from "react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { requestLoginLink } from "./actions";

export default function AdminLoginPage() {
  const [message, formAction, pending] = useActionState(requestLoginLink, null);

  return (
    <Container className="flex min-h-screen max-w-sm flex-col items-center justify-center gap-8">
      <Logo className="h-8 w-auto text-fg" />
      <form action={formAction} className="w-full space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="font-mono text-xs tracking-wide text-faint">
            admin email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoFocus
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg outline-none focus-visible:border-accent"
          />
        </div>
        <Button type="submit" disabled={pending} className="w-full justify-center">
          {pending ? "Sending…" : "Send sign-in link"}
        </Button>
        {message && <p className="text-sm text-muted">{message}</p>}
      </form>
    </Container>
  );
}
