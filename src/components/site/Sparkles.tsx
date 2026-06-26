"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseA: number; // base alpha
  amp: number; // twinkle amplitude
  speed: number; // twinkle speed
  phase: number;
  drift: number; // horizontal drift
  glow: boolean;
}

function toRgb(hex: string): string {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `${isNaN(r) ? 255 : r},${isNaN(g) ? 255 : g},${isNaN(b) ? 255 : b}`;
}

export function Sparkles({ color = "#FFFFFF" }: { color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rgb = toRgb(color);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let raf = 0;

    const build = () => {
      const count = Math.min(220, Math.max(60, Math.round((w * h) / 12000)));
      stars = Array.from({ length: count }, () => {
        const r = Math.random() < 0.12 ? Math.random() * 1.4 + 1.1 : Math.random() * 1 + 0.3;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          baseA: Math.random() * 0.4 + 0.15,
          amp: Math.random() * 0.35 + 0.15,
          speed: Math.random() * 0.018 + 0.004,
          phase: Math.random() * Math.PI * 2,
          drift: Math.random() * 0.12 - 0.06,
          glow: r > 1.1,
        };
      });
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduced) drawStatic();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${s.baseA + s.amp})`;
        ctx.fill();
      }
    };

    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.phase += s.speed;
        s.x += s.drift;
        s.y -= 0.04; // gentle upward drift
        if (s.y < -2) s.y = h + 2;
        if (s.x < -2) s.x = w + 2;
        else if (s.x > w + 2) s.x = -2;

        const alpha = Math.max(0, Math.min(1, s.baseA + Math.sin(s.phase) * s.amp));
        if (s.glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${rgb},0.9)`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}
