"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ITEMS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
        const current = ITEMS.find((i) => visible.get(i.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-2 sm:top-5"
    >
      <nav
        aria-label="Primary"
        className={`flex items-center gap-0.5 rounded-full border p-1 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ${
          scrolled
            ? "border-line-strong bg-coal/80 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]"
            : "border-line bg-coal/40"
        }`}
      >
        <a
          href="#top"
          aria-label="Abhinav Kashyap — back to top"
          className="mr-0.5 flex h-7 w-7 shrink-0 sm:mr-1 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-fog text-[11px] font-semibold tracking-tight text-ink"
        >
          AK
        </a>
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className={`relative rounded-full px-2 py-1.5 text-[12px] transition-colors sm:px-3.5 sm:text-[13px] ${
                isActive ? "text-fog" : "text-mist hover:text-fog"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-white/[0.08]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </a>
          );
        })}
        <Link
          href="/resume"
          className="ml-0.5 inline-flex items-center gap-1 rounded-full border border-line-strong px-2 py-1.5 text-[12px] text-fog transition hover:bg-fog hover:text-ink sm:ml-1 sm:px-3.5 sm:text-[13px]"
        >
          Resume <ArrowUpRight size={13} aria-hidden />
        </Link>
      </nav>
    </motion.header>
  );
}
