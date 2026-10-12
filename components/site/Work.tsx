"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { ProjectVisualView } from "@/components/site/visuals";
import { SectionHead } from "@/components/site/SectionHead";
import { EASE, Reveal } from "@/components/site/Reveal";

const featured = projects.filter((p) => p.status !== "In progress");
const upcoming = projects.filter((p) => p.status === "In progress");

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <SectionHead
        index="02"
        label="Selected work"
        title="Things I’ve built"
        accent="and actually use."
        aside={<span className="tnum font-mono text-sm text-mist">({String(featured.length).padStart(2, "0")})</span>}
      />

      <div className="mt-16 space-y-24 sm:mt-24 sm:space-y-36">
        {featured.map((project, i) => (
          <ProjectRow key={project.id} project={project} index={i + 1} flip={i % 2 === 1} />
        ))}
      </div>

      {upcoming.map((project) => (
        <UpcomingRow key={project.id} project={project} index={featured.length + 1} />
      ))}
    </section>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const tone =
    status === "Live"
      ? "text-signal border-signal/25"
      : status === "In progress"
        ? "text-ember border-ember/25"
        : "text-ice border-ice/25";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${tone}`}>
      <span className={`h-1 w-1 rounded-full bg-current ${status === "Live" ? "pulse-dot" : ""}`} aria-hidden />
      {status}
    </span>
  );
}

function VisualFrame({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  const href = project.links.internal?.href ?? project.links.live;
  const cursor = project.links.internal ? "Open" : project.links.live ? "Visit" : undefined;

  const frame = (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1400 }}
      className="surface group/frame relative aspect-[16/11] overflow-hidden rounded-[28px] transition-[border-color] duration-500 hover:border-line-strong"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div aria-hidden className="glow-ice pointer-events-none absolute -right-1/4 -top-1/3 h-[90%] w-[90%] opacity-0 blur-2xl transition-opacity duration-700 group-hover/frame:opacity-60" />
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/frame:scale-[1.02]">
        <ProjectVisualView visual={project.visual} />
      </div>
    </motion.div>
  );

  return (
    <figure>
      {href ? (
        <Link
          href={href}
          target={project.links.internal ? undefined : "_blank"}
          rel={project.links.internal ? undefined : "noreferrer"}
          data-cursor={cursor}
          aria-label={`${project.title} — ${project.links.internal ? project.links.internal.label : "open live site"}`}
          className="block rounded-[28px]"
        >
          {frame}
        </Link>
      ) : (
        frame
      )}
      <figcaption className="label mt-4 flex justify-between gap-4">
        <span>
          Fig. {String(index).padStart(2, "0")} — {project.caption}
        </span>
      </figcaption>
    </figure>
  );
}

function ProjectRow({ project, index, flip }: { project: Project; index: number; flip: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article id={project.id} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-12">
      <Reveal className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <VisualFrame project={project} index={index} />
      </Reveal>

      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <Reveal y={20}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="tnum font-mono text-sm text-ice">{String(index).padStart(2, "0")}</span>
            <span className="label">{project.kind}</span>
            <StatusBadge status={project.status} />
          </div>
          <h3 className="mt-5 text-[clamp(34px,4vw,54px)] font-semibold leading-[0.95] tracking-[-0.045em]">{project.title}</h3>
          <p className="mt-4 font-serif text-[clamp(21px,1.8vw,26px)] italic leading-snug text-mist">{project.tagline}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-mist">{project.summary}</p>
        </Reveal>

        <Reveal delay={0.08} y={20}>
          <ul className="mt-7 divide-y divide-line border-y border-line">
            {project.engineering.map((note) => (
              <li key={note} className="flex gap-3 py-2.5 text-sm text-fog/90">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ice" aria-hidden />
                {note}
              </li>
            ))}
          </ul>

          <p className="mt-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-mute">
            {project.tech.join("  /  ")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            {project.links.internal && (
              <Link
                href={project.links.internal.href}
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-fog px-5 text-sm font-medium text-ink transition hover:bg-white"
              >
                {project.links.internal.label}
                <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </Link>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex h-11 items-center gap-2 rounded-full bg-fog px-5 text-sm font-medium text-ink transition hover:bg-white"
              >
                Live site
                <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            )}
            {project.links.source && (
              <a href={project.links.source} target="_blank" rel="noreferrer" className="link-draw inline-flex items-center gap-1.5 text-sm text-fog">
                Source on GitHub <ArrowUpRight size={14} aria-hidden />
              </a>
            )}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 text-sm text-mist transition hover:text-fog"
            >
              Case notes
              <Plus size={14} className={`transition-transform duration-500 ${open ? "rotate-45" : ""}`} aria-hidden />
            </button>
          </div>
          {project.statusNote && <p className="mt-4 text-xs text-mute">{project.statusNote}</p>}

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={panelId}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="mt-6 rounded-2xl border border-line bg-graphite/60 p-5">
                  <p className="text-sm leading-relaxed text-fog/90">{project.details}</p>
                  <p className="label mt-4">
                    Role — <span className="normal-case tracking-normal text-mist">{project.role}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </article>
  );
}

function UpcomingRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal className="mt-24 sm:mt-36">
      <article id={project.id} className="surface grid scroll-mt-28 overflow-hidden rounded-[28px] md:grid-cols-12">
        <div className="relative min-h-[220px] border-b border-line md:col-span-4 md:border-b-0 md:border-r">
          <ProjectVisualView visual={project.visual} />
        </div>
        <div className="p-6 sm:p-8 md:col-span-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="tnum font-mono text-sm text-ice">{String(index).padStart(2, "0")}</span>
            <span className="label">Next up</span>
            <StatusBadge status={project.status} />
          </div>
          <h3 className="mt-4 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.04em]">{project.title}</h3>
          <p className="mt-2 font-serif text-xl italic text-mist">{project.tagline}</p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mist">
            {project.summary} {project.details}
          </p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-mute">Planned stack — {project.tech.join("  /  ")}</p>
        </div>
      </article>
    </Reveal>
  );
}
