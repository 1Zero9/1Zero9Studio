import type { Metadata, Viewport } from "next";
import "./globals.css";
import MainApp from "../components/MainApp";
import ConditionalNavigation from "../components/ConditionalNavigation";

export const metadata: Metadata = {
  title: "1Zero9 Studio - Design. Code. Launch.",
  description: "Smart design, precision delivery, simplicity. The future of creative design — built today.",
  keywords: "web design, branding, UI/UX, development, creative studio",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.puter.com/v2/" defer></script>
      </head>
      <body className="bg-surface text-ink font-inter antialiased">
        <ConditionalNavigation />
        <MainApp>
          {children}
        </MainApp>
      </body>
    </html>
  );
}
