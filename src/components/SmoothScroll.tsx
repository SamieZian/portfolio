"use client";
import { useEffect } from "react";
import Lenis from "lenis";

// Lenis gives the whole page weighted, inertial scrolling. Anchor links scroll through it too.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -40 } });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let id = 0;
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  return null;
}

export function scrollToId(id: string) {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -40 });
  else el.scrollIntoView({ behavior: "smooth" });
}
