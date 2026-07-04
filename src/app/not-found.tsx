import { Container } from "@/components/layout/container";
import { TextLink } from "@/components/ui/text-link";
import { Meta } from "@/components/ui/meta";

export default function NotFound() {
  return (
    <Container className="py-24">
      <Meta>404</Meta>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        Signal lost.
      </h1>
      <p className="mt-4 max-w-prose text-muted">
        This page doesn&apos;t exist — or it lived on the old site, which has
        been archived.
      </p>
      <p className="mt-8 text-sm">
        <TextLink href="/">back to the workshop</TextLink>
      </p>
    </Container>
  );
}
