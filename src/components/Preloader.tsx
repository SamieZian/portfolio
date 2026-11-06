"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, EASE_IN } from "@/lib/motion";

const LINES = [
  "mounting /experience ............ 5 yrs",
  "connecting mcp providers ........ 9/9",
  "warming redis queues ............ 11 workers",
  "kyc → sanction → disburse ....... online",
];

// Boot sequence: counter + log lines (anticipation), then two shutters lift away (exit accelerates).
export default function Preloader() {
  const [done, setDone] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // reads browser-only state once after mount; doing it during render would break SSR hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reduced || sessionStorage.getItem("sh-booted")) { setDone(true); return; }
    document.documentElement.style.overflow = "hidden";
    const total = 1500; const t0 = performance.now(); let id = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / total);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) id = requestAnimationFrame(tick);
      else setTimeout(() => { setDone(true); sessionStorage.setItem("sh-booted", "1"); document.documentElement.style.overflow = ""; }, 250);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div key="boot" className="fixed inset-0 z-[90] flex pointer-events-none" exit={{ transition: { duration: 0.8 } }}>
          {[0, 1].map((i) => (
            <motion.div key={i} className="h-full w-1/2 bg-ink-2 border-line"
              style={{ borderRightWidth: i === 0 ? 1 : 0 }}
              exit={{ y: "-100%", transition: { duration: 0.7, ease: EASE_IN, delay: i * 0.08 } }} />
          ))}
          <motion.div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10"
            exit={{ opacity: 0, y: -40, transition: { duration: 0.35, ease: EASE_IN } }}>
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-fog">sampat.sys // boot</div>
            <div className="space-y-1 font-mono text-xs text-fog md:text-sm">
              {LINES.map((l, i) => (
                <motion.div key={l} initial={{ opacity: 0, x: -12 }} animate={{ opacity: n > i * 22 + 8 ? 1 : 0, x: n > i * 22 + 8 ? 0 : -12 }}
                  transition={{ duration: 0.3, ease: EASE }}>
                  <span className="text-acid">[ ok ]</span> {l}
                </motion.div>
              ))}
            </div>
            <div className="flex items-end justify-between">
              <div className="text-[22vw] font-semibold leading-[0.8] tracking-tighter text-bone md:text-[14vw]">
                {n.toString().padStart(3, "0")}
              </div>
              <div className="mb-3 h-px w-1/3 bg-line"><div className="h-px bg-acid" style={{ width: `${n}%` }} /></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
