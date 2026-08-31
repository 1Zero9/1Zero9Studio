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
          mouse.targetX = width * 0.7;
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
      mouse.targetX = width * 0.75;
      mouse.targetY = height * 0.5;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    let animFrame = 0;
    let time = 0;
    let lastTime = performance.now();

    // Wave point trails
    const trailLength = 18;
    const trail: { x: number; y: number }[] = [];

    function render(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt * 1.5;

      // Smooth lerp mouse tracking
      const ease = mouse.isOver ? 0.08 : 0.03;
      mouse.x += (mouse.targetX - mouse.x) * ease;
      mouse.y += (mouse.targetY - mouse.y) * ease;

      // Update trail points
      trail.unshift({ x: mouse.x, y: mouse.y });
      if (trail.length > trailLength) trail.pop();

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

      // 1. Subtle ambient mouse glow
      const glowRadius = Math.min(width * 0.4, 280);
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        glowRadius
      );
      gradient.addColorStop(0, `rgba(${signalColor}, ${isDark ? 0.09 : 0.06})`);
      gradient.addColorStop(0.5, `rgba(${accentColor}, ${isDark ? 0.04 : 0.02})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Interactive flowing sine waves that curve toward cursor
      const numLines = 3;
      for (let l = 0; l < numLines; l++) {
        const lineOffset = (l - 1) * 16;
        const lineFreq = 0.006 + l * 0.002;
        const lineSpeed = 2.0 + l * 0.6;
        const opacity = isDark ? 0.25 - l * 0.06 : 0.18 - l * 0.04;

        ctx.beginPath();
        const endX = width;
        const steps = Math.floor(width / 8);

        for (let s = 0; s <= steps; s++) {
          const px = (s / steps) * endX;

          // Influence from cursor distance
          const distToMouse = Math.abs(px - mouse.x);
          const mouseInfluence = Math.max(0, 1 - distToMouse / (width * 0.45));
          const waveHeight = (18 + mouseInfluence * 32) * Math.sin(time * lineSpeed + px * lineFreq);

          // Blend wave Y toward mouse Y near cursor
          const baseY = mouse.y * mouseInfluence + (height * 0.5 + lineOffset) * (1 - mouseInfluence);
          const py = baseY + waveHeight;

          if (s === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }

        ctx.strokeStyle = l === 0 ? `rgba(${signalColor}, ${opacity})` : `rgba(${accentColor}, ${opacity})`;
        ctx.lineWidth = l === 0 ? 1.5 : 1.0;
        ctx.stroke();
      }

      // 3. Subtle floating reactive signal dots
      const numDots = 8;
      for (let i = 0; i < numDots; i++) {
        const dotTime = time * 0.8 + (i * Math.PI * 2) / numDots;
        const orbitRadiusX = 45 + (i % 3) * 20;
        const orbitRadiusY = 22 + (i % 2) * 12;

        const dotX = mouse.x + Math.cos(dotTime) * orbitRadiusX;
        const dotY = mouse.y + Math.sin(dotTime * 1.3) * orbitRadiusY;
        const dotSize = 1.5 + (i % 2) * 1.0;

        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? `rgba(${signalColor}, ${isDark ? 0.6 : 0.45})` : `rgba(${accentColor}, ${isDark ? 0.5 : 0.35})`;
        ctx.fill();
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
