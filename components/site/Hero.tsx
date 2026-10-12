"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroStack } from "@/components/site/HeroStack";
import { Magnetic } from "@/components/site/Magnetic";
import { EASE, MaskLine } from "@/components/site/Reveal";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
});

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col pt-24 sm:pt-28">
      <div className="mx-auto grid w-full max-w-[1240px] flex-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-12">
        <div className="relative z-10 lg:col-span-7">
          <motion.p {...fade(0.1)} className="label">
            <span className="text-ice">(01)</span> B.Tech IT · Jabalpur Engineering College
          </motion.p>

          <h1 className="mt-6 text-[clamp(60px,10.4vw,152px)] font-semibold leading-[0.86] tracking-[-0.058em]">
            <MaskLine delay={0.15}>Abhinav</MaskLine>
            <MaskLine delay={0.27}>
              Kashyap<span className="text-ice">.</span>
            </MaskLine>
          </h1>

          <motion.p
            {...fade(0.55)}
            className="mt-7 max-w-[34rem] font-serif text-[clamp(26px,2.9vw,40px)] leading-[1.08] tracking-[-0.01em] text-fog/90"
          >
            Software that’s <em className="text-ice">correct first</em>, clear second, and fast where it counts.
          </motion.p>

          <motion.p {...fade(0.68)} className="mt-5 max-w-md text-[15px] leading-relaxed text-mist">
            I’m an IT student who learns by building real, working things — encrypted tools, APIs, and interfaces —
            on a strong data structures and algorithms foundation.
          </motion.p>

          <motion.div {...fade(0.8)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-fog px-6 text-[15px] font-medium text-ink transition-colors hover:bg-white"
              >
                Selected work
                <ArrowDown size={16} className="transition-transform duration-500 group-hover:translate-y-0.5" aria-hidden />
              </a>
            </Magnetic>
            <Link
              href="/resume"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-[15px] text-fog transition hover:border-fog/40 hover:bg-white/[0.03]"
            >
              Resume
              <ArrowUpRight
                size={16}
                className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <span className="inline-flex items-center gap-2 px-2 text-[13px] text-mist">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
              Open to internships
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="relative lg:col-span-5"
        >
          <HeroStack />
        </motion.div>
      </div>

      <motion.div
        {...fade(1.1)}
        className="mx-auto mt-6 w-full max-w-[1240px] px-5 pb-6 sm:px-8 lg:px-12"
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 sm:grid-cols-4">
          {[
            ["Focus", "Full-stack · DSA"],
            ["Based in", "Jabalpur, India"],
            ["Off-screen", "State-level badminton"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="label">{k}</div>
              <div className="mt-1 text-sm text-fog">{v}</div>
            </div>
          ))}
          <a href="#work" className="group flex items-end justify-end gap-3 text-sm text-mist hover:text-fog" aria-label="Scroll to selected work">
            <span className="label transition-colors group-hover:text-fog">Scroll</span>
            <span className="scroll-cue relative h-10 w-px overflow-hidden bg-line-strong" aria-hidden />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
