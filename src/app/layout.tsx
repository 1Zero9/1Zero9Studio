import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainApp from "../components/MainApp";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "1Zero9 Studio",
  description: "Professional web development and management services.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainApp>
          {children}
        </MainApp>
      </body>
    </html>
  );
}