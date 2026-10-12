import { ArrowUpRight } from "lucide-react";
import { SectionHead } from "@/components/site/SectionHead";
import { Reveal } from "@/components/site/Reveal";

const PRINCIPLES = [
  {
    title: "Break it into pieces you can test.",
    body: "Rules, state, and interface live apart, so each can be checked on its own and changed without fear.",
    practice:
      "The badminton scorer’s rules — 21 to win, win by two, capped at 30 — are pure functions. The interface only calls them.",
    project: { href: "#badminton-score", label: "Badminton Score Tracker" },
  },
  {
    title: "Correct first. Then clear. Then fast.",
    body: "I would rather handle the rare case than assume it away. Clarity and performance come once the behaviour is right.",
    practice:
      "Snip treats code collisions as real: the database rejects duplicates and the service retries. Clicks use an atomic increment, so concurrent visits are never lost.",
    project: { href: "#url-shortener", label: "Snip — URL Shortener" },
  },
  {
    title: "Learn by building real things.",
    body: "Tutorials explain ideas. A real problem — and a real user — exposes the gaps.",
    practice:
      "Secure Vault started with my own problem, too many accounts, and pushed me into key derivation, authenticated encryption, and where a trust boundary belongs.",
    project: { href: "#secure-vault", label: "Secure Vault" },
  },
];

export function Approach() {
  return (
    <section id="approach" className="relative overflow-hidden border-y border-line bg-coal">
      <div aria-hidden className="glow-ice pointer-events-none absolute -left-1/4 top-0 h-[600px] w-[900px] opacity-40 blur-3xl" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <SectionHead index="05" label="How I work" title="Three rules" accent="I actually follow." />

        <ol className="mt-16">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <li className="group grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-8">
                <span className="tnum font-mono text-sm text-ice lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <div className="lg:col-span-5">
                  <h3 className="text-[clamp(28px,3vw,42px)] font-semibold leading-[1.02] tracking-[-0.04em] text-fog">{p.title}</h3>
                  <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mist">{p.body}</p>
                </div>
                <div className="lg:col-span-6">
                  <div className="rounded-2xl border border-line bg-ink/60 p-5 transition-colors duration-500 group-hover:border-line-strong sm:p-6">
                    <p className="label">In practice</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-fog/90">{p.practice}</p>
                    <a href={p.project.href} className="link-draw mt-4 inline-flex items-center gap-1.5 text-sm text-ice">
                      {p.project.label} <ArrowUpRight size={14} aria-hidden />
                    </a>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
