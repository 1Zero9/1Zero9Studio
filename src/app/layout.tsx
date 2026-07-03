import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1Zero9",
  description: "The digital workshop of Stephen Cranfield.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
