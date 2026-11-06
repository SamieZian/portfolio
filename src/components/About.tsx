"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { education, profile, skills } from "@/data/profile";
import { EASE, DUR } from "@/lib/motion";

const reveal = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-15%" } };

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const rot = useTransform(scrollYProgress, [0, 1], [-4, 4]);

  return (
    <section ref={ref} id="about" className="mx-auto max-w-[1400px] px-4 py-28 md:px-8 md:py-40">
      <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.3em] text-fog"><span className="text-acid">04</span> / About</p>
      <div className="grid gap-12 md:grid-cols-[5fr_7fr] md:gap-20">
        {/* portrait: scanlines, RGB glitch on hover, parallax drift */}
        <motion.div style={{ rotate: rot }} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }} className="relative mx-auto w-full max-w-sm md:mx-0" data-cursor="Hey">
          <motion.div variants={{ hidden: { clipPath: "inset(100% 0 0 0)" }, show: { clipPath: "inset(0% 0 0 0)", transition: { duration: 1.2, ease: EASE } } }} className="glitch scan relative aspect-[3/4] overflow-hidden rounded-[28px] border border-line">
            <motion.div style={{ y: imgY }} className="absolute inset-[-10%]">
              <Image src="/profile.jpg" alt="Portrait of Sampat Hake" fill sizes="(min-width: 768px) 560px, 100vw" quality={90} className="object-cover grayscale contrast-125" priority={false} />
            </motion.div>
            <div className="g g1" style={{ backgroundImage: "url(/profile.jpg)", filter: "grayscale(1) sepia(1) hue-rotate(40deg) saturate(6)" }} />
            <div className="g g2" style={{ backgroundImage: "url(/profile.jpg)", filter: "grayscale(1) sepia(1) hue-rotate(140deg) saturate(4)" }} />
            <div className="absolute inset-0 bg-acid mix-blend-multiply opacity-25" />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-ink to-transparent p-5 font-mono text-[11px] uppercase tracking-widest">
              <span>{profile.name}</span><span className="text-acid">{profile.location}</span>
            </div>
          </motion.div>
          <div className="absolute -right-3 -top-3 rounded-full bg-acid px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-ink">5 yrs in prod</div>
        </motion.div>

        <div>
          <motion.h2 {...reveal} transition={{ duration: DUR.slow, ease: EASE }} className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Production first.<br /><span className="text-fog">Clever prompts second.</span>
          </motion.h2>
          <div className="mt-10 grid gap-6 text-lg leading-relaxed text-bone/80 md:grid-cols-2">
            <motion.p {...reveal} transition={{ duration: DUR.slow, ease: EASE, delay: 0.1 }}>
              I&apos;m a backend engineer in Bangalore. Today I work on lending at Kotak Mahindra Bank, where a loan moves from application to disbursement and every step has to be correct and auditable.
            </motion.p>
            <motion.p {...reveal} transition={{ duration: DUR.slow, ease: EASE, delay: 0.18 }}>
              Before that I was the founding engineer at Clientell AI, building the platform that lets AI agents work inside a company&apos;s own tools. Earlier: ERP sync, event pipelines and serverless at scale. So I treat LLM systems as production systems.
            </motion.p>
          </div>

          <div className="mt-14 space-y-6">
            {Object.entries(skills).map(([group, items], gi) => (
              <motion.div key={group} {...reveal} transition={{ duration: DUR.slow, ease: EASE, delay: gi * 0.06 }} className="grid gap-3 border-t border-line pt-5 md:grid-cols-[160px_1fr]">
                <h3 className="font-mono text-xs uppercase tracking-widest text-fog">{group}</h3>
                <ul className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <li key={s} className="rounded-full border border-line-2 px-3 py-1.5 text-sm text-bone/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-acid hover:bg-acid hover:text-ink">{s}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
            <motion.div {...reveal} transition={{ duration: DUR.slow, ease: EASE }} className="grid gap-3 border-t border-line pt-5 md:grid-cols-[160px_1fr]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-fog">Education</h3>
              <div className="text-sm text-bone/85">
                <p>{education.degree} · {education.cgpa}</p>
                <p className="text-fog">{education.school}, {education.years}</p>
                <p className="mt-2 text-fog">Anthropic certified: {education.certs.join(" · ")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
