"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { experience } from "@/data/profile";

// Vertical scroll drives a horizontal track of role cards (pinned). Cards tilt slightly as they pass.
export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const measure = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth)); };
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(p, [0, 1], [0, -dist]);
  const lineScale = useTransform(p, [0, 1], [0, 1]);

  return (
    <section ref={ref} id="journey" className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-[1400px] items-end justify-between px-4 md:mb-12 md:px-8">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-fog"><span className="text-acid">03</span> / Journey</p>
            <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.04em] md:text-7xl">Five teams.<br /><span className="text-outline">One habit: ship.</span></h2>
          </div>
          <p className="hidden font-mono text-xs text-fog md:block">scroll →</p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[22px] h-px bg-line" />
          <motion.div className="absolute left-0 right-0 top-[22px] h-px origin-left bg-acid" style={{ scaleX: lineScale }} />
          <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-4 md:gap-8 md:px-8">
            {experience.map((r, i) => (
              <article key={r.company} className="w-[86vw] shrink-0 sm:w-[520px]">
                <div className="mb-6 flex items-center gap-3">
                  <span className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border font-mono text-xs ${r.current ? "border-acid bg-acid text-ink" : "border-line-2 bg-ink text-fog"}`}>0{i + 1}</span>
                  <span className="font-mono text-xs uppercase tracking-widest text-fog">{r.dates}</span>
                </div>
                <div className="group h-full rounded-3xl border border-line bg-ink-2 p-6 transition-colors duration-500 hover:border-acid/60 md:p-8" data-cursor={r.current ? "Now" : ""}>
                  <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    {r.company}{r.note && <span className="ml-2 align-middle text-sm font-normal text-fog">({r.note})</span>}
                  </h3>
                  <p className="mt-2 text-sm text-fog">{r.title} · {r.place}</p>
                  <ul className="mt-6 space-y-3 text-[15px] leading-relaxed text-bone/85">
                    {r.points.map((pt) => (
                      <li key={pt} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acid" />{pt}</li>
                    ))}
                  </ul>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {r.stack.map((t) => <li key={t} className="rounded-full border border-line-2 px-3 py-1 font-mono text-[11px] text-fog transition-colors duration-300 group-hover:border-acid/40 group-hover:text-bone">{t}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
