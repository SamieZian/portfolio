"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { education, experience, profile, scenes, skills } from "@/data/profile";
import { EASE, DUR } from "@/lib/motion";
import { useSound } from "./Sound";
import { scrollToId } from "./SmoothScroll";

type Line = { kind: "in" | "out" | "acid" | "err"; text: string };

const COMMANDS = ["help", "whoami", "now", "experience", "projects", "skills", "education", "contact", "resume", "socials", "sudo hire-me", "clear"];

function run(cmd: string): Line[] | "clear" {
  const c = cmd.trim().toLowerCase();
  const out = (t: string): Line => ({ kind: "out", text: t });
  switch (c) {
    case "": return [];
    case "help": return [out("available commands:"), ...COMMANDS.map((k) => ({ kind: "acid" as const, text: `  ${k}` })), out("tip: tab completes, ↑ ↓ walks history")];
    case "whoami": return [out(`${profile.name}, ${profile.role.toLowerCase()} in ${profile.location}.`), out("5 years shipping Python, Go and FastAPI on AWS and GCP.")];
    case "now": return [out(profile.now), out("working on GLOS + VLOS: application → KYC → valuation → underwriting → sanction → disbursement")];
    case "experience": case "ls experience": return experience.map((r) => out(`${r.dates.padEnd(22)} ${r.company}  ·  ${r.title}`));
    case "projects": case "ls projects": return scenes.map((s) => out(`${s.id.padEnd(8)} ${s.title}  [${s.metrics.map((m) => m.v).join(" · ")}]`));
    case "skills": return Object.entries(skills).map(([g, v]) => out(`${(g + ":").padEnd(14)} ${v.join(", ")}`));
    case "education": return [out(`${education.degree}, ${education.cgpa}`), out(education.school), out(`certs: ${education.certs.join(", ")}`)];
    case "contact": setTimeout(() => scrollToId("contact"), 600); return [out(`email   ${profile.email}`), { kind: "acid", text: "scrolling you to the contact form..." }];
    case "resume": window.open(profile.resume, "_blank"); return [{ kind: "acid", text: "opening resume in a new tab ↗" }];
    case "socials": return [out(`linkedin  ${profile.linkedin}`), out(`github    ${profile.github}`)];
    case "sudo hire-me": case "sudo hire me": return [{ kind: "err", text: "[sudo] permission granted only by email ;)" }, out(`→ ${profile.email}`)];
    case "clear": return "clear";
    default:
      if (c.startsWith("sudo")) return [{ kind: "err", text: "nice try. this incident has been reported." }];
      if (c === "rm -rf /" || c.startsWith("rm ")) return [{ kind: "err", text: "blocked by guardrails. we don't do that in prod." }];
      return [{ kind: "err", text: `command not found: ${c}. try 'help'` }];
  }
}

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25%" });
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();
  const typed = useRef(false);

  const exec = (cmd: string) => {
    const res = run(cmd);
    if (res === "clear") { setLines([]); return; }
    setLines((l) => [...l, { kind: "in", text: cmd }, ...res]);
    if (cmd.trim()) setHist((h) => [...h, cmd]);
    setHi(-1);
  };

  // auto type a first command so the terminal demos itself
  useEffect(() => {
    if (!inView || typed.current) return;
    typed.current = true;
    const demo = "whoami"; let i = 0;
    const id = setInterval(() => {
      i++; setValue(demo.slice(0, i)); play("key");
      if (i === demo.length) { clearInterval(id); setTimeout(() => { exec(demo); setValue(""); setLines((l) => [...l, { kind: "out", text: "type 'help' to see everything." }]); }, 350); }
    }, 90);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" }); }, [lines]);

  return (
    <section id="terminal" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-fog"><span className="text-acid">05</span> / Terminal</p>
          <h2 className="text-5xl font-semibold leading-[0.9] tracking-[-0.04em] md:text-8xl">Ask the shell.</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["experience", "projects", "skills", "sudo hire-me"].map((c) => (
            <button key={c} onClick={() => { exec(c); inputRef.current?.focus({ preventScroll: true }); }}
              className="rounded-full border border-line-2 px-3 py-1.5 font-mono text-xs text-fog transition-colors duration-200 hover:border-acid hover:text-acid">$ {c}</button>
          ))}
        </div>
      </div>

      <motion.div ref={ref} initial={{ opacity: 0, y: 60, rotateX: 14 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: DUR.slow + 0.2, ease: EASE }} style={{ transformPerspective: 1200 }}
        className="overflow-hidden rounded-3xl border border-line bg-[#080808] shadow-[0_40px_120px_-40px_rgba(200,255,46,0.25)]"
        onClick={() => inputRef.current?.focus({ preventScroll: true })} data-cursor="Type">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-fog">sampat@prod: ~</span>
        </div>
        <div ref={bodyRef} className="h-[380px] overflow-y-auto p-5 font-mono text-[13px] leading-6 md:h-[440px] md:text-sm" data-lenis-prevent>
          <p className="text-fog">sampat.sys v5 · last login from {profile.location}</p>
          {lines.map((l, i) => (
            <div key={i} className={`whitespace-pre-wrap break-words ${l.kind === "in" ? "mt-2 text-bone" : l.kind === "acid" ? "text-acid" : l.kind === "err" ? "text-[#ff6b6b]" : "text-bone/70"}`}>
              {l.kind === "in" ? <><span className="text-acid">❯</span> {l.text}</> : l.text}
            </div>
          ))}
          <form className="mt-2 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); exec(value); setValue(""); }}>
            <span className="text-acid">❯</span>
            <label htmlFor="term" className="sr-only">Terminal command</label>
            <input id="term" ref={inputRef} value={value} autoComplete="off" spellCheck={false}
              onChange={(e) => { setValue(e.target.value); play("key"); }}
              onKeyDown={(e) => {
                if (e.key === "Tab") { e.preventDefault(); const m = COMMANDS.find((c) => c.startsWith(value)); if (m && value) setValue(m); }
                if (e.key === "ArrowUp" && hist.length) { e.preventDefault(); const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); setHi(n); setValue(hist[n]); }
                if (e.key === "ArrowDown" && hi >= 0) { e.preventDefault(); const n = hi + 1; if (n >= hist.length) { setHi(-1); setValue(""); } else { setHi(n); setValue(hist[n]); } }
              }}
              className="flex-1 bg-transparent text-bone caret-acid outline-none" />
          </form>
        </div>
      </motion.div>
    </section>
  );
}
