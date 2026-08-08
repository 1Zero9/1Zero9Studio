"use client";

import NextLink from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ComponentProps, ElementType, PointerEvent, ReactNode } from "react";

type Glow = "light" | "dark" | "accent";

function useRevealMotion<T extends HTMLElement>(glow?: Glow) {
  const ref = useRef<T | null>(null);
  // Content is visible by default (no-JS / pre-hydration safe). We only ever
  // hide it, and only once we've confirmed via layout that it's off-screen,
  // so there's no window where text can be stuck invisible.
  const [hidden, setHidden] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const bounds = node.getBoundingClientRect();
    const alreadyInView = bounds.top < window.innerHeight && bounds.bottom > 0;
    if (alreadyInView) return;

    setHidden(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHidden(false);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function move(event: PointerEvent<T>) {
    if (!glow || !ref.current) return;
    const bounds = ref.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    ref.current.style.setProperty("--gx", `${x.toFixed(1)}%`);
    ref.current.style.setProperty("--gy", `${y.toFixed(1)}%`);
  }

  return { ref, hidden, move };
}

function revealClassName(hidden: boolean, glow: Glow | undefined, className: string) {
  const glowClass = glow ? ` has-glow has-glow--${glow}` : "";
  return `reveal${hidden ? " is-hidden" : ""}${glowClass} ${className}`.trim();
}

function revealStyle(style: CSSProperties | undefined, delay: number) {
  return delay ? ({ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties) : style;
}

type RevealProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  glow?: Glow;
  [key: string]: unknown;
};

export function Reveal({ as, children, className = "", style, delay = 0, glow, ...rest }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, hidden, move } = useRevealMotion<HTMLElement>(glow);

  return (
    <Tag
      ref={ref}
      onPointerMove={glow ? move : undefined}
      className={revealClassName(hidden, glow, className)}
      style={revealStyle(style, delay)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

type RevealLinkProps = ComponentProps<typeof NextLink> & {
  delay?: number;
  glow?: Glow;
};

export function RevealLink({ className = "", style, delay = 0, glow, children, ...rest }: RevealLinkProps) {
  const { ref, hidden, move } = useRevealMotion<HTMLAnchorElement>(glow);

  return (
    <NextLink
      ref={ref}
      onPointerMove={glow ? move : undefined}
      className={revealClassName(hidden, glow, className)}
      style={revealStyle(style, delay)}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
