import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Builder - 1Zero9 Studio",
  description: "Build your dream website in minutes with our AI-assisted design wizard.",
};

export default function BuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
