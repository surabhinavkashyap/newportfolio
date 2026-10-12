"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { History, Mic, MicOff, PencilLine, RotateCcw, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { launchConfetti } from "@/lib/confetti";
import {
  type BestOf,
  type GameMode,
  type MatchState,
  type Side,
  POINT_CAP,
  currentGameNumber,
  gamePointFor,
  gamesToWin,
  initialMatch,
  isDeuce,
  isMatchPoint,
  matchWinner,
  scoreRally,
  serviceCourt,
} from "@/lib/badminton";

interface MatchRecord {
  id: string;
  date: string;
  mode: GameMode;
  bestOf: number;
  playerA: string;
  playerB: string;
  setsA: number;
  setsB: number;
  finalScore: string;
  completed?: boolean;
}

const HISTORY_KEY = "badminton-match-history";
const UNDO_LIMIT = 300;

function loadHistory(): MatchRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export function BadmintonScorer() {
  const [mode, setMode] = useState<GameMode>("singles");
  const [bestOf, setBestOf] = useState<BestOf>(3);
  const [match, setMatch] = useState<MatchState>(() => initialMatch());
  const [undoStack, setUndoStack] = useState<MatchState[]>([]);
  // Refs hold the latest state so rallies scored before a re-render (fast taps, voice) never overwrite each other.
  const matchRef = useRef(match);
  const stackRef = useRef(undoStack);
  const commit = useCallback((next: MatchState, stack: MatchState[]) => {
    matchRef.current = next;
    stackRef.current = stack;
    setMatch(next);
    setUndoStack(stack);
  }, []);
  const [names, setNames] = useState({ A: "Player A", B: "Player B" });
  const [editingNames, setEditingNames] = useState(false);
  const [log, setLog] = useState<string[]>(["Match started"]);
  const [history, setHistory] = useState<MatchRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    // localStorage is only available after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
  }, []);

  const saveHistory = useCallback((next: MatchRecord[]) => {
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }, []);

  const winner = matchWinner(match, bestOf);
  const gamePoint = gamePointFor(match.a, match.b);
  const matchPoint = isMatchPoint(match, bestOf);
  const goldenPoint = match.a === POINT_CAP - 1 && match.b === POINT_CAP - 1;
  const deuce = isDeuce(match.a, match.b);
  const court = serviceCourt(match);
  const gameNo = currentGameNumber(match);
  const deciding = match.gamesA === gamesToWin(bestOf) - 1 && match.gamesB === gamesToWin(bestOf) - 1;

  const record = useCallback(
    (state: MatchState, completed: boolean): MatchRecord => ({
      id: Date.now().toString(36),
      date: new Date().toLocaleDateString(),
      mode,
      bestOf,
      playerA: names.A,
      playerB: names.B,
      setsA: state.gamesA,
      setsB: state.gamesB,
      finalScore: state.completedGames.map((g) => `${g.a}–${g.b}`).join(", ") || `${state.gamesA}–${state.gamesB}`,
      completed,
    }),
    [mode, bestOf, names]
  );

  const addPoint = useCallback(
    (side: Side) => {
      const current = matchRef.current;
      if (matchWinner(current, bestOf)) {
        toast("Match finished — start a new one to keep scoring.");
        return;
      }
      const next = scoreRally(current, side, bestOf);
      commit(next, [...stackRef.current, current].slice(-UNDO_LIMIT));

      const finishedGame = next.completedGames.length > current.completedGames.length;
      if (!finishedGame) {
        setLog((l) => [`Point ${names[side]} · ${next.a}–${next.b}`, ...l].slice(0, 40));
        return;
      }

      const g = next.completedGames[next.completedGames.length - 1];
      const entries = [`Game ${next.completedGames.length} to ${names[g.winner]} · ${g.a}–${g.b}`];
      const mw = matchWinner(next, bestOf);
      if (mw) {
        entries.unshift(`Match to ${names[mw]} · ${next.gamesA}–${next.gamesB}`);
        saveHistory([record(next, true), ...history].slice(0, 12));
        toast.success(`${names[mw]} wins the match`);
        launchConfetti(140);
      } else {
        toast(`Game to ${names[g.winner]} (${g.a}–${g.b})`);
        launchConfetti(40);
      }
      setLog((l) => [...entries, ...l].slice(0, 40));
    },
    [commit, bestOf, names, history, record, saveHistory]
  );

  const undo = useCallback(() => {
    if (matchWinner(matchRef.current, bestOf)) {
      toast("The match is over — start a new match instead.");
      return;
    }
    const stack = stackRef.current;
    const prev = stack[stack.length - 1];
    if (!prev) {
      toast("Nothing to undo yet.");
      return;
    }
    commit(prev, stack.slice(0, -1));
    setLog((l) => [`Undo · back to ${prev.a}–${prev.b}`, ...l].slice(0, 40));
  }, [commit, bestOf]);

  const resetGame = useCallback(() => {
    const current = matchRef.current;
    if (matchWinner(current, bestOf) || (current.a === 0 && current.b === 0)) return;
    commit({ ...current, a: 0, b: 0 }, [...stackRef.current, current].slice(-UNDO_LIMIT));
    setLog((l) => [`Game ${currentGameNumber(current)} reset to 0–0`, ...l].slice(0, 40));
  }, [commit, bestOf]);

  const newMatch = useCallback(
    (opts?: { mode?: GameMode; bestOf?: BestOf }) => {
      const current = matchRef.current;
      const played = current.completedGames.length > 0;
      if (played && !matchWinner(current, bestOf)) {
        saveHistory([record(current, false), ...history].slice(0, 12));
      }
      if (opts?.mode) setMode(opts.mode);
      if (opts?.bestOf) setBestOf(opts.bestOf);
      commit(initialMatch(), []);
      setLog(["New match started"]);
    },
    [commit, bestOf, history, record, saveHistory]
  );

  const toggleVoice = useCallback(() => {
    const w = window as SpeechWindow;
    const SpeechRec = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SpeechRec) {
      toast.error("Voice input isn’t supported in this browser — try Chrome.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const said = event.results[0][0].transcript.toLowerCase().trim();
      if (said.includes("undo")) undo();
      else if (said.includes("new match") || said.includes("reset")) newMatch();
      else if (said.includes("player a") || said.includes("a point") || said.includes(names.A.toLowerCase())) addPoint("A");
      else if (said.includes("player b") || said.includes("b point") || said.includes(names.B.toLowerCase())) addPoint("B");
      else toast(`Heard “${said}” — try “point A”, “point B”, or “undo”.`);
    };
    recognition.onerror = () => {
      setListening(false);
      toast.error("Couldn’t hear that. Try again.");
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, names, addPoint, undo, newMatch]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable]");
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === "a" || e.key === "ArrowLeft") {
        e.preventDefault();
        addPoint("A");
      } else if (key === "l" || e.key === "ArrowRight") {
        e.preventDefault();
        addPoint("B");
      } else if (key === "u" || key === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [addPoint, undo]);

  const status = winner
    ? `${names[winner]} won the match`
    : goldenPoint
      ? "Golden point — next rally wins the game"
      : matchPoint
        ? `Match point · ${names[matchPoint]}`
        : gamePoint
          ? `Game point · ${names[gamePoint]}`
          : deuce
            ? "Deuce — win by two"
            : `${match.a + match.b === 0 ? "First to 21" : "21 to win · win by two"}`;

  const flagTone = winner ? "text-signal" : goldenPoint || matchPoint ? "text-ember" : gamePoint ? "text-ice" : "text-mist";

  return (
    <section aria-label="Badminton scorer" className="surface overflow-hidden rounded-[28px]">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3 sm:px-6">
        <Segmented
          label="Match type"
          value={mode}
          options={[
            { value: "singles", label: "Singles" },
            { value: "doubles", label: "Doubles" },
          ]}
          onChange={(v) => v !== mode && newMatch({ mode: v as GameMode })}
        />
        <Segmented
          label="Match length"
          value={String(bestOf)}
          options={[
            { value: "3", label: "Best of 3" },
            { value: "5", label: "Best of 5" },
          ]}
          onChange={(v) => Number(v) !== bestOf && newMatch({ bestOf: Number(v) as BestOf })}
        />
        <div className="ml-auto flex flex-wrap gap-2">
          <ToolButton active={editingNames} onClick={() => setEditingNames((v) => !v)} icon={<PencilLine size={15} />}>
            Names
          </ToolButton>
          <ToolButton active={listening} tone="ember" onClick={toggleVoice} icon={listening ? <MicOff size={15} /> : <Mic size={15} />}>
            {listening ? "Listening…" : "Voice"}
          </ToolButton>
          <ToolButton active={showHistory} onClick={() => setShowHistory((v) => !v)} icon={<History size={15} />}>
            History{history.length ? ` · ${history.length}` : ""}
          </ToolButton>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {editingNames && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-line"
          >
            <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:px-6">
              {(["A", "B"] as const).map((side) => (
                <label key={side} className="block">
                  <span className="label">{mode === "doubles" ? "Team" : "Player"} {side}</span>
                  <input
                    value={names[side]}
                    maxLength={24}
                    onChange={(e) => setNames((n) => ({ ...n, [side]: e.target.value || `Player ${side}` }))}
                    className="mt-1.5 w-full border-b border-line-strong bg-transparent pb-1.5 text-lg text-fog outline-none transition focus:border-ice"
                  />
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Board */}
      <div className="px-4 pb-6 pt-5 sm:px-6 sm:pt-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <div className="label">
            {winner ? "Final" : deciding ? "Deciding game" : `Game ${gameNo}`} · Best of {bestOf} · {mode}
          </div>
          <div aria-live="polite" className={`font-mono text-xs tracking-wide ${flagTone}`}>
            {status}
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-2 sm:gap-3">
          {(["A", "B"] as const).map((side) => {
            const points = side === "A" ? match.a : match.b;
            const games = side === "A" ? match.gamesA : match.gamesB;
            const serving = !winner && match.server === side;
            const won = winner === side;
            return (
              <button
                key={side}
                type="button"
                onClick={() => addPoint(side)}
                disabled={!!winner}
                aria-label={`Point to ${names[side]}. Score ${points}, games ${games}.`}
                className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[22px] border p-4 text-left transition duration-300 sm:min-h-[300px] sm:p-6 ${
                  won
                    ? "border-signal/40 bg-signal/[0.06]"
                    : serving
                      ? "border-ice/30 bg-volt/[0.06]"
                      : "border-line bg-coal hover:border-line-strong"
                } enabled:active:scale-[0.99] disabled:cursor-default`}
              >
                <span aria-hidden className="pointer-events-none absolute inset-x-6 top-1/2 h-px bg-line" />
                <span className="relative flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-fog">{names[side]}</span>
                  <span className="flex gap-1" aria-hidden>
                    {Array.from({ length: gamesToWin(bestOf) }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-4 rounded-full transition-colors duration-500 ${i < games ? "bg-ice" : "bg-white/10"}`}
                      />
                    ))}
                  </span>
                </span>

                <span className="relative block text-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={points}
                      initial={{ y: "40%", opacity: 0, filter: "blur(6px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: "-40%", opacity: 0, filter: "blur(6px)" }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      className="tnum block text-[88px] font-semibold leading-none tracking-[-0.06em] text-fog sm:text-[140px]"
                    >
                      {points}
                    </motion.span>
                  </AnimatePresence>
                </span>

                <span className="relative flex items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                  <span className={serving ? "text-ice" : "text-mute"}>
                    {serving ? `Serving · ${court} court` : won ? "Winner" : "Receiving"}
                  </span>
                  <span className="hidden text-mute transition group-hover:text-mist sm:inline">
                    {side === "A" ? "A / ←" : "L / →"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Completed games */}
        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2">
          <span className="label mr-1">Games</span>
          {match.completedGames.length === 0 && <span className="font-mono text-xs text-mute">None yet</span>}
          {match.completedGames.map((g, i) => (
            <span key={i} className="tnum rounded-full border border-line px-3 py-1 font-mono text-xs text-mist">
              G{i + 1} <span className={g.winner === "A" ? "text-fog" : ""}>{g.a}</span>–
              <span className={g.winner === "B" ? "text-fog" : ""}>{g.b}</span>
            </span>
          ))}
          <span className="tnum ml-auto font-mono text-sm text-fog">
            {match.gamesA} <span className="text-mute">—</span> {match.gamesB}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <ActionButton onClick={undo} disabled={!undoStack.length || !!winner} icon={<Undo2 size={15} />}>
            Undo rally
          </ActionButton>
          <ActionButton onClick={resetGame} disabled={!!winner || (match.a === 0 && match.b === 0)}>
            Reset this game
          </ActionButton>
          <ActionButton onClick={() => newMatch()} primary icon={<RotateCcw size={15} />}>
            New match
          </ActionButton>
        </div>
      </div>

      {/* Log and history */}
      <div className="grid border-t border-line md:grid-cols-2">
        <div className="px-4 py-4 sm:px-6">
          <div className="label mb-2">Rally log</div>
          <ol className="max-h-32 space-y-1 overflow-y-auto pr-2 font-mono text-xs text-mist" data-lenis-prevent>
            {log.map((entry, i) => (
              <li key={`${i}-${entry}`} className={i === 0 ? "text-fog" : ""}>
                {entry}
              </li>
            ))}
          </ol>
        </div>
        <div className="border-t border-line px-4 py-4 sm:px-6 md:border-l md:border-t-0">
          <div className="label mb-2">Shortcuts</div>
          <p className="text-xs leading-relaxed text-mist">
            <Kbd>A</Kbd> or <Kbd>←</Kbd> point left · <Kbd>L</Kbd> or <Kbd>→</Kbd> point right · <Kbd>U</Kbd> undo. Voice: “point A”, “point B”, “undo”, “new match”.
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line"
          >
            <div className="px-4 py-4 sm:px-6">
              <div className="label mb-3">Recent matches · saved on this device</div>
              {history.length === 0 ? (
                <p className="text-sm text-mist">Finished matches will appear here.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {history.map((m) => (
                    <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                      <span className="text-mist">
                        {m.date} · {m.mode} · Bo{m.bestOf}
                        {m.completed === false && <span className="ml-2 text-ember">unfinished</span>}
                      </span>
                      <span className="tnum font-mono text-xs text-fog">
                        {m.playerA} {m.setsA}–{m.setsB} {m.playerB}
                        <span className="ml-2 text-mute">{m.finalScore}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="relative flex rounded-full border border-line bg-coal p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`relative h-8 rounded-full px-3.5 text-xs font-medium transition-colors ${active ? "text-ink" : "text-mist hover:text-fog"}`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 rounded-full bg-fog"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ToolButton({
  children,
  icon,
  active,
  tone = "ice",
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
  tone?: "ice" | "ember";
  onClick: () => void;
}) {
  const activeCls = tone === "ember" ? "border-ember/40 bg-ember/10 text-ember" : "border-ice/30 bg-volt/10 text-ice";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition ${
        active ? activeCls : "border-line text-mist hover:border-line-strong hover:text-fog"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ActionButton({
  children,
  icon,
  primary,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
        primary ? "bg-fog text-ink hover:bg-white" : "border border-line text-fog hover:border-line-strong hover:bg-white/[0.03]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex min-w-5 items-center justify-center rounded border border-line-strong bg-slate px-1 font-mono text-[10px] text-fog">
      {children}
    </kbd>
  );
}
