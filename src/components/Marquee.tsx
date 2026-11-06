"use client";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { companies, skills } from "@/data/profile";

// Two belts running opposite ways; scroll speed skews them (secondary reaction to the primary scroll).
function Belt({ items, reverse = false, outline = false }: { items: string[]; reverse?: boolean; outline?: boolean }) {
  const { scrollY } = useScroll();
  const v = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
  const skew = useTransform(v, [-2500, 0, 2500], [reverse ? -5 : 5, 0, reverse ? 5 : -5]);
  const row = [...items, ...items];
  return (
    <motion.div style={{ skewX: skew }} className="flex overflow-hidden whitespace-nowrap py-3">
      <div className="flex shrink-0 gap-10 pr-10" style={{ animation: `marquee ${reverse ? 46 : 34}s linear infinite ${reverse ? "reverse" : ""}` }}>
        {[...row, ...row].map((t, i) => (
          <span key={i} className={`flex items-center gap-10 text-5xl font-semibold tracking-tight md:text-7xl ${outline ? "text-outline" : "text-bone"}`}>
            {t}<span className="text-2xl text-acid md:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Marquee() {
  const tech = [...skills.Languages.slice(0, 2), "FastAPI", "MCP", "Redis", "Kafka", "AWS", "GCP", "Postgres"];
  return (
    <section aria-label="Companies and stack" className="relative border-y border-line bg-ink py-8 md:py-12">
      <p className="sr-only">Built at {companies.join(", ")}</p>
      <div aria-hidden>
        <Belt items={companies} />
        <Belt items={tech} reverse outline />
      </div>
    </section>
  );
}
