# sampathake.in — Personal Portfolio

Personal portfolio of **Sampat Hake** — Founding & Senior Software Engineer (AI agents, Model Context Protocol, distributed backend systems).

Live site: https://sampathake.in

## Stack

Hand-built, dependency-free **static site** — plain HTML, CSS, and vanilla JavaScript. No framework, no build step, deploys anywhere instantly.

- `index.html` — all markup and content
- `assets/styles.css` — styling (dark theme, gradient accents)
- `assets/main.js` — interactions (⌘K command palette, agent-network canvas, animated counters, scroll reveals, rotating company terminal, back-to-top)
- `assets/icons/` — official tech & social brand icons (Simple Icons)
- `assets/profile.jpg` — profile photo
- `assets/og.png` — social share image (source: `og.html`)
- `robots.txt`, `sitemap.xml` — SEO

## Run locally

```bash
cd portfolio
python3 -m http.server 8080
# open http://localhost:8080
```

> Note: uses absolute `/assets/...` paths, so preview over HTTP (above) — not by opening `index.html` directly.

## Deploy

Any static host works (Netlify, Cloudflare Pages, Vercel, GitHub Pages). See `DEPLOY.md` for the full GoDaddy-domain walkthrough.
