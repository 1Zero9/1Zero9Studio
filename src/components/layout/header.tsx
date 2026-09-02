"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/projects", label: "Portfolio" },
    { href: "/labs", label: "Labs" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="site-header-wrapper">
      <div className="site-header">
        <Link href="/" className="site-header__brand" aria-label="1Zero9 Studio — Home">
          <Logo className="site-header__logo" />
          <span>1Zero9</span>
        </Link>

        <nav className="site-header__nav hidden md:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`site-header__link ${isActive ? "is-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <Link
            href="/contact"
            className="btn-contact-header"
            aria-label="Contact 1Zero9"
          >
            <span>Get in touch</span>
            <span aria-hidden="true">↗</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex md:hidden p-2 text-muted hover:text-fg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-x-4 top-20 z-50 p-4 rounded-2xl bg-surface border border-border shadow-2xl flex flex-col gap-3 md:hidden backdrop-blur-lg"
          onClick={() => setMobileOpen(false)}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted hover:text-fg hover:bg-surface-hover rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 text-center py-2.5 rounded-xl bg-fg text-bg font-semibold text-sm"
          >
            Get in touch ↗
          </Link>
        </div>
      )}
    </header>
  );
}
