import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy · Sampat Hake", robots: { index: false } };

export default function Privacy() {
  return (
    <main id="main" className="mx-auto min-h-screen max-w-2xl px-6 py-32">
      <Link href="/" className="font-mono text-xs uppercase tracking-widest text-fog hover:text-acid">← Back home</Link>
      <h1 className="mt-10 text-5xl font-semibold tracking-tight">Privacy</h1>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-bone/80">
        <p>This site uses no cookies, analytics or trackers. Your sound preference is kept in your own browser.</p>
        <p>If you use the contact form, your name, email and message go through <a className="underline underline-offset-4 hover:text-acid" href="https://formspree.io/legal/privacy-policy">Formspree</a> to my inbox. I use them only to reply, and never share or sell them.</p>
        <p>Want a message deleted? Email <a className="underline underline-offset-4 hover:text-acid" href="mailto:hake.sampat.121@gmail.com">hake.sampat.121@gmail.com</a>.</p>
        <p className="font-mono text-sm text-fog">Last updated 6 November 2026</p>
      </div>
    </main>
  );
}
