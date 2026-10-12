"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "framer-motion";
import { KeyRound, Lock, ShieldCheck } from "lucide-react";
import type { ProjectVisual } from "@/lib/projects";
import {
  type MatchState,
  type Side,
  gamePointFor,
  isDeuce,
  scoreRally,
  serviceCourt,
} from "@/lib/badminton";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Advances a counter on an interval, only while the element is on screen and motion is allowed. */
function useTicker(intervalMs: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [inView, reduce, intervalMs]);

  return { ref, tick, still: !!reduce };
}

const HEX = "0123456789abcdef";
function scramble(source: string, progress: number, seed: number) {
  return source
    .split("")
    .map((ch, i) => {
      if (i / source.length < progress) {
        const n = (ch.charCodeAt(0) * 31 + i * 17 + seed * 7) % 16;
        return HEX[n];
      }
      return ch;
    })
    .join("");
}

function VaultVisual() {
  const { ref, tick, still } = useTicker(110);
  const cycle = 46;
  const t = still ? 30 : tick % cycle;
  const progress = Math.min(1, Math.max(0, (t - 6) / 16));
  const seed = Math.floor(tick / cycle);
  const plain = "correct-horse-battery";
  const sent = t > 24;

  return (
    <div ref={ref} className="absolute inset-0 grid grid-cols-[1fr_auto_1fr] gap-3 p-5 sm:gap-5 sm:p-8">
      <div className="flex flex-col justify-center gap-3">
        <span className="label">Browser</span>
        <div className="rounded-2xl border border-line bg-ink/60 p-3 sm:p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">gmail · personal</div>
          <div className="mt-2 break-all font-mono text-[11px] leading-relaxed sm:text-[13px]">
            <span className={progress >= 1 ? "text-ice" : "text-fog"}>{scramble(plain, progress, seed)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[10px] text-mist sm:text-[11px]">
          <KeyRound size={12} className="shrink-0 text-ember" aria-hidden />
          <span className="truncate">PBKDF2 → key · memory only</span>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <div className="h-full w-px border-l border-dashed border-ice/40" />
        <div className="absolute flex h-10 w-10 items-center justify-center rounded-full border border-ice/40 bg-ink text-ice">
          <Lock size={16} aria-hidden />
        </div>
        <motion.span
          aria-hidden
          className="absolute h-2 w-2 rounded-full bg-ice shadow-[0_0_14px_rgba(147,197,255,0.9)]"
          animate={{ x: sent ? 34 : -34, opacity: progress > 0 ? 1 : 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <span className="absolute -bottom-1 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-ice/80 sm:text-[10px]">
          AES-256-GCM
        </span>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <span className="label">API · storage</span>
        <div className="space-y-2 rounded-2xl border border-line bg-ink/60 p-3 sm:p-4">
          {["iv 3a9f…c210", "ct 7c1d…e04b", "tag 91ab…77f0"].map((row, i) => (
            <motion.div
              key={row}
              className="font-mono text-[10px] text-mist sm:text-[12px]"
              animate={{ opacity: sent || still ? 1 : 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {row}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-signal sm:text-[11px]">
          <ShieldCheck size={12} aria-hidden /> ciphertext only
        </div>
      </div>
    </div>
  );
}

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function codeFor(n: number) {
  let out = "";
  let x = (n + 7) * 2654435761;
  for (let i = 0; i < 6; i++) {
    out += CODE_CHARS[Math.abs(x) % 62];
    x = Math.floor(x / 62) + i * 97 + 13;
  }
  return out;
}

function ShortenerVisual() {
  const { ref, tick, still } = useTicker(900);
  const round = Math.floor(tick / 5);
  const step = still ? 4 : tick % 5;
  const collided = round % 3 === 1;
  const code = codeFor(round * 2 + (collided && step >= 2 ? 1 : 0));
  const clicks = still ? 3 : Math.max(0, step - 2) + round * 2;

  const rows = [
    { k: "POST", v: "/api/urls", note: "long URL in" },
    {
      k: "GEN",
      v: collided && step === 1 ? `${codeFor(round * 2)} · E11000 duplicate` : `${code}`,
      note: collided && step === 1 ? "retry 1 of 5" : "6 chars · base62",
      warn: collided && step === 1,
    },
    { k: "SAVE", v: `snip.io/${code}`, note: "unique index" },
    { k: "GET", v: `302 → original`, note: "redirect" },
    { k: "$inc", v: `clicks: ${clicks}`, note: "atomic" },
  ];

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col justify-center gap-2 p-5 sm:gap-2.5 sm:p-8">
      {rows.map((row, i) => {
        const on = still || i <= step;
        return (
          <motion.div
            key={row.k}
            animate={{ opacity: on ? 1 : 0.22, x: on ? 0 : -6 }}
            transition={{ duration: 0.5, ease: EASE }}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2 sm:px-4 sm:py-2.5 ${
              row.warn ? "border-ember/40 bg-ember/[0.06]" : i === step && !still ? "border-ice/30 bg-volt/[0.06]" : "border-line bg-ink/50"
            }`}
          >
            <span className={`w-11 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] ${row.warn ? "text-ember" : "text-ice"}`}>
              {row.k}
            </span>
            <span className="tnum min-w-0 flex-1 truncate font-mono text-[11px] text-fog sm:text-[13px]">{row.v}</span>
            <span className="hidden shrink-0 font-mono text-[10px] text-mute sm:inline">{row.note}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

const QUEUE_STAGES = ["waiting", "in-progress", "completed"] as const;
type Stage = (typeof QUEUE_STAGES)[number];
const STAGE_LABEL: Record<Stage, string> = { waiting: "Waiting", "in-progress": "In progress", completed: "Completed" };

function QueueVisual() {
  const { ref, tick, still } = useTicker(1300);
  const [people, setPeople] = useState(() =>
    [
      { id: 11, service: "Payment", stage: "completed" as Stage },
      { id: 12, service: "Support", stage: "in-progress" as Stage },
      { id: 13, service: "Consultation", stage: "waiting" as Stage },
      { id: 14, service: "Payment", stage: "waiting" as Stage },
    ]
  );

  useEffect(() => {
    if (tick === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPeople((list) => {
      const active = list.find((p) => p.stage === "in-progress");
      let next = list.map((p) => {
        if (active && p.id === active.id) return { ...p, stage: "completed" as Stage };
        return p;
      });
      const firstWaiting = next.find((p) => p.stage === "waiting");
      if (firstWaiting) next = next.map((p) => (p.id === firstWaiting.id ? { ...p, stage: "in-progress" as Stage } : p));
      const done = next.filter((p) => p.stage === "completed");
      if (done.length > 2) next = next.filter((p) => p.id !== done[0].id);
      const maxId = Math.max(...next.map((p) => p.id));
      const services = ["Payment", "Support", "Consultation"];
      return [...next, { id: maxId + 1, service: services[maxId % 3], stage: "waiting" as Stage }];
    });
  }, [tick]);

  return (
    <div ref={ref} className="absolute inset-0 grid grid-cols-3 gap-2 p-4 sm:gap-3 sm:p-8">
      <LayoutGroup>
        {QUEUE_STAGES.map((stage) => {
          const list = people.filter((p) => p.stage === stage);
          return (
            <div key={stage} className="flex min-w-0 flex-col rounded-2xl border border-line bg-ink/50 p-2 sm:p-3">
              <div className="mb-2 flex items-baseline justify-between gap-1">
                <span className="truncate font-mono text-[9px] uppercase tracking-[0.12em] text-mute sm:text-[10px]">
                  {STAGE_LABEL[stage]}
                </span>
                <span className={`tnum font-mono text-sm ${stage === "completed" ? "text-signal" : stage === "in-progress" ? "text-ice" : "text-fog"}`}>
                  {list.length}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <AnimatePresence initial={false}>
                  {list.map((p) => (
                    <motion.div
                      key={p.id}
                      layout={!still}
                      layoutId={`q-${p.id}`}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className={`rounded-lg border px-2 py-1.5 ${
                        stage === "in-progress" ? "border-ice/30 bg-volt/[0.08]" : "border-line bg-graphite"
                      }`}
                    >
                      <div className="tnum truncate font-mono text-[10px] text-fog sm:text-[11px]">#{String(p.id).padStart(3, "0")}</div>
                      <div className="truncate text-[10px] text-mute sm:text-[11px]">{p.service}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </LayoutGroup>
    </div>
  );
}

const RALLY_SCRIPT: Side[] = ["A", "B", "A", "B", "A", "A", "B", "A", "A"];
const RALLY_START: MatchState = { a: 18, b: 19, gamesA: 0, gamesB: 0, server: "B", completedGames: [] };

function ScorerVisual() {
  const { ref, tick, still } = useTicker(1100);
  const steps = still ? 6 : tick % (RALLY_SCRIPT.length + 2);
  let state = RALLY_START;
  for (let i = 0; i < Math.min(steps, RALLY_SCRIPT.length); i++) state = scoreRally(state, RALLY_SCRIPT[i], 3);

  const finished = state.completedGames.length > RALLY_START.completedGames.length;
  const last = state.completedGames[state.completedGames.length - 1];
  const a = finished ? last.a : state.a;
  const b = finished ? last.b : state.b;
  const gp = finished ? null : gamePointFor(a, b);
  const label = finished
    ? `Game to A · ${a}–${b} · win by two`
    : gp
      ? `Game point · ${gp}`
      : isDeuce(a, b)
        ? "Deuce — win by two"
        : "Rally";

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col justify-center gap-4 p-5 sm:p-8">
      <div className="flex items-center justify-between">
        <span className="label">Game 1 · Best of 3</span>
        <span className={`font-mono text-[11px] ${finished ? "text-signal" : gp ? "text-ice" : "text-mist"}`}>{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {(["A", "B"] as const).map((side) => {
          const pts = side === "A" ? a : b;
          const serving = !finished && state.server === side;
          return (
            <div
              key={side}
              className={`relative overflow-hidden rounded-2xl border p-3 transition-colors duration-500 sm:p-4 ${
                serving ? "border-ice/30 bg-volt/[0.06]" : "border-line bg-ink/50"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
                <span>Player {side}</span>
                <span className="flex gap-1">
                  {[0, 1].map((i) => (
                    <span key={i} className={`h-1 w-3 rounded-full ${i < (side === "A" ? state.gamesA : state.gamesB) ? "bg-ice" : "bg-white/10"}`} />
                  ))}
                </span>
              </div>
              <div className="relative mt-1 h-[64px] sm:h-[92px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={pts}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -30, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="tnum absolute inset-0 text-[60px] font-semibold leading-none tracking-[-0.06em] text-fog sm:text-[88px]"
                  >
                    {pts}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className={`mt-1 font-mono text-[10px] uppercase tracking-[0.12em] ${serving ? "text-ice" : "text-mute"}`}>
                {serving ? `Serving · ${serviceCourt(state)}` : "Receiving"}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {RALLY_SCRIPT.map((s, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < steps ? (s === "A" ? "bg-fog/70" : "bg-ice/60") : "bg-white/[0.07]"}`}
          />
        ))}
      </div>
    </div>
  );
}

function AnalyzerVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6">
      <div className="relative h-full max-h-[260px] w-[58%] max-w-[240px] overflow-hidden rounded-xl border border-line bg-ink/60 p-4">
        <div className="h-2.5 w-1/2 rounded-full bg-white/15" />
        <div className="mt-2 h-1.5 w-1/3 rounded-full bg-white/10" />
        {[0.9, 0.75, 0.82, 0.6, 0.88, 0.7, 0.5, 0.8, 0.66].map((w, i) => (
          <div key={i} className="mt-3 h-1.5 rounded-full bg-white/[0.07]" style={{ width: `${w * 100}%` }} />
        ))}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-volt/20 to-transparent"
            initial={{ top: "-20%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

const VISUALS: Record<ProjectVisual, () => React.ReactElement> = {
  vault: VaultVisual,
  shortener: ShortenerVisual,
  queue: QueueVisual,
  scorer: ScorerVisual,
  analyzer: AnalyzerVisual,
};

export function ProjectVisualView({ visual }: { visual: ProjectVisual }) {
  const Component = VISUALS[visual];
  return <Component />;
}
