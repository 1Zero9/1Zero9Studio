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

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = entry.contentRect;
        width = rect.width;
        height = rect.height;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);

        if (mouse.targetX < 0) {
          mouse.targetX = width * 0.5;
          mouse.targetY = height * 0.5;
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

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
      mouse.targetY = height * 0.55;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    let animFrame = 0;
    let time = 0;
    let lastTime = performance.now();

    function render(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt * 1.2;

      // Smooth tracking with dampening
      const ease = mouse.isOver ? 0.06 : 0.025;
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

      // 1. Broad Ambient Radial Luminous Glow around mouse
      const glowRadius = Math.min(width * 0.6, 420);
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        glowRadius
      );
      gradient.addColorStop(0, `rgba(${signalColor}, ${isDark ? 0.12 : 0.08})`);
      gradient.addColorStop(0.4, `rgba(${accentColor}, ${isDark ? 0.05 : 0.03})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. WIDE Harmonic Wave Filaments across the entire container
      const numLines = 4;
      const steps = Math.max(60, Math.floor(width / 6));

      for (let l = 0; l < numLines; l++) {
        const lineOffset = (l - 1.5) * 22;
        // Wide frequency for broad, sweeping wave crests
        const freq1 = 0.0022 + l * 0.0008;
        const freq2 = 0.0055 + l * 0.0012;
        const speed = 1.6 + l * 0.4;
        const opacity = isDark ? 0.32 - l * 0.06 : 0.22 - l * 0.04;

        ctx.beginPath();

        for (let s = 0; s <= steps; s++) {
          const px = (s / steps) * width;

          // Wide mouse interaction field
          const distToMouse = Math.abs(px - mouse.x);
          const mouseInfluence = Math.max(0, 1 - distToMouse / (width * 0.65));

          // Sweeping dual-sine wave with wide amplitude
          const waveHeight =
            (26 + mouseInfluence * 44) *
            (Math.sin(time * speed + px * freq1) * 0.7 +
              Math.sin(time * speed * 0.8 + px * freq2 + l) * 0.3);

          // Blend wave center toward mouse position smoothly
          const baseY =
            mouse.y * (mouseInfluence * 0.65) +
            (height * 0.52 + lineOffset) * (1 - mouseInfluence * 0.65);

          const py = baseY + waveHeight;

          if (s === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        // Color gradation across filaments
        if (l === 0) {
          ctx.strokeStyle = `rgba(${signalColor}, ${opacity + 0.05})`;
          ctx.lineWidth = 1.8;
        } else if (l === 1) {
          ctx.strokeStyle = `rgba(${accentColor}, ${opacity})`;
          ctx.lineWidth = 1.4;
        } else if (l === 2) {
          ctx.strokeStyle = `rgba(${secondaryColor}, ${opacity * 0.8})`;
          ctx.lineWidth = 1.1;
        } else {
          ctx.strokeStyle = `rgba(${signalColor}, ${opacity * 0.6})`;
          ctx.lineWidth = 0.9;
        }

        ctx.stroke();
      }

      // 3. Wide reactive signal nodes riding along the wave crests
      const numDots = 10;
      for (let i = 0; i < numDots; i++) {
        const dotTime = time * 0.7 + (i * Math.PI * 2) / numDots;
        const orbitRadiusX = 80 + (i % 3) * 35;
        const orbitRadiusY = 30 + (i % 2) * 18;

        const dotX = mouse.x + Math.cos(dotTime) * orbitRadiusX;
        const dotY = mouse.y + Math.sin(dotTime * 1.2) * orbitRadiusY;
        const dotSize = 1.5 + (i % 2) * 1.2;

        if (dotX >= 0 && dotX <= width && dotY >= 0 && dotY <= height) {
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
          ctx.fillStyle =
            i % 2 === 0
              ? `rgba(${signalColor}, ${isDark ? 0.75 : 0.55})`
              : `rgba(${accentColor}, ${isDark ? 0.65 : 0.45})`;
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
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
    >
      <canvas ref={canvasRef} className="size-full block" />
    </div>
  );
}
