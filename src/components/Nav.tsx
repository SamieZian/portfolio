"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { EASE, EASE_IN, stagger } from "@/lib/motion";
import { SoundToggle } from "./Sound";
import Magnetic from "./Magnetic";
import Wordmark from "./Wordmark";
import { scrollToId } from "./SmoothScroll";

const LINKS = [
  { id: "systems", label: "Systems" },
  { id: "journey", label: "Journey" },
  { id: "about", label: "About" },
  { id: "terminal", label: "Terminal" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 300 && !open);
  });

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    LINKS.forEach((l) => { const el = document.getElementById(l.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => { setOpen(false); document.documentElement.style.overflow = ""; setTimeout(() => scrollToId(id), open ? 350 : 0); };

  return (
    <>
      <motion.div className="fixed left-0 right-0 top-0 z-[70] h-[2px] origin-left bg-acid" style={{ scaleX: scrollYProgress }} />
      <motion.header className="fixed inset-x-0 top-0 z-[65] px-4 pt-4 md:px-8 md:pt-5"
        animate={{ y: hidden ? -100 : 0 }} transition={{ duration: 0.45, ease: EASE }}>
        <nav className="mx-auto grid max-w-[1400px] grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center">
            <Wordmark onClick={() => go("top")} />
          </div>
          <ul className="hidden items-center gap-0.5 rounded-full border border-white/[0.07] bg-white/[0.035] p-1 backdrop-blur-xl md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button onClick={() => go(l.id)} aria-current={active === l.id ? "true" : undefined}
                  className="relative rounded-full px-4 py-2 text-[13px] font-medium text-fog transition-colors duration-300 hover:text-bone aria-[current=true]:text-ink">
                  {active === l.id && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-acid" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-end gap-2">
            <div className="hidden sm:block"><SoundToggle /></div>
            <Magnetic className="hidden md:block">
              <button onClick={() => go("contact")} className="group flex h-10 items-center gap-2 rounded-full bg-bone pl-4 pr-1.5 text-[13px] font-semibold text-ink transition-colors duration-300 hover:bg-acid active:scale-95">
                Let&apos;s talk
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-45">→</span>
              </button>
            </Magnetic>
            <button className="relative h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}
              onClick={() => { setOpen(!open); document.documentElement.style.overflow = !open ? "hidden" : ""; }}>
              <motion.span className="absolute left-3 right-3 h-[1.5px] bg-bone" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }} transition={{ duration: 0.45, ease: EASE }} />
              <motion.span className="absolute left-3 right-3 h-[1.5px] bg-bone" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }} transition={{ duration: 0.45, ease: EASE }} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[64] flex flex-col justify-between bg-ink/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)", transition: { duration: 0.6, ease: EASE } }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.4, ease: EASE_IN } }}>
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <li key={l.id} className="overflow-hidden">
                  <motion.button onClick={() => go(l.id)} className="flex w-full items-baseline gap-4 text-5xl font-semibold tracking-tight"
                    initial={{ y: "100%" }} animate={{ y: 0, transition: { duration: 0.6, ease: EASE, delay: 0.15 + i * stagger(LINKS.length, 0.4, 0.06) } }}>
                    <span className="font-mono text-xs text-acid">0{i + 1}</span>{l.label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <SoundToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
