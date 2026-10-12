"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Lock } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const CARDS = [
  {
    id: "queue-manager",
    index: "04",
    kind: "Frontend · State",
    title: "Queue Manager",
    body: (
      <div className="mt-auto grid grid-cols-3 gap-1.5">
        {[
          ["Waiting", "2", "text-fog"],
          ["Serving", "1", "text-ice"],
          ["Done", "3", "text-signal"],
        ].map(([k, v, c]) => (
          <div key={k} className="rounded-lg border border-line bg-ink/60 px-2 py-1.5">
            <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-mute">{k}</div>
            <div className={`tnum text-lg font-semibold ${c}`}>{v}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "url-shortener",
    index: "02",
    kind: "Backend · API",
    title: "Snip",
    body: (
      <div className="mt-auto space-y-1.5 font-mono text-[11px]">
        <div className="flex justify-between rounded-lg border border-line bg-ink/60 px-2.5 py-1.5">
          <span className="text-fog">snip.io/aZ3kQ9</span>
          <span className="text-ice">302</span>
        </div>
        <div className="flex justify-between px-1 text-mute">
          <span>$inc clicks</span>
          <span className="tnum text-mist">atomic</span>
        </div>
      </div>
    ),
  },
  {
    id: "badminton-score",
    index: "03",
    kind: "Rules engine",
    title: "Scorer",
    body: (
      <div className="mt-auto flex items-end justify-between">
        <div className="tnum text-[46px] font-semibold leading-none tracking-[-0.06em] text-fog">
          21<span className="text-mute">–</span>19
        </div>
        <div className="text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-ice">
          win by
          <br />
          two
        </div>
      </div>
    ),
  },
  {
    id: "secure-vault",
    index: "01",
    kind: "Security · Full-stack",
    title: "Secure Vault",
    body: (
      <div className="mt-auto flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ice/40 text-ice">
          <Lock size={14} aria-hidden />
        </span>
        <span className="truncate font-mono text-[11px] text-mist">9f2c·a71e·04bd·e3c9</span>
      </div>
    ),
  },
];

export function HeroStack() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18 });
  const sy = useSpring(py, { stiffness: 90, damping: 18 });
  const rotateX = useTransform(sy, [-1, 1], [16, 4]);
  const rotateY = useTransform(sx, [-1, 1], [-30, -16]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    setHovered(null);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto aspect-[1/0.95] w-full max-w-[560px] [perspective:1600px]"
    >
      <div aria-hidden className="glow-ice pointer-events-none absolute inset-[12%] rounded-full blur-2xl" />
      <motion.div
        className="absolute left-[3%] top-[42%] h-[46%] w-[60%] sm:left-[6%] sm:w-[68%] [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        {CARDS.map((card, i) => {
          const depth = CARDS.length - 1 - i;
          const raised = hovered === i;
          const dimmed = hovered !== null && !raised;
          return (
            <motion.a
              key={card.id}
              href={`#${card.id}`}
              aria-label={`${card.title} — jump to project`}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              initial={{ opacity: 0, x: `${depth * 8}%`, y: depth * -62 + 60, z: depth * -90 - 120 }}
              animate={{
                opacity: dimmed ? 0.55 : 1,
                x: `${depth * 8}%`,
                y: depth * -62 + (raised ? -14 : 0),
                z: depth * -90 + (raised ? 60 : 0),
              }}
              transition={{
                duration: 1.2,
                ease: EASE,
                delay: hovered === null ? 0.45 + (CARDS.length - i) * 0.1 : 0,
                opacity: { duration: 0.5 },
              }}
              className={`absolute inset-0 flex flex-col rounded-[18px] border p-4 transition-colors duration-500 sm:p-5 ${
                raised ? "border-ice/50" : "border-line-strong"
              }`}
              style={{
                background: "linear-gradient(160deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.015) 45%), #111418",
                boxShadow: "0 40px 60px -30px rgb(0 0 0 / 0.95), 0 1px 0 rgb(255 255 255 / 0.06) inset",
              }}
            >
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-mute">
                <span>
                  <span className="text-ice">{card.index}</span> · {card.kind}
                </span>
              </div>
              <div className="mt-1.5 text-lg font-semibold tracking-[-0.03em] text-fog">{card.title}</div>
              {card.body}
            </motion.a>
          );
        })}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="label absolute -bottom-[2%] left-1/2 -translate-x-1/2 whitespace-nowrap"
      >
        Fig. 00 — Four builds, stacked
      </motion.p>
    </div>
  );
}
