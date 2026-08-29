"use client";

import { useRef, useState } from "react";

export function WaveformVisualizer({
  className = "",
  bars = 48,
  active = true,
}: {
  className?: string;
  bars?: number;
  active?: boolean;
}) {
  const [hoverX, setHoverX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate deterministic heights that resemble sound frequencies
  const defaultHeights = [
    18, 25, 40, 65, 30, 20, 45, 80, 95, 60, 35, 50, 75, 90, 100, 70, 45, 30,
    55, 85, 65, 40, 25, 60, 90, 80, 50, 35, 65, 85, 95, 75, 40, 20, 35, 70,
    85, 60, 40, 25, 50, 75, 60, 40, 25, 20, 15, 10,
  ];

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setHoverX(Math.max(0, Math.min(1, x)));
  }

  function handlePointerLeave() {
    setHoverX(null);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative flex items-center justify-between gap-[3px] py-4 select-none ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const baseHeight = defaultHeights[i % defaultHeights.length] ?? 30;
        const normalizedPos = i / bars;
        let scale = 1;

        if (hoverX !== null) {
          const dist = Math.abs(normalizedPos - hoverX);
          scale = Math.max(0.4, 1.8 - dist * 3.5);
        }

        const heightPercent = Math.min(100, Math.max(12, baseHeight * scale));

        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-150 ease-out"
            style={{
              height: `${heightPercent}%`,
              minHeight: "4px",
              maxHeight: "100%",
              backgroundColor:
                i % 6 === 0
                  ? "var(--signal)"
                  : i % 3 === 0
                    ? "var(--accent)"
                    : "var(--border-hover)",
              opacity: active ? 0.85 : 0.4,
              transform: `scaleY(${active ? 1 : 0.6})`,
            }}
          />
        );
      })}
    </div>
  );
}
