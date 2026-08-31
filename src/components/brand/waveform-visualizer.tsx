"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PulseWave {
  x: number;
  speed: number;
  radius: number;
  intensity: number;
  born: number;
}

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
  const [readout, setReadout] = useState("48.0 kHz · STREAMING RIGHT");
  const [pulseCount, setPulseCount] = useState(0);

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

  const pulsesRef = useRef<PulseWave[]>([]);
  const peaksRef = useRef<{ val: number; speed: number }[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const triggerPulse = useCallback((xRatio = 0.2) => {
    pulsesRef.current.push({
      x: xRatio,
      speed: 1.8,
      radius: 0,
      intensity: 1.0,
      born: performance.now(),
    });
    setPulseCount((c) => c + 1);
  }, []);

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
      const speedMultiplier = mouse.isOver ? 1.0 + Math.abs(mouse.vx) * 0.05 : 1.0;
      timeRef.current += dt * 3.5 * speedMultiplier;

      // Clear
      ctx.clearRect(0, 0, width, height);

      const numCols = Math.max(28, Math.min(64, Math.floor(width / 16)));
      const colWidth = (width - (numCols - 1) * 4) / numCols;
      const boxSize = Math.max(3, Math.min(7, colWidth));
      const boxGap = 2.5;
      const maxRows = Math.floor((height - 12) / (boxSize + boxGap));

      // Ensure peaks array matches column count
      if (peaksRef.current.length !== numCols) {
        peaksRef.current = Array.from({ length: numCols }, () => ({
          val: 0,
          speed: 0,
        }));
      }

      // Update pulse waves
      const activePulses = pulsesRef.current.filter((p) => {
        p.radius += dt * p.speed;
        p.intensity *= 0.985;
        return p.intensity > 0.02 && p.radius < 2.5;
      });
      pulsesRef.current = activePulses;

      // Theme detection for styling colors
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");

      const colSignal = isDark ? "#d7ff57" : "#16a34a";
      const colAccent = isDark ? "#3b82f6" : "#2563eb";
      const colWip = isDark ? "#fbbf24" : "#d97706";
      const colMuted = isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(0, 0, 0, 0.12)";

      // Draw columns and jumping boxes
      for (let i = 0; i < numCols; i++) {
        const colX = i * (colWidth + 4);
        const normX = i / numCols;

        // Base multi-frequency travelling wave moving RIGHT
        // (subtracting time moves wave to the right)
        const t = timeRef.current;
        const wave1 = Math.sin(normX * 10 - t * 2.2);
        const wave2 = Math.cos(normX * 18 - t * 3.8) * 0.5;
        const wave3 = Math.sin(normX * 32 - t * 5.5) * 0.25;
        let amplitude = (wave1 + wave2 + wave3 + 1.75) / 3.5;

        // Mouse proximity interaction: JUMP up & boost
        if (mouse.isOver && width > 0) {
          const mouseNormX = mouse.x / width;
          const dist = Math.abs(normX - mouseNormX);
          if (dist < 0.25) {
            const proximity = 1 - dist / 0.25;
            // Add vertical bounce jump & rightward push
            const jumpPulse = Math.sin(t * 8 + normX * 12) * 0.3 * proximity;
            amplitude = Math.min(1.0, amplitude * (1.2 + proximity * 1.5) + jumpPulse);
          }
        }

        // Pulse wave effect
        for (const pulse of activePulses) {
          const pDist = Math.abs(normX - (pulse.x + pulse.radius));
          if (pDist < 0.12) {
            const pStrength = (1 - pDist / 0.12) * pulse.intensity;
            amplitude = Math.min(1.0, amplitude + pStrength * 0.8);
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
            peak.speed += dt * 35; // gravity
            peak.val = Math.max(1, peak.val - peak.speed * dt);
          }
        }

        // Draw stacked segmented boxes
        for (let r = 0; r < maxRows; r++) {
          const boxY = height - 8 - r * (boxSize + boxGap);
          const isBlockActive = r < activeRows;

          ctx.beginPath();
          ctx.roundRect(colX, boxY - boxSize, boxSize, boxSize, 1.5);

          if (isBlockActive) {
            // Color variation based on height and position
            if (r > maxRows * 0.75) {
              ctx.fillStyle = colWip;
            } else if (r > maxRows * 0.45) {
              ctx.fillStyle = colAccent;
            } else {
              ctx.fillStyle = colSignal;
            }
            ctx.globalAlpha = active ? 0.95 : 0.4;
          } else {
            ctx.fillStyle = colMuted;
            ctx.globalAlpha = 0.35;
          }
          ctx.fill();
        }

        // Draw floating jumping peak cap
        if (peak && peak.val > 2) {
          const peakY = height - 8 - peak.val * (boxSize + boxGap) - 2;
          ctx.beginPath();
          ctx.roundRect(colX, Math.max(2, peakY - boxSize * 0.6), boxSize, boxSize * 0.6, 1);
          ctx.fillStyle = isHovered ? colSignal : colAccent;
          ctx.globalAlpha = 0.9;
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

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouse = mouseRef.current;
    mouse.vx = mouse.prevX > 0 ? (x - mouse.prevX) * 0.6 : 0;
    mouse.prevX = x;
    mouse.x = x;
    mouse.y = y;
    mouse.isOver = true;
    setIsHovered(true);

    const freqVal = (44.1 + (x / rect.width) * 52.3).toFixed(1);
    const speedVal = (1.0 + Math.abs(mouse.vx) * 0.1).toFixed(1);
    setReadout(`MODULATING · ${freqVal} kHz · SPEED ${speedVal}x`);
  }

  function handlePointerLeave() {
    mouseRef.current.isOver = false;
    mouseRef.current.prevX = -1000;
    mouseRef.current.vx = 0;
    setIsHovered(false);
    setReadout("48.0 kHz · STREAMING RIGHT");
  }

  function handleClick(e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width;
    triggerPulse(xRatio);
  }

  return (
    <div className={`relative flex flex-col gap-2 select-none ${className}`}>
      {/* Interactive Canvas */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onMouseMove={handlePointerMove}
        onPointerEnter={handlePointerMove}
        onMouseEnter={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onMouseLeave={handlePointerLeave}
        onPointerDown={handleClick}
        onClick={handleClick}
        className="relative w-full h-24 sm:h-28 rounded-xl bg-bg-subtle/70 border border-border overflow-hidden cursor-crosshair group transition-all duration-200 hover:border-signal/50 hover:shadow-lg"
        title="Hover to modulate frequency & speed, Click to trigger pulse wave"
      >
        <canvas ref={canvasRef} className="size-full block" />

        {/* Dynamic Glow Cursor Highlight */}
        {isHovered && (
          <div
            className="absolute top-0 bottom-0 w-24 pointer-events-none -translate-x-1/2 bg-gradient-to-r from-transparent via-signal/15 to-transparent blur-md transition-opacity"
            style={{ left: `${mouseRef.current.x}px` }}
          />
        )}
      </div>

      {/* Interactive Micro-Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-muted px-1">
        <div className="flex items-center gap-2">
          <span
            className={`size-1.5 rounded-full ${
              isHovered ? "bg-signal animate-ping" : "bg-live-green"
            }`}
          />
          <span className="font-semibold text-fg tracking-tight">{readout}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="opacity-70 hidden sm:inline">
            Hover to speed up & jump · Click to pulse ({pulseCount})
          </span>
          <button
            type="button"
            onClick={() => triggerPulse(0.0)}
            className="px-2 py-0.5 rounded bg-surface hover:bg-surface-hover border border-border text-[10px] text-fg font-semibold transition-colors"
          >
            ⚡ Pulse
          </button>
        </div>
      </div>
    </div>
  );
}
