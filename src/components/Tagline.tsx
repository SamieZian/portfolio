"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const TEXT = "I care about the parts that never make the demo. Retries, idempotency, backpressure, and a pager that stays quiet at 3am.";
const HOT = new Set(["Retries,", "idempotency,", "backpressure,", "3am."]);

function W({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const start = i / n, end = start + 1.5 / n;
  const opacity = useTransform(p, [start, end], [0.14, 1]);
  const y = useTransform(p, [start, end], [12, 0]);
  return <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${HOT.has(w) ? "text-acid" : ""}`}>{w}</motion.span>;
}

// Each word wakes up as it crosses the reading line (scroll linked, no unthrottled listeners).
export default function Tagline() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = TEXT.split(" ");
  return (
    <section aria-label="How I work" className="mx-auto max-w-[1400px] px-4 py-32 md:px-8 md:py-48">
      <p ref={ref} className="max-w-6xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-7xl">
        {words.map((w, i) => <W key={i} w={w} i={i} n={words.length} p={scrollYProgress} />)}
      </p>
    </section>
  );
}
