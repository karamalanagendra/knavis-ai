"use client";
import { useEffect, useRef } from "react";

export default function HeroBg3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Mouse ──────────────────────────────────────────────────────────────
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5);
      my = (e.clientY / H - 0.5);
    };
    window.addEventListener("mousemove", onMove);

    // ── Particle definition ────────────────────────────────────────────────
    type P = {
      x: number; y: number; z: number;      // 3D world pos
      vx: number; vy: number; vz: number;   // drift velocity
      r: number; g: number; b: number;       // color
      base: number;                          // base size (px)
      alpha: number;                         // max opacity
    };

    // Color palette — deep cyan, teal-green, mid-violet, ice-blue
    const COLORS: [number,number,number][] = [
      [0,   210, 255],   // cyan
      [0,   240, 160],   // teal-green
      [0,   180, 220],   // ice-blue
      [80,  180, 255],   // sky
      [0,   255, 180],   // mint
      [100, 100, 240],   // soft violet
    ];

    const COUNT  = 320;
    const SPREAD = 1.6;   // horizontal spread multiplier
    const DEPTH  = 900;   // z-range

    const ps: P[] = Array.from({ length: COUNT }, () => {
      const [r, g, b] = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x:  (Math.random() - 0.5) * W * SPREAD,
        y:  (Math.random() - 0.5) * H * 1.2,
        z:  Math.random() * DEPTH - DEPTH * 0.5,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.08,
        vz: (Math.random() - 0.5) * 0.15,
        r, g, b,
        base:  Math.random() * 90 + 30,   // 30–120 px
        alpha: Math.random() * 0.12 + 0.04, // 4–16% opacity — very transparent
      };
    });

    // ── 3D projection ──────────────────────────────────────────────────────
    const FOV = 700;
    const project = (x: number, y: number, z: number, ry: number, rx: number) => {
      // Y-axis rotation
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      // X-axis rotation
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y1 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      // Perspective
      const d = FOV / (FOV + z2 + DEPTH * 0.5);
      return { sx: W/2 + x1 * d, sy: H/2 + y1 * d, scale: d, depth: z2 };
    };

    // ── Draw loop ──────────────────────────────────────────────────────────
    let t = 0;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      t += 0.0025;

      // Smooth mouse parallax
      tx += (mx - tx) * 0.03;
      ty += (my - ty) * 0.03;

      const ry = t * 0.04 + tx * 0.25;
      const rx = -0.08 + ty * 0.12;

      ctx.clearRect(0, 0, W, H);

      // Update + project
      const drawn = ps.map(p => {
        // Drift
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        // Wrap at boundaries
        const hw = W * SPREAD * 0.5;
        const hh = H * 0.7;
        if (p.x >  hw) p.x = -hw;
        if (p.x < -hw) p.x =  hw;
        if (p.y >  hh) p.y = -hh;
        if (p.y < -hh) p.y =  hh;
        if (p.z >  DEPTH*0.5) p.z = -DEPTH*0.5;
        if (p.z < -DEPTH*0.5) p.z =  DEPTH*0.5;

        return { p, ...project(p.x, p.y, p.z, ry, rx) };
      });

      // Back-to-front
      drawn.sort((a, b) => a.depth - b.depth);

      for (const { p, sx, sy, scale, depth } of drawn) {
        // Depth fade: front particles brighter
        const depthFade = Math.max(0, Math.min(1, (depth + DEPTH*0.5) / DEPTH));
        const alpha = p.alpha * depthFade;
        const size  = p.base * scale * 1.8;

        if (size < 4 || alpha < 0.005) continue;

        // Large soft radial blob — very transparent, deep glow
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, size);
        grad.addColorStop(0,   `rgba(${p.r},${p.g},${p.b},${alpha})`);
        grad.addColorStop(0.4, `rgba(${p.r},${p.g},${p.b},${alpha * 0.5})`);
        grad.addColorStop(1,   `rgba(${p.r},${p.g},${p.b},0)`);

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Tiny bright core
        if (scale > 0.7) {
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(1, size * 0.06), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${Math.min(0.7, alpha * 6)})`;
          ctx.fill();
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        zIndex:        0,
        pointerEvents: "none",
        opacity:       1,
      }}
    />
  );
}
