export type ProjectVisual = "vault" | "shortener" | "queue" | "scorer" | "analyzer";

export interface Project {
  id: string;
  title: string;
  kind: string;
  tagline: string;
  summary: string;
  details: string;
  role: string;
  engineering: string[];
  tech: string[];
  status: "Live" | "Completed" | "In progress";
  statusNote?: string;
  links: {
    live?: string;
    source?: string;
    internal?: { href: string; label: string };
  };
  visual: ProjectVisual;
  caption: string;
}

export const projects: Project[] = [
  {
    id: "secure-vault",
    title: "Secure Vault",
    kind: "Security · Full-stack",
    tagline: "A password manager that never lets the server see a password.",
    summary:
      "Built because I had too many accounts — four Gmail ones alone — and kept ending up on “forgot password”. Every entry is encrypted in the browser before the API ever receives it.",
    details:
      "Passwords, usernames, URLs, tags, and notes are encrypted client-side with AES-256-GCM. The key is derived from the master password with PBKDF2 and lives only in browser memory, so losing the master password means losing access by design. Around that core: a security center, auto-lock, timed clipboard clearing, encrypted backups, and keyboard shortcuts.",
    role: "Designed and built end to end",
    engineering: [
      "AES-256-GCM in the browser; PBKDF2-derived key kept only in memory",
      "Security center flags weak, reused, and aging passwords",
      "Inactivity auto-lock and timed clipboard clearing",
      "Encrypted .svault export and import with duplicate detection",
    ],
    tech: ["React", "Vite", "Node.js", "AES-256-GCM", "PBKDF2"],
    status: "Live",
    links: {
      live: "https://secure-vault-fullstackk.vercel.app",
      source: "https://github.com/surabhinavkashyap/secure-vault-2.0",
    },
    visual: "vault",
    caption: "Diagram — where encryption happens",
  },
  {
    id: "url-shortener",
    title: "Snip — URL Shortener",
    kind: "Backend · API",
    tagline: "Short links that redirect fast and count every click.",
    summary:
      "An Express and MongoDB service with a React client. It issues six-character codes, redirects visitors, and keeps click counts honest under concurrent traffic.",
    details:
      "Codes are drawn from a 62-character alphabet. Uniqueness is enforced by the database rather than assumed: a duplicate-key error triggers a retry, up to five attempts. Redirects increment the click count with an atomic $inc instead of a read-then-write, and the recent-links list is paginated newest first.",
    role: "Designed and built end to end",
    engineering: [
      "Base62 codes with collision retry on duplicate-key errors",
      "Atomic click counting with $inc — no lost updates",
      "Paginated recent-links API, newest first",
    ],
    tech: ["Node.js", "Express", "MongoDB", "Mongoose", "React"],
    status: "Live",
    links: {
      live: "https://url-shortener-silk-five.vercel.app",
      source: "https://github.com/surabhinavkashyap/url-shortener",
    },
    visual: "shortener",
    caption: "Diagram — the life of a short link",
  },
  {
    id: "badminton-score",
    title: "Badminton Score Tracker",
    kind: "Interactive · Rules engine",
    tagline: "A scoreboard I can trust on court, because the rules live in code.",
    summary:
      "I play competitive badminton, so I built the scorer I wanted: 21-point games, win by two, sets, serving side, voice input, and a match history that stays on the device.",
    details:
      "The scoring rules are pure functions, separate from the interface: 21 to win, win by two, capped at 30, best of three or five. The board tracks who serves and from which court, flags game and match point, undoes any rally — even across a finished game — and accepts points by voice.",
    role: "Solo builder — and the person using it",
    engineering: [
      "21 points, win by two, capped at 30 — enforced in pure functions",
      "Serving side derived from the server’s score",
      "Full undo history, including across game boundaries",
      "Voice scoring with the Web Speech API",
    ],
    tech: ["React", "TypeScript", "Tailwind", "Web Speech API"],
    status: "Live",
    links: {
      internal: { href: "/badminton", label: "Open the scorer" },
      source: "https://github.com/surabhinavkashyap/badminton-counter",
    },
    visual: "scorer",
    caption: "Live rules preview — real scoring logic",
  },
  {
    id: "queue-manager",
    title: "Queue Manager",
    kind: "Frontend · State",
    tagline: "A service counter’s line, moved from paper to a dashboard.",
    summary:
      "Staff add a customer and a service, then move them from waiting to in progress to completed. Counts update instantly and the line survives a refresh.",
    details:
      "One array of customers is the single source of truth; the waiting, in-progress, and completed counts are derived from it rather than stored separately. The queue is persisted to localStorage, and reading it back is defensive — malformed data falls back to an empty queue instead of crashing the page.",
    role: "Designed and built end to end",
    engineering: [
      "Status flow: waiting → in progress → completed",
      "Counts derived from one source of state, never duplicated",
      "localStorage persistence with safe parsing",
    ],
    tech: ["React", "Vite", "CSS"],
    status: "Live",
    links: {
      live: "https://queue-management-ashen.vercel.app",
      source: "https://github.com/surabhinavkashyap/queue-management-",
    },
    visual: "queue",
    caption: "Diagram — the status flow",
  },
  {
    id: "resume-analyzer",
    title: "AI Resume Analyzer",
    kind: "AI · In progress",
    tagline: "Specific, actionable feedback on a resume — not vague advice.",
    summary:
      "Upload a resume PDF and get ATS compatibility scoring, keyword analysis, and section-by-section suggestions from an LLM. I’m still building it.",
    details:
      "The plan: parse the PDF cleanly, run a structured analysis, and return feedback in a format someone can act on immediately. It is not public yet.",
    role: "Full-stack and LLM integration",
    engineering: [],
    tech: ["Next.js", "TypeScript", "PDF.js", "LLM API"],
    status: "In progress",
    links: {},
    visual: "analyzer",
    caption: "Concept — not yet released",
  },
];
