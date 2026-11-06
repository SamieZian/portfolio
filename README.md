# sampathake.in

Personal site of **Sampat Hake**, backend and AI engineer (SDE 2 at Kotak Mahindra Bank).

Live: https://sampathake.in

## Stack

- Next.js 16 (App Router, fully static) + TypeScript + Tailwind CSS v4
- Framer Motion for scroll and UI motion, Lenis for smooth scroll
- react-three-fiber / three.js for the 3D network hero
- WebAudio for the optional UI sounds (no audio files)

## Sections

Boot preloader → 3D network hero → company marquee → numbers → pinned **system map**
(six animated architecture diagrams: loan origination, MCP fan out, LLM router, async workers,
event driven ERP sync, Lambda fan out) → tagline word reveal → horizontal journey →
about with glitch portrait → interactive terminal → contact (Formspree) → footer.

All content lives in `src/data/profile.ts`.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Deploy

Vercel builds `main` automatically (`vercel.json` sets the Next.js framework preset).
