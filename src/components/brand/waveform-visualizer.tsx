"use client";

import { useEffect, useRef, useState } from "react";

export function WaveformVisualizer({
  className = "",
  active = true,
}: {
  className?: string;
  active?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [readout, setReadout] = useState("48 kHz · LIVE SIGNAL");

  const mouseRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    vx: number;
    isOver: boolean;
  }>({
    x: -1000,
    y: -1000,
    prevX: -1000,
    vx: 0,
    isOver: false,
  });

  const peaksRef = useRef<{ val: number; speed: number }[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = entry.contentRect;
        width = rect.width;
        height = rect.height;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    let lastTimestamp = performance.now();

    function render(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      // Advance rightward movement phase
      const mouse = mouseRef.current;
      const speedMultiplier = mouse.isOver ? 1.0 + Math.abs(mouse.vx) * 0.03 : 1.0;
      timeRef.current += dt * 2.8 * speedMultiplier;

      // Clear
      ctx.clearRect(0, 0, width, height);

      const numCols = Math.max(24, Math.min(48, Math.floor(width / 18)));
      const colWidth = (width - (numCols - 1) * 3) / numCols;
      const boxSize = Math.max(3, Math.min(5, colWidth));
      const boxGap = 2;
      const maxRows = Math.max(4, Math.floor((height - 8) / (boxSize + boxGap)));

      // Ensure peaks array matches column count
      if (peaksRef.current.length !== numCols) {
        peaksRef.current = Array.from({ length: numCols }, () => ({
          val: 0,
          speed: 0,
        }));
      }

      // Theme detection for styling colors
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");

      const colSignal = isDark ? "#d7ff57" : "#16a34a";
      const colAccent = isDark ? "#3b82f6" : "#2563eb";
      const colMuted = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";

      // Draw columns and jumping boxes
      for (let i = 0; i < numCols; i++) {
        const colX = i * (colWidth + 3);
        const normX = i / numCols;

        // Base multi-frequency travelling wave moving RIGHT
        const t = timeRef.current;
        const wave1 = Math.sin(normX * 8 - t * 2.0);
        const wave2 = Math.cos(normX * 14 - t * 3.2) * 0.4;
        let amplitude = (wave1 + wave2 + 1.4) / 2.8;

        // Subtle mouse proximity interaction: gentle bounce
        if (mouse.isOver && width > 0) {
          const mouseNormX = mouse.x / width;
          const dist = Math.abs(normX - mouseNormX);
          if (dist < 0.2) {
            const proximity = 1 - dist / 0.2;
            const jumpPulse = Math.sin(t * 6 + normX * 8) * 0.2 * proximity;
            amplitude = Math.min(1.0, amplitude * (1.1 + proximity * 0.8) + jumpPulse);
          }
        }

        const activeRows = Math.max(1, Math.round(amplitude * maxRows));

        // Update jumping peak cap physics
        const peak = peaksRef.current[i];
        if (peak) {
          if (activeRows >= peak.val) {
            peak.val = activeRows;
            peak.speed = 0;
          } else {
            peak.speed += dt * 25; // gravity
            peak.val = Math.max(1, peak.val - peak.speed * dt);
          }
        }

        // Draw stacked segmented boxes
        for (let r = 0; r < maxRows; r++) {
          const boxY = height - 4 - r * (boxSize + boxGap);
          const isBlockActive = r < activeRows;

          ctx.beginPath();
          ctx.roundRect(colX, boxY - boxSize, boxSize, boxSize, 1);

          if (isBlockActive) {
            if (r > maxRows * 0.6) {
              ctx.fillStyle = colAccent;
            } else {
              ctx.fillStyle = colSignal;
            }
            ctx.globalAlpha = active ? 0.9 : 0.4;
          } else {
            ctx.fillStyle = colMuted;
            ctx.globalAlpha = 0.25;
          }
          ctx.fill();
        }

        // Floating jumping peak cap
        if (peak && peak.val > 2) {
          const peakY = height - 4 - peak.val * (boxSize + boxGap) - 1.5;
          ctx.beginPath();
          ctx.roundRect(colX, Math.max(1, peakY - boxSize * 0.5), boxSize, boxSize * 0.5, 0.5);
          ctx.fillStyle = colSignal;
          ctx.globalAlpha = 0.85;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, isHovered]);

  function handlePointerMove(
    e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouse = mouseRef.current;
    mouse.vx = mouse.prevX > 0 ? (x - mouse.prevX) * 0.5 : 0;
    mouse.prevX = x;
    mouse.x = x;
    mouse.y = y;
    mouse.isOver = true;
    setIsHovered(true);

    const freqVal = (44.1 + (x / rect.width) * 44.0).toFixed(0);
    setReadout(`MODULATING · ${freqVal} kHz`);
  }

  function handlePointerLeave() {
    mouseRef.current.isOver = false;
    mouseRef.current.prevX = -1000;
    mouseRef.current.vx = 0;
    setIsHovered(false);
    setReadout("48 kHz · LIVE SIGNAL");
  }

  return (
    <div className={`relative flex items-center gap-4 ${className}`}>
      {/* Toned-down compact canvas */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onMouseMove={handlePointerMove}
        onPointerEnter={handlePointerMove}
        onMouseEnter={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onMouseLeave={handlePointerLeave}
        className="relative flex-1 h-12 rounded-lg bg-bg-subtle/40 border border-border/60 overflow-hidden cursor-crosshair transition-all duration-200 hover:border-border-hover"
        title="Hover to modulate frequency"
      >
        <canvas ref={canvasRef} className="size-full block" />
      </div>

      {/* Subtle compact readout */}
      <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] text-muted">
        <span
          className={`size-1.5 rounded-full ${
            isHovered ? "bg-signal animate-pulse" : "bg-live-green"
          }`}
        />
        <span className="font-medium text-fg">{readout}</span>
      </div>
    </div>
  );
}
