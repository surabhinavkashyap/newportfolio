import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BadmintonScorer } from "@/components/BadmintonScorer";

export const metadata: Metadata = {
  title: "Badminton Score Tracker — Abhinav Kashyap",
  description: "Badminton scoring with 21-point games, win by two, a 30-point cap, best of 3 or 5, serving side, voice input, and match history.",
};

const RULES = [
  ["21 to win", "A game ends at 21 with a two-point lead."],
  ["Capped at 30", "From 29–29 the next rally wins the game."],
  ["Serving side", "Right court on an even score, left on odd."],
  ["Undo anything", "Every rally is reversible, even after a game ends."],
];

export default function BadmintonPage() {
  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[80vh]" />
      <main className="relative mx-auto max-w-[1240px] px-4 pb-20 pt-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link href="/#badminton-score" className="link-draw inline-flex items-center gap-2 text-sm text-mist hover:text-fog">
            <ArrowLeft size={15} aria-hidden /> Portfolio
          </Link>
          <a
            href="https://github.com/surabhinavkashyap/badminton-counter"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] text-fog transition hover:bg-fog hover:text-ink"
          >
            Source <ArrowUpRight size={13} aria-hidden />
          </a>
        </div>

        <header className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label">
              <span className="text-ice">(03)</span> Interactive · Rules engine
            </p>
            <h1 className="mt-4 text-[clamp(44px,7vw,96px)] font-semibold leading-[0.9] tracking-[-0.05em]">
              Badminton
              <span className="block font-serif font-normal italic tracking-[-0.02em] text-ice">score tracker.</span>
            </h1>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 lg:col-span-5">
            {RULES.map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-fog">{k}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-mist">{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-10">
          <BadmintonScorer />
        </div>
      </main>
    </div>
  );
}
