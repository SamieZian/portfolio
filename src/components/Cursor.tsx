"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Two layer cursor: an exact dot (primary) and a lagging ring (follow through).
// The ring grows over interactive things and can show a label via data-cursor="View".
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    // reads a browser-only media query once after mount; doing it during render would break SSR hydration
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const el = t.closest?.("a,button,input,textarea,[data-cursor]") as HTMLElement | null;
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? "");
    };
    const d = () => setDown(true), u = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hover ? 56 : 32;
  return (
    <>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-acid"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }} />
      <motion.div aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] flex items-center justify-center rounded-full border font-mono text-[10px] uppercase tracking-widest"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size, height: size,
          scale: down ? 0.85 : 1,
          backgroundColor: label ? "rgba(200,255,46,1)" : hover ? "rgba(200,255,46,0.08)" : "rgba(0,0,0,0)",
          borderColor: hover || label ? "rgba(200,255,46,0.9)" : "rgba(242,242,238,0.35)",
          color: label ? "#050505" : "#f2f2ee",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}>
        {label}
      </motion.div>
    </>
  );
}
