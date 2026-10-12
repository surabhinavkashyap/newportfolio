"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let frame = 0;

    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as Element | null;
      const view = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button, input, textarea, select, label, [role='radio']");
      el.dataset.state = view ? "view" : interactive ? "hover" : "idle";
      el.dataset.visible = "true";
      if (labelRef.current) labelRef.current.textContent = view?.dataset.cursor ?? "";
      if (!frame) frame = requestAnimationFrame(loop);
    };
    const onLeave = () => (el.dataset.visible = "false");
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      data-state="idle"
      data-visible="false"
      className="group pointer-events-none fixed left-0 top-0 z-[90] opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100"
    >
      <div
        className="flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-fog/40 transition-[width,height,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[pressed=true]:scale-90 group-data-[state=hover]:h-11 group-data-[state=hover]:w-11 group-data-[state=hover]:border-ice/70 group-data-[state=hover]:bg-volt/10 group-data-[state=view]:h-20 group-data-[state=view]:w-20 group-data-[state=view]:border-transparent group-data-[state=view]:bg-fog"
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink opacity-0 transition-opacity duration-300 group-data-[state=view]:opacity-100"
        />
      </div>
    </div>
  );
}
