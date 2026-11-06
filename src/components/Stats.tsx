"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/data/profile";
import { EASE, DUR } from "@/lib/motion";

function Count({ to, run }: { to: number; run: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t0 = performance.now(), dur = 1600; let id = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 4)) * to));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [run, to]);
  return <>{n.toLocaleString("en-IN")}</>;
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <section aria-label="Numbers" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-36">
      <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.3em] text-fog"><span className="text-acid">01</span> / In numbers</p>
      <div ref={ref} className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div key={s.label} className="group relative bg-ink p-5 md:p-7"
            initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: DUR.slow, ease: EASE, delay: i * 0.08 }}>
            <div className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            <div className="relative font-mono text-4xl font-medium tracking-tight transition-colors duration-300 group-hover:text-ink md:text-5xl">
              {s.prefix}<Count to={s.value} run={inView} />{s.suffix}
            </div>
            <p className="relative mt-3 text-sm text-fog transition-colors duration-300 group-hover:text-ink/70">{s.label}</p>
          </motion.div>
        ))}
        {/* filler cell so the 2-column mobile grid closes cleanly */}
        <div className="bg-ink p-5 md:hidden" aria-hidden>
          <div className="font-mono text-4xl text-acid">↗</div>
          <p className="mt-3 text-sm text-fog">and counting</p>
        </div>
      </div>
    </section>
  );
}
