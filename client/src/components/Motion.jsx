import { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";

/* ====================================================================
   PERFORMANCE UTILS
   ==================================================================== */

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ====================================================================
   BRAND PALETTE
   ==================================================================== */

const ORB_COLORS = [
  "rgba(201,168,76,  0.15)", // gold
  "rgba(26, 86, 219, 0.12)", // royal
  "rgba(109,40, 217, 0.12)", // violet
  "rgba(56, 189,248, 0.11)", // sky-l
  "rgba(232,201,109, 0.14)", // gold-l
];

const PARTICLE_COLORS = [
  "#C9A84C", "#E8C96D", "#F5DFA0", // gold family
  "#1A56DB", "#3B82F6",             // royal family
  "#6D28D9", "#A78BFA",             // violet family
  "#38BDF8",                         // sky
];

/* ====================================================================
   PRE-BAKED PARTICLE SPRITES
   ==================================================================== */

const buildSprites = (colors) => {
  if (typeof OffscreenCanvas === "undefined") return null;
  const map = new Map();
  for (const color of colors) {
    const sz = 30; // 5 × 6
    const oc = new OffscreenCanvas(sz, sz);
    const ctx = oc.getContext("2d");
    const r = sz / 2;
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, color);
    g.addColorStop(0.45, color + "BB");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    map.set(color, oc);
  }
  return map;
};

const SPRITES = buildSprites(PARTICLE_COLORS);

/* ====================================================================
   useReveal
   ==================================================================== */

export function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); observer.unobserve(el); }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ====================================================================
   BASE ANIMATION WRAPPERS
   ==================================================================== */

export const FadeUp = memo(function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
});

export const FadeIn = memo(function FadeIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.70, delay }}>
      {children}
    </motion.div>
  );
});

export const ScaleIn = memo(function ScaleIn({ children, delay = 0, className = "" }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.56, delay, ease: [0.34, 1.56, 0.64, 1] }}>
      {children}
    </motion.div>
  );
});

export const SlideIn = memo(function SlideIn({ children, from = "left", delay = 0, className = "" }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, x: from === "left" ? -42 : 42 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
});

/* ====================================================================
   STAGGER
   ==================================================================== */

export const StaggerContainer = memo(function StaggerContainer({ children, className = "", staggerDelay = 0.1 }) {
  return (
    <motion.div className={className}
      initial="hidden" whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: staggerDelay } } }}>
      {children}
    </motion.div>
  );
});

export const StaggerItem = memo(function StaggerItem({ children, className = "text-left" }) {
  return (
    <motion.div className={className}
      variants={{
        hidden: { opacity: 0, y: 26, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.56, ease: [0.22, 1, 0.36, 1] } },
      }}>
      {children}
    </motion.div>
  );
});

/* ====================================================================
   AuroraBackground
   Original: 15 particles + 5 canvas orbs
   Optimizations kept: sprites, delta-time, tab-pause, DPR, ResizeObserver
   ==================================================================== */

export const AuroraBackground = memo(function AuroraBackground({ children, orbs = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!orbs || !canvasRef.current) return;
    if (reducedMotion()) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
      willReadFrequently: false,
    });

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 5 : 15; // Reduce count heavily on mobile
    const TARGET_MS = isMobile ? 1000 / 30 : 1000 / 60; // Cap to 30fps on mobile for battery/perf

    let raf, running = true, lastTs = 0, resizeTimer;

    /* ── DPR-aware resize (debounced 150 ms) ──────────────────────── */
    const applyResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const scheduleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyResize, 150);
    };

    const ro = new ResizeObserver(scheduleResize);
    ro.observe(document.documentElement);
    applyResize();

    /* ── Particle pool ────────────────────────────────────────────── */
    const W0 = window.innerWidth, H0 = window.innerHeight;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => {
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      return {
        x: Math.random() * W0,
        y: Math.random() * H0,
        size: Math.random() * 1.6 + 0.8, // Reduced particle size
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.30, // slightly slower upward bias
        color,
        sprite: SPRITES?.get(color) ?? null,
      };
    });

    /* ── Render loop ──────────────────────────────────────────────── */
    const render = (timestamp) => {
      if (!running) return;

      const delta = timestamp - lastTs;
      if (delta < TARGET_MS - 1) {
        raf = requestAnimationFrame(render);
        return;
      }
      lastTs = timestamp - (delta % TARGET_MS);

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const minDim = Math.min(W, H);

      ctx.clearRect(0, 0, W, H);

      /* ── Draw 5 canvas orbs (RESTORED original positions) ───────── */
      const drawOrb = (cx, cy, r, color) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, color);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };

      const time = timestamp * 0.0003; 
    
      drawOrb(W * 0.2 + Math.sin(time) * 150, H * 0.3 + Math.cos(time * 0.8) * 150, minDim * 0.60, ORB_COLORS[0]); // gold
      drawOrb(W * 0.8 + Math.cos(time * 1.2) * 150, H * 0.2 + Math.sin(time * 0.9) * 150, minDim * 0.50, ORB_COLORS[1]); // royal
      drawOrb(W * 0.3 + Math.sin(time * 0.7) * 150, H * 0.8 + Math.cos(time * 1.1) * 150, minDim * 0.55, ORB_COLORS[2]); // violet
      drawOrb(W * 0.7 + Math.cos(time * 0.9) * 150, H * 0.7 + Math.sin(time * 1.3) * 150, minDim * 0.50, ORB_COLORS[3]); // sky
      drawOrb(W * 0.5 + Math.sin(time * 1.1) * 200, H * 0.9 + Math.cos(time * 0.7) * 100, minDim * 0.60, ORB_COLORS[4]); // gold-l

      /* ── Draw 15 particles (RESTORED) ────────────────────────────── */
      ctx.globalAlpha = 0.35; 
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;

        if (p.sprite) {
          const s = p.size * 4; // Reduced sprite scaling
          ctx.drawImage(p.sprite, p.x - s * 0.5, p.y - s * 0.5, s, s);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(render);
    };

    /* ── Visibility pause ─────────────────────────────────────────── */
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        lastTs = 0;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [orbs]);

  return (
    <div className="relative min-h-screen bg-[var(--base-bg)] overflow-x-hidden">
      {orbs && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{ isolation: "isolate" }}>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 w-full h-full"
          />
          <div className="bg-cross-pattern absolute inset-0 opacity-100" aria-hidden="true" />
        </div>
      )}
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
});

/* ====================================================================
   AmbientBackground
   ==================================================================== */

export const AmbientBackground = memo(function AmbientBackground({ children, className = "" }) {
  return (
    <div className={`min-h-screen ${className || "bg-[var(--base-bg)]"} text-white overflow-x-hidden relative`}>
      <div className="fixed inset-0 pointer-events-none -z-10" style={{ isolation: "isolate" }}>
        <div className="absolute -top-20 -left-20 w-[480px] h-[480px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(201,168,76,0.09) 0%,transparent 70%)" }} aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(26,86,219,0.07) 0%,transparent 70%)" }} aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(109,40,217,0.05) 0%,transparent 70%)" }} aria-hidden="true" />
        <div className="absolute -top-10 right-0 w-[340px] h-[340px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%)" }} aria-hidden="true" />
        <div className="bg-grid-pattern absolute inset-0 opacity-20" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
});

/* ====================================================================
   PageHero
   ==================================================================== */

const HERO_SCHEMES = {
  gold: { badge: "rgba(201,168,76,0.13)", badgeBorder: "rgba(232,201,109,0.38)", badgeText: "#E8C96D" },
  royal: { badge: "rgba(26,86,219,0.13)", badgeBorder: "rgba(59,130,246,0.38)", badgeText: "#3B82F6" },
  violet: { badge: "rgba(109,40,217,0.13)", badgeBorder: "rgba(167,139,250,0.38)", badgeText: "#A78BFA" },
  sky: { badge: "rgba(3,105,161,0.13)", badgeBorder: "rgba(56,189,248,0.38)", badgeText: "#38BDF8" },
};

export const PageHero = memo(function PageHero({
  title, subtitle, icon, badge,
  colorScheme = "gold", compact = false, className = "", children,
}) {
  const sc = HERO_SCHEMES[colorScheme] ?? HERO_SCHEMES.gold;
  return (
    <div className={`page-hero bg-cross-pattern ${compact ? "!pt-15" : ""} ${children ? "!pb-0" : ""} ${className}`}>
      <motion.div
        className={`relative z-10 max-w-4xl mx-auto px-4 ${compact ? "scale-90" : ""}`}
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, ease: [0.22, 1, 0.36, 1] }}>
        {badge && (
          <motion.span className="page-hero-badge"
            style={{ background: sc.badge, borderColor: sc.badgeBorder, color: sc.badgeText }}
            initial={{ opacity: 0, scale: 0.84 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.48, ease: [0.34, 1.56, 0.64, 1] }}>
            {icon && <span className="text-base" aria-hidden="true">{icon}</span>}
            {badge}
          </motion.span>
        )}
        {title && <h1 className={`page-hero-title ${compact ? "!text-4xl" : "pb-1"}`}>{title}</h1>}
        {title && !compact && <div className="page-hero-divider" aria-hidden="true" />}
        {subtitle && <p className={`page-hero-subtitle ${compact ? "text-sm mt-2" : ""}`}>{subtitle}</p>}
      </motion.div>
      {children && (
        <div className={`relative z-10 ${compact ? "mt-0 pb-0" : "mt-5 pb-8"}`}>{children}</div>
      )}
    </div>
  );
});

/* ====================================================================
   NeonCard
   ==================================================================== */

const NEON_THEME = {
  gold: { glow: "rgba(201,168,76,0.48)", border: "hover:border-amber-400/38", via: "via-amber-400/18", bg: "bg-amber-400/18" },
  royal: { glow: "rgba(26,86,219,0.48)", border: "hover:border-blue-500/38", via: "via-blue-500/18", bg: "bg-blue-500/18" },
  violet: { glow: "rgba(109,40,217,0.48)", border: "hover:border-violet-500/38", via: "via-violet-500/18", bg: "bg-violet-500/18" },
  sky: { glow: "rgba(56,189,248,0.48)", border: "hover:border-sky-400/38", via: "via-sky-400/18", bg: "bg-sky-400/18" },
  rose: { glow: "rgba(190,18,60,0.48)", border: "hover:border-rose-600/38", via: "via-rose-600/18", bg: "bg-rose-600/18" },
};

export const NeonCard = memo(function NeonCard({ children, className = "", color = "gold", hover = true }) {
  const tc = NEON_THEME[color] ?? NEON_THEME.gold;
  return (
    <div className="neon-card-wrapper w-full h-full">
      {hover && <div className="fog-mist" aria-hidden="true" />}
      <div className={`glass-card group relative w-full h-full border-white/10 ${tc.border} ${hover ? "glass-card-hover-active" : ""} ${className}`}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]" aria-hidden="true">
          <div className={`absolute -inset-[100%] opacity-0 group-hover:opacity-25 transition-opacity duration-500`}
            style={{ background: `radial-gradient(circle at 50% 50%,${tc.glow} 0%,transparent 70%)` }} />
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-16 bg-gradient-to-br from-transparent ${tc.via} to-transparent`} />
        </div>
        <div className="relative z-10 h-full overflow-visible">{children}</div>
        <div className="absolute inset-0 pointer-events-none z-30 opacity-0 group-hover:opacity-50 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 left-0 w-[200%] h-[200%] animate-pulse"
            style={{ background: "radial-gradient(circle at 50% 50%,rgba(255,255,255,0.10) 0%,transparent 10%)", animationDuration: "4s" }} />
        </div>
        <div className={`absolute -inset-2 opacity-0 group-hover:opacity-7 transition-opacity duration-700 -z-10 ${tc.bg} rounded-[inherit]`} aria-hidden="true" />
      </div>
    </div>
  );
});

/* ====================================================================
   RainbowCard
   ==================================================================== */

export const RainbowCard = memo(function RainbowCard({ children, className = "" }) {
  return (
    <div className={`card-rainbow ${className}`}>
      <div className="card-rainbow-inner p-6 h-full">{children}</div>
    </div>
  );
});

/* ====================================================================
   SectionHeading
   ==================================================================== */

export const SectionHeading = memo(function SectionHeading({
  badge, title, subtitle, center = true, gradient = "text-gradient-gold",
}) {
  const align = center ? "text-center items-center" : "text-left items-start";
  return (
    <FadeUp className={`flex flex-col ${align} mb-14`}>
      {badge && <span className="section-label mb-4">{badge}</span>}
      <h2 className={`text-headline ${gradient}`}>{title}</h2>
      <div className="w-24 h-1 rounded-full mt-5 animate-aurora" style={{ backgroundSize: "200% 100%" }} aria-hidden="true" />
      {subtitle && (
        <p className="mt-5 text-[rgba(245,223,160,0.68)] text-lg font-medium max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </FadeUp>
  );
});

/* ====================================================================
   StatCard
   ==================================================================== */

export const StatCard = memo(function StatCard({ value, label, icon, gradient = "text-gradient-gold" }) {
  return (
    <ScaleIn>
      <div className="stat-card group cursor-default">
        {icon && <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">{icon}</div>}
        <div className={`stat-value ${gradient}`}>{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </ScaleIn>
  );
});

/* ====================================================================
   FloatingBadge
   ==================================================================== */

export const FloatingBadge = memo(function FloatingBadge({
  children,
  color = "#E8C96D",
  bg = "rgba(201,168,76,0.11)",
}) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
      style={{ background: bg, border: `1px solid ${color}44`, color }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      {children}
    </motion.span>
  );
});

/* ====================================================================
   Aliases
   ==================================================================== */

export const GlassCard = memo(function GlassCard({ children, className = "", hover = true, style = {} }) {
  return <NeonCard className={className} hover={hover} style={style}>{children}</NeonCard>;
});
export const NumberStat = memo(function NumberStat({ value, label, icon }) {
  return <StatCard value={value} label={label} icon={icon} />;
});