"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";
import { profile } from "@/data/profile";
import Magnetic from "./Magnetic";
import { scrollToId } from "./SmoothScroll";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

// Letters rise out of a mask one after another (dramatic stagger, under 600ms total).
function Word({ text, delay, className = "" }: { text: string; delay: number; className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden pb-[0.06em] ${className}`} aria-hidden>
      {text.split("").map((c, i) => (
        <motion.span key={i} className="inline-block" initial={{ y: "105%", rotate: 8 }} animate={{ y: "0%", rotate: 0 }}
          transition={{ duration: DUR.slow + 0.2, ease: EASE, delay: delay + i * 0.05 }}>
          {c}
        </motion.span>
      ))}
    </span>
  );
}

function RotatingRole() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2200); return () => clearInterval(id); }, []);
  return (
    <span className="relative inline-grid overflow-hidden align-top leading-[inherit] text-acid">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={profile.roles[i]} className="inline-block whitespace-nowrap"
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }} animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }} transition={{ duration: DUR.base + 0.1, ease: EASE }}>
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => { scrollRef.current = v; });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const nameBlur = useTransform(scrollYProgress, [0, 0.7], ["blur(0px)", "blur(10px)"]);
  const bootDelay = typeof window !== "undefined" && sessionStorage.getItem("sh-booted") ? 0.1 : 1.9;

  useEffect(() => {
    const move = (e: PointerEvent) => { mouse.current = { x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 }; };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: EASE, delay: bootDelay - 0.3 }}>
        <HeroScene scrollRef={scrollRef} mouse={mouse} />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050505_78%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-8 md:px-8 md:pb-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.slow, ease: EASE, delay: bootDelay }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-ink/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-fog backdrop-blur">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-acid" /></span>
          {profile.now}
        </motion.div>

        <motion.h1 style={{ y: nameY, opacity: nameOpacity, filter: nameBlur }} className="font-semibold leading-[0.82] tracking-[-0.055em]">
          <span className="sr-only">Sampat Hake, backend and AI engineer</span>
          <span className="block text-[21vw] md:text-[15.5vw]"><Word text="SAMPAT" delay={bootDelay + 0.05} /></span>
          <span className="block text-right text-[21vw] md:text-[15.5vw]"><Word text="HAKE" delay={bootDelay + 0.2} className="text-outline" /></span>
        </motion.h1>

        <div className="mt-6 grid items-end gap-6 md:mt-8 md:grid-cols-[1fr_auto_auto] md:gap-10">
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.slow, ease: EASE, delay: bootDelay + 0.55 }}
            className="max-w-xl text-xl leading-[1.3] text-bone/90 md:text-2xl">
            I build <RotatingRole /> <br className="hidden sm:block" />that hold up in production.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.slow, ease: EASE, delay: bootDelay + 0.65 }}
            className="flex flex-wrap gap-3">
            <Magnetic>
              <button onClick={() => scrollToId("systems")} data-cursor="Go"
                className="group flex h-12 items-center gap-3 rounded-full bg-acid pl-5 pr-2 font-semibold text-ink transition-transform duration-200 active:scale-95">
                See what I built
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-acid transition-transform duration-300 group-hover:-rotate-90">↓</span>
              </button>
            </Magnetic>
            <Magnetic>
              <a href={profile.resume} target="_blank" rel="noopener" className="flex h-12 items-center rounded-full border border-line-2 px-5 font-medium text-bone transition-colors duration-200 hover:border-bone">
                Resume ↗
              </a>
            </Magnetic>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.6, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: DUR.slow + 0.3, ease: EASE, delay: bootDelay + 0.75 }}
            className="relative hidden h-28 w-28 shrink-0 md:block" data-cursor="Hi">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]">
              <defs><path id="ring" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" /></defs>
              <text className="fill-fog font-mono text-[8.5px] uppercase tracking-[0.32em]"><textPath href="#ring">Backend · AI agents · Bangalore ·</textPath></text>
            </svg>
            <div className="absolute inset-[18px] overflow-hidden rounded-full border border-acid/60">
              <Image src="/profile.jpg" alt="Sampat Hake" fill sizes="80px" className="object-cover object-[50%_35%] grayscale" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
