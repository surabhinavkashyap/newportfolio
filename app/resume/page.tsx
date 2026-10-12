"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

const projects = [
  {
    name: "Secure Vault",
    detail:
      "Local-first password manager. Entries are encrypted in the browser with AES-256-GCM before storage, with auto-lock, a security center, and encrypted backups.",
    href: "https://github.com/surabhinavkashyap/secure-vault-2.0",
  },
  {
    name: "URL Shortener",
    detail:
      "Express and MongoDB service that issues short codes, redirects visitors, and tracks clicks. Live as Snip.io.",
    href: "https://github.com/surabhinavkashyap/url-shortener",
  },
  {
    name: "Queue Manager",
    detail:
      "React dashboard for a customer queue: add a person, assign a service, and move them from waiting to completed. Saved in the browser.",
    href: "https://github.com/surabhinavkashyap/queue-management-",
  },
  {
    name: "Badminton Score Tracker",
    detail:
      "Match scorer with 21-point games, win by two, a 30-point cap, best of 3 or 5, serving side, and voice input.",
    href: "https://github.com/surabhinavkashyap/badminton-counter",
  },
];

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-[#e8e6e1] text-[#161616] px-4 py-8 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between print:hidden">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black">
          <ArrowLeft size={16} /> Portfolio
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-black px-4 h-9 text-sm text-white"
        >
          Save as PDF <Download size={14} />
        </button>
      </div>

      <article className="resume-sheet max-w-3xl mx-auto bg-white text-[#161616] shadow-xl print:shadow-none px-8 py-10 md:px-12 md:py-12">
        <header className="border-b border-black/10 pb-5">
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">Abhinav Kashyap</h1>
          <p className="mt-1 text-lg text-black/70">Software engineer · B.Tech IT</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/70">
            <span>Jabalpur, Madhya Pradesh</span>
            <a href="mailto:abhinavkashyap070707@gmail.com">abhinavkashyap070707@gmail.com</a>
            <a href="https://github.com/surabhinavkashyap">github.com/surabhinavkashyap</a>
            <a href="https://www.linkedin.com/in/abhinav-kashyap-58b033327">LinkedIn</a>
          </p>
        </header>

        <section className="mt-6">
          <h2 className="text-xs tracking-[1.6px] text-black/45">SUMMARY</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-black/80">
            B.Tech Information Technology student at Jabalpur Engineering College (JEC ’28).
            I build practical web software — encrypted tools, APIs, and interfaces — and I keep a
            strong foundation in data structures and algorithms. I also compete in badminton at the state level.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xs tracking-[1.6px] text-black/45">EDUCATION</h2>
          <div className="mt-2">
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-medium">B.Tech, Information Technology</p>
                <p className="text-sm text-black/65">Jabalpur Engineering College, Jabalpur</p>
              </div>
              <p className="text-sm text-black/55 shrink-0">Batch of 2028</p>
            </div>
            <p className="mt-2 text-sm text-black/70">Higher secondary 85% · Secondary 93%</p>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-xs tracking-[1.6px] text-black/45">PROJECTS</h2>
          <ul className="mt-2 space-y-3">
            {projects.map((project) => (
              <li key={project.name}>
                <a href={project.href} className="font-medium hover:underline">
                  {project.name}
                </a>
                <p className="text-sm leading-relaxed text-black/70">{project.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-xs tracking-[1.6px] text-black/45">SKILLS</h2>
          <p className="mt-2 text-sm leading-relaxed text-black/75">
            <span className="text-black/50">Frontend — </span>
            HTML, CSS, JavaScript, React.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-black/75">
            <span className="text-black/50">Backend — </span>
            Node.js &amp; Express.js, Python, REST API design, authentication &amp; authorization, database design,
            asynchronous processing, API integrations &amp; webhooks, error handling &amp; system architecture.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-black/75">
            <span className="text-black/50">AI engineering — </span>
            LLM application development, prompt engineering &amp; structured outputs, RAG, embeddings &amp; vector
            databases, semantic search, AI agents &amp; tool calling, agentic workflows, multi-agent systems,
            evaluation &amp; guardrails, n8n automation.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-black/75">
            <span className="text-black/50">Production — </span>
            Git &amp; GitHub, Docker, CI/CD, cloud deployment, logging &amp; monitoring, testing &amp; reliability,
            LLM cost &amp; latency optimization.
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-black/75">
            <span className="text-black/50">DSA — </span>
            Arrays, linked lists, trees, graphs, dynamic programming, binary search, heaps, sliding window,
            recursion, and backtracking.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xs tracking-[1.6px] text-black/45">ALSO</h2>
          <p className="mt-2 text-sm text-black/75">
            State-level badminton. Open to internships and collaborations.
          </p>
        </section>
      </article>
    </main>
  );
}
