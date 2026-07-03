import { Container } from "@/components/layout/container";

export default function Home() {
  return (
    <Container className="py-24">
      <h1 className="font-display text-5xl tracking-tight">
        A quiet place where ideas become products.
      </h1>
      <p className="mt-6 max-w-prose text-muted">
        The digital workshop of Stephen Cranfield. Rebuilding — the real
        homepage lands in Phase 4.
      </p>
    </Container>
  );
}
