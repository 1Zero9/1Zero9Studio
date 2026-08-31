"use client";

import { useEffect, useRef } from "react";

export function KineticSignalField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      isOver: false,
      speed: 0,
    };

    const updateSize = () => {
      if (!containerRef.current || !canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);

      if (mouse.targetX < 0) {
        mouse.targetX = width * 0.5;
        mouse.targetY = height * 0.52;
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    updateSize();

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newTargetX = e.clientX - rect.left;
      const newTargetY = e.clientY - rect.top;

      mouse.vx = newTargetX - mouse.targetX;
      mouse.vy = newTargetY - mouse.targetY;
      mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      mouse.targetX = newTargetX;
      mouse.targetY = newTargetY;
      mouse.isOver = true;
    };

    const handlePointerLeave = () => {
      mouse.isOver = false;
      mouse.targetX = width * 0.5;
      mouse.targetY = height * 0.52;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("resize", updateSize, { passive: true });

    let animFrame = 0;
    let time = 0;
    let lastTime = performance.now();

    function render(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt * 1.1;

      // Smooth tracking with fluid dampening
      const ease = mouse.isOver ? 0.055 : 0.02;
      mouse.x += (mouse.targetX - mouse.x) * ease;
      mouse.y += (mouse.targetY - mouse.y) * ease;

      ctx.clearRect(0, 0, width, height);

      if (width === 0 || height === 0) {
        animFrame = requestAnimationFrame(render);
        return;
      }

      // Theme detection
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");

      const signalColor = isDark ? "215, 255, 87" : "22, 163, 74";
      const accentColor = isDark ? "59, 130, 246" : "37, 99, 235";
      const secondaryColor = isDark ? "168, 85, 247" : "147, 51, 234";

      // 1. Broad Ambient Radial Glow around mouse
      const glowRadius = Math.min(width * 0.5, 460);
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        glowRadius
      );
      gradient.addColorStop(0, `rgba(${signalColor}, ${isDark ? 0.14 : 0.09})`);
      gradient.addColorStop(0.35, `rgba(${accentColor}, ${isDark ? 0.06 : 0.035})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Full Edge-to-Edge Sinusoidal Harmonic Filaments
      const numLines = 4;
      const steps = Math.max(80, Math.floor(width / 5));

      for (let l = 0; l < numLines; l++) {
        const lineOffset = (l - 1.5) * 24;
        // Low frequency for long, sweeping edge-to-edge wave crests
        const freq1 = 0.0018 + l * 0.0006;
        const freq2 = 0.0042 + l * 0.0009;
        const speed = 1.4 + l * 0.35;
        const opacity = isDark ? 0.36 - l * 0.07 : 0.24 - l * 0.045;

        ctx.beginPath();

        for (let s = 0; s <= steps; s++) {
          const px = (s / steps) * width;

          // Wide edge-to-edge mouse attraction
          const distToMouse = Math.abs(px - mouse.x);
          const mouseInfluence = Math.max(0, 1 - distToMouse / (width * 0.55));

          // Sweeping dual-sine harmonics with broad amplitude
          const waveHeight =
            (28 + mouseInfluence * 48) *
            (Math.sin(time * speed + px * freq1) * 0.75 +
              Math.sin(time * speed * 0.85 + px * freq2 + l) * 0.25);

          // Smooth vertical blend
          const baseY =
            mouse.y * (mouseInfluence * 0.6) +
            (height * 0.52 + lineOffset) * (1 - mouseInfluence * 0.6);

          const py = baseY + waveHeight;

          if (s === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        // Color gradation across filaments
        if (l === 0) {
          ctx.strokeStyle = `rgba(${signalColor}, ${opacity + 0.06})`;
          ctx.lineWidth = 2.0;
        } else if (l === 1) {
          ctx.strokeStyle = `rgba(${accentColor}, ${opacity})`;
          ctx.lineWidth = 1.6;
        } else if (l === 2) {
          ctx.strokeStyle = `rgba(${secondaryColor}, ${opacity * 0.85})`;
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = `rgba(${signalColor}, ${opacity * 0.65})`;
          ctx.lineWidth = 1.0;
        }

        ctx.stroke();
      }

      // 3. Floating reactive nodes along wave path
      const numDots = 12;
      for (let i = 0; i < numDots; i++) {
        const dotTime = time * 0.65 + (i * Math.PI * 2) / numDots;
        const orbitRadiusX = 100 + (i % 4) * 45;
        const orbitRadiusY = 32 + (i % 3) * 16;

        const dotX = mouse.x + Math.cos(dotTime) * orbitRadiusX;
        const dotY = mouse.y + Math.sin(dotTime * 1.15) * orbitRadiusY;
        const dotSize = 1.6 + (i % 2) * 1.2;

        if (dotX >= 0 && dotX <= width && dotY >= 0 && dotY <= height) {
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          ctx.fillStyle =
            i % 2 === 0
              ? `rgba(${signalColor}, ${isDark ? 0.8 : 0.6})`
              : `rgba(${accentColor}, ${isDark ? 0.7 : 0.5})`;
          ctx.fill();
        }
      }

      animFrame = requestAnimationFrame(render);
    }

    animFrame = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="size-full block" />
    </div>
  );
}
