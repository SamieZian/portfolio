"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Eight armed star that spins with scroll (spring lag = follow through).
function Star({ className = "" }: { className?: string }) {
  const { scrollY } = useScroll();
  const rotate = useSpring(useTransform(scrollY, (v) => v * 0.25), { stiffness: 120, damping: 20 });
  return (
    <motion.svg viewBox="0 0 24 24" className={className} style={{ rotate }} aria-hidden>
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="10.6" y="1" width="2.8" height="22" rx="1.4" fill="currentColor" transform={`rotate(${a} 12 12)`} />
      ))}
    </motion.svg>
  );
}

// Letters roll up on hover, one after another (micro cascade, 18ms per letter).
function Roll({ text }: { text: string }) {
  return (
    <span className="relative inline-flex overflow-hidden" aria-hidden>
      {text.split("").map((c, i) => (
        <span key={i} className="relative inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
          style={{ transitionDelay: `${i * 18}ms` }}>
          <span className="block">{c === " " ? " " : c}</span>
          <span className="absolute left-0 top-full block text-acid">{c === " " ? " " : c}</span>
        </span>
      ))}
    </span>
  );
}

export default function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} aria-label="Sampat Hake, back to top" className="group flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.03em] text-bone">
      <Star className="h-[18px] w-[18px] text-acid transition-transform duration-500 group-hover:scale-125" />
      <Roll text="Sampat Hake" />
    </button>
  );
}
