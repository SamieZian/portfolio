"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/data/profile";
import { EASE, DUR } from "@/lib/motion";
import Magnetic from "./Magnetic";
import { useSound } from "./Sound";

type Status = { kind: "idle" | "sending" | "ok" | "err"; msg?: string };
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const [st, setSt] = useState<Status>({ kind: "idle" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(0);
  const { play } = useSound();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(fd.get("name") || "").trim()) next.name = "Add your name.";
    if (!emailOk(String(fd.get("email") || ""))) next.email = "That email doesn't look right.";
    if (String(fd.get("message") || "").trim().length < 2) next.message = "Write a short message.";
    setErrs(next);
    if (Object.keys(next).length) { setShake((s) => s + 1); return; }
    setSt({ kind: "sending" });
    const form = e.currentTarget;
    try {
      const res = await fetch(profile.formspree, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      if (res.ok) { form.reset(); setSt({ kind: "ok", msg: "Message sent. I'll reply to the email you gave." }); play("success"); }
      else { const d = await res.json().catch(() => ({})); setSt({ kind: "err", msg: d?.errors?.[0]?.message || `That didn't go through. Try again or email ${profile.email}.` }); }
    } catch { setSt({ kind: "err", msg: `No connection. Check your network or email ${profile.email}.` }); }
  };

  const field = "w-full border-b border-line-2 bg-transparent py-3 text-lg text-bone outline-none transition-colors duration-300 placeholder:text-fog/60 focus:border-acid";

  return (
    <section ref={ref} id="contact" className="relative overflow-hidden px-4 pb-10 pt-28 md:px-8 md:pt-40">
      <div className="mx-auto max-w-[1400px]">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-fog"><span className="text-acid">06</span> / Contact</p>
        <h2 className="font-semibold leading-[0.85] tracking-[-0.06em]">
          <motion.span style={{ x: x1 }} className="block text-[15vw] md:text-[13vw]">Let&apos;s build</motion.span>
          <motion.span style={{ x: x2 }} className="block text-right text-[15vw] text-acid md:text-[13vw]">something.</motion.span>
        </h2>

        <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-20">
          <div className="space-y-8">
            <p className="max-w-md text-lg text-fog">Building something that has to stay up? Tell me about the system, the team or the problem. I read every message.</p>
            <Magnetic strength={0.25}>
              <a href={`mailto:${profile.email}`} data-cursor="Mail"
                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-line-2 px-6 py-4 text-lg font-medium md:text-2xl">
                <span className="absolute inset-0 translate-y-full rounded-full bg-acid transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-300 group-hover:text-ink">{profile.email}</span>
                <span className="relative transition-all duration-300 group-hover:rotate-45 group-hover:text-ink">↗</span>
              </a>
            </Magnetic>
            <ul className="flex flex-wrap gap-3">
              {[["LinkedIn", profile.linkedin], ["GitHub", profile.github], ["Instagram", profile.instagram], ["Resume", profile.resume]].map(([l, h]) => (
                <li key={l}><a href={h} target="_blank" rel="noopener" className="inline-block rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-fog transition-colors duration-200 hover:border-acid hover:text-acid">{l} ↗</a></li>
              ))}
            </ul>
          </div>

          <motion.form key={shake} onSubmit={submit} noValidate className="space-y-6"
            animate={shake ? { x: [0, -12, 10, -6, 4, 0] } : {}} transition={{ duration: 0.4, ease: "easeInOut" }}>
            {[
              { n: "name", l: "Your name", t: "text", ac: "name" },
              { n: "email", l: "Email", t: "email", ac: "email" },
            ].map((f) => (
              <div key={f.n}>
                <label htmlFor={`c-${f.n}`} className="font-mono text-[11px] uppercase tracking-widest text-fog">{f.l}</label>
                <input id={`c-${f.n}`} name={f.n} type={f.t} autoComplete={f.ac} className={field} aria-invalid={!!errs[f.n]} aria-describedby={errs[f.n] ? `e-${f.n}` : undefined} />
                {errs[f.n] && <p id={`e-${f.n}`} className="mt-2 text-sm text-[#ff6b6b]">{errs[f.n]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="c-message" className="font-mono text-[11px] uppercase tracking-widest text-fog">Message</label>
              <textarea id="c-message" name="message" rows={4} className={`${field} resize-none`} aria-invalid={!!errs.message} aria-describedby={errs.message ? "e-message" : undefined} />
              {errs.message && <p id="e-message" className="mt-2 text-sm text-[#ff6b6b]">{errs.message}</p>}
            </div>
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="flex flex-wrap items-center gap-5">
              <Magnetic>
                <button type="submit" disabled={st.kind === "sending"} data-cursor="Send"
                  className="h-14 rounded-full bg-acid px-8 font-semibold text-ink transition-transform duration-200 active:scale-95 disabled:opacity-60">
                  {st.kind === "sending" ? "Sending..." : st.kind === "ok" ? "Sent ✓" : "Send message"}
                </button>
              </Magnetic>
              {st.msg && (
                <motion.p role="status" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: DUR.base, ease: EASE }}
                  className={`text-sm ${st.kind === "ok" ? "text-acid" : "text-[#ff6b6b]"}`}>{st.msg}</motion.p>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
