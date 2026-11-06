"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { scenes } from "@/data/profile";
import { EASE, EASE_IN, DUR } from "@/lib/motion";
import { DIAGRAMS } from "./Diagrams";

// Pinned scroll story: each 100vh of scroll swaps in the next system. The diagram is the hero,
// copy and metrics are secondary, the index rail and grid are ambient.
export default function SystemMap() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(scenes.length - 1, Math.floor(v * scenes.length)));
  });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const s = scenes[active];
  const D = DIAGRAMS[s.id];

  return (
    <section ref={ref} id="systems" className="relative" style={{ height: `${scenes.length * 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <motion.div aria-hidden style={{ y: gridY }}
          className="pointer-events-none absolute inset-0 h-[140%] bg-[linear-gradient(#ffffff08_1px,transparent_1px),linear-gradient(90deg,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />

        <div className="relative mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 pt-24 md:px-8 md:pt-28">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-fog">
            <span className="text-acid">02</span> / System map<span className="hidden sm:inline">, scroll to run it</span>
          </h2>
          <div className="font-mono text-xs text-fog">
            <span className="text-bone">{String(active + 1).padStart(2, "0")}</span> / {String(scenes.length).padStart(2, "0")}
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-[1400px] flex-1 grid-rows-[auto_1fr] gap-4 px-4 pb-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:grid-rows-1 md:gap-10 md:px-8 md:pb-10">
          {/* copy */}
          <div className="flex flex-col justify-center">
            <ol className="mb-6 hidden gap-2 md:flex" aria-label="Systems">
              {scenes.map((sc, i) => (
                <li key={sc.id} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <motion.div className="h-full bg-acid" initial={false} animate={{ scaleX: i <= active ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: DUR.base, ease: EASE }} />
                </li>
              ))}
            </ol>
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial="hidden" animate="show" exit="exit">
                <motion.p variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } }, exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE_IN } } }}
                  className="mb-3 font-mono text-xs uppercase tracking-widest text-acid">{s.company}</motion.p>
                <h3 className="overflow-hidden text-3xl font-semibold leading-[1.02] tracking-tight md:text-5xl">
                  <motion.span className="block" variants={{ hidden: { y: "100%" }, show: { y: 0, transition: { duration: DUR.slow, ease: EASE, delay: 0.05 } }, exit: { y: "-100%", transition: { duration: 0.25, ease: EASE_IN } } }}>
                    {s.title}
                  </motion.span>
                </h3>
                <motion.p variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE, delay: 0.15 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }}
                  className="mt-4 hidden max-w-md text-base leading-relaxed text-fog sm:block">{s.body}</motion.p>
                <ul className="mt-6 flex flex-wrap gap-6">
                  {s.metrics.map((m, i) => (
                    <motion.li key={m.k} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE, delay: 0.22 + i * 0.07 } }, exit: { opacity: 0, transition: { duration: 0.15 } } }}>
                      <div className="font-mono text-2xl font-medium text-bone md:text-3xl">{m.v}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-fog">{m.k}</div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* diagram */}
          <div className="relative min-h-0 rounded-3xl border border-line bg-ink-2/80 p-2 backdrop-blur md:p-4" data-cursor="Live">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-fog">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid" /> live
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={s.id} className="h-full w-full"
                initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: DUR.slow, ease: EASE } }}
                exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)", transition: { duration: 0.25, ease: EASE_IN } }}>
                <D />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
