"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Slides a line of text up from behind a clipping mask. */
export function MaskLine({
  children,
  delay = 0,
  className,
  inView = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  inView?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Observe the clipping wrapper: the translated child sits outside it and never intersects.
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const shown = !inView || seen || !!reduce;
  return (
    <span ref={ref} className={`block overflow-hidden pb-[0.08em] ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "110%" }}
        animate={{ y: shown ? "0%" : "110%" }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
