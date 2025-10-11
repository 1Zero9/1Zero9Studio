import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import MainApp from "../components/MainApp";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "1Zero9 Studio - Design. Code. Launch.",
  description: "Smart design, precision delivery, simplicity. The future of creative design — built today.",
  keywords: "web design, branding, UI/UX, development, creative studio",
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
