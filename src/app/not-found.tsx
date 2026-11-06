import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-acid">404 · route not found</p>
        <h1 className="mt-6 text-[28vw] font-semibold leading-[0.8] tracking-[-0.06em] text-outline md:text-[16vw]">404</h1>
        <p className="mt-6 text-lg text-fog">This request fell off the queue. Nothing lives at this address.</p>
        <Link href="/" className="mt-10 inline-flex h-12 items-center rounded-full bg-acid px-6 font-semibold text-ink">Back to home</Link>
      </div>
    </main>
  );
}
