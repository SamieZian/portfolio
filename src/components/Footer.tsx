"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { scrollToId } from "./SmoothScroll";

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    f(); const id = setInterval(f, 1000); return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--:--"} IST</span>;
}

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-line px-4 pt-10 md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-fog">
        <span>© 2026 {profile.name}</span>
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-acid" />Bangalore · <Clock /></span>
        <span className="flex gap-5">
          <Link href="/privacy" className="hover:text-bone">Privacy</Link>
          <button onClick={() => scrollToId("top")} className="uppercase hover:text-acid">Back to top ↑</button>
        </span>
      </div>
      <div aria-hidden className="pointer-events-none mt-8 select-none text-center text-[21vw] font-semibold leading-[0.75] tracking-[-0.07em] text-outline">SAMPAT</div>
    </footer>
  );
}
