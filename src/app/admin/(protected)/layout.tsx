import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { getAdminSession } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <Container className="flex items-center justify-between py-4">
          <a href="/admin" className="flex items-center gap-2">
            <Logo className="h-5 w-auto text-fg" />
            <span className="font-mono text-xs tracking-wide text-faint">admin</span>
          </a>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="font-mono text-xs tracking-wide text-faint hover:text-fg"
            >
              sign out
            </button>
          </form>
        </Container>
      </header>
      <Container className="py-10">{children}</Container>
    </div>
  );
}
