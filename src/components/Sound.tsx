"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// UI sounds are synthesized with WebAudio (no audio files). Off by default, remembered per visitor.
type Kind = "hover" | "click" | "key" | "boot" | "success";
type Ctx = { on: boolean; toggle: () => void; play: (k: Kind) => void };
const SoundCtx = createContext<Ctx>({ on: false, toggle: () => {}, play: () => {} });
export const useSound = () => useContext(SoundCtx);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  const ac = useRef<AudioContext | null>(null);
  const last = useRef(0);

  // reads browser-only state once after mount; doing it during render would break SSR hydration
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOn(localStorage.getItem("sh-sound") === "1"); }, []);

  const tone = useCallback((freq: number, dur: number, gain: number, type: OscillatorType = "sine", slideTo?: number, at = 0) => {
    const ctx = ac.current!;
    const t = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  }, []);

  const play = useCallback((k: Kind) => {
    if (!on) return;
    if (!ac.current) ac.current = new AudioContext();
    if (ac.current.state === "suspended") ac.current.resume();
    const now = performance.now();
    if (k === "hover" && now - last.current < 60) return; // no machine gun ticks
    last.current = now;
    if (k === "hover") tone(2200, 0.04, 0.025, "sine");
    if (k === "click") { tone(520, 0.08, 0.06, "triangle", 880); }
    if (k === "key") tone(1400 + Math.random() * 500, 0.025, 0.02, "square");
    if (k === "boot") { tone(180, 0.5, 0.05, "sawtooth", 720); tone(1440, 0.25, 0.03, "sine", undefined, 0.35); }
    if (k === "success") { tone(660, 0.12, 0.05, "triangle"); tone(990, 0.18, 0.05, "triangle", undefined, 0.1); }
  }, [on, tone]);

  const toggle = useCallback(() => {
    setOn((v) => {
      const next = !v;
      localStorage.setItem("sh-sound", next ? "1" : "0");
      if (next) {
        if (!ac.current) ac.current = new AudioContext();
        ac.current.resume();
        setTimeout(() => {
          const ctx = ac.current!; const t = ctx.currentTime;
          const o = ctx.createOscillator(); const g = ctx.createGain();
          o.frequency.setValueAtTime(440, t); o.frequency.exponentialRampToValueAtTime(880, t + 0.12);
          g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
          o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
        }, 0);
      }
      return next;
    });
  }, []);

  // global hover/click sounds for anything interactive
  useEffect(() => {
    if (!on) return;
    const over = (e: Event) => { if ((e.target as HTMLElement).closest?.("a,button,[data-sfx]")) play("hover"); };
    const down = (e: Event) => { if ((e.target as HTMLElement).closest?.("a,button,[data-sfx]")) play("click"); };
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerdown", down);
    return () => { document.removeEventListener("pointerover", over); document.removeEventListener("pointerdown", down); };
  }, [on, play]);

  return <SoundCtx.Provider value={{ on, toggle, play }}>{children}</SoundCtx.Provider>;
}

export function SoundToggle() {
  const { on, toggle } = useSound();
  return (
    <button onClick={toggle} aria-pressed={on} aria-label={on ? "Turn sound off" : "Turn sound on"}
      className="group flex h-10 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fog backdrop-blur-xl transition-colors duration-300 hover:text-bone aria-pressed:text-acid">
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-[2px] rounded-full bg-current"
            style={{ height: on ? undefined : 3, animation: on ? `eq 0.9s ${i * 0.12}s ease-in-out infinite alternate` : "none" }} />
        ))}
      </span>
      {on ? "Sound on" : "Sound off"}
      <style>{`@keyframes eq { from { height: 3px } to { height: 12px } }`}</style>
    </button>
  );
}
