"use client";

import { motion, useReducedMotion } from "motion/react";
import { Logo } from "@/components/brand/logo";

/* The mark wipes in left-to-right — the signal drawing across. */
export function LogoReveal({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 1, clipPath: "inset(0 100% 0 0)" }
      }
      animate={
        reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0% 0 0)" }
      }
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
    >
      <Logo className={className} />
    </motion.div>
  );
}
