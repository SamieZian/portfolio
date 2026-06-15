# Deploying sampathake.in — end-to-end

Your site is a plain static site (HTML/CSS/JS, no build step). That means it deploys
anywhere in seconds and there is nothing to "compile." You own the domain on GoDaddy.
Below is the full process, from zero to live worldwide with HTTPS.

---

## 0) Preview it locally first (optional, 30 seconds)

Open Terminal and run:

```
cd ~/Desktop/portfolio
python3 -m http.server 8080
```

Then open <http://localhost:8080> in your browser. Press `Ctrl+C` in Terminal to stop.
(Opening `index.html` directly by double-click will look broken — the site uses
absolute `/assets/...` paths that only work over http, which is correct for the live host.)

---

## 1) Pick a host (all free, all global CDN, all auto-HTTPS)

| Host | Best for | Deploy method |
|------|----------|---------------|
| **Netlify** | Easiest — literally drag a folder | Drag & drop, no account-of-GitHub needed |
| **Cloudflare Pages** | Best worldwide speed | Drag & drop or Git |
| **Vercel** | If you'll push to GitHub | Git import or CLI |

**Recommended for you: Netlify Drop** (simplest) or **Cloudflare Pages** (fastest globally).
Steps for both below. You only need to do ONE.

---

## 2A) Deploy via Netlify (simplest)

1. Go to <https://app.netlify.com/drop>.
2. Sign up (free) — email or GitHub.
3. **Drag the entire `portfolio` folder** (`~/Desktop/portfolio`) onto the drop zone.
   - It deploys instantly and gives you a URL like `random-name-123.netlify.app`. Open it — your site is live.
4. In the site dashboard: **Site configuration → Change site name** to something clean
   (e.g. `sampat-hake`) so the temp URL is `sampat-hake.netlify.app`.
5. Go to **Domain management → Add a domain → `sampathake.in`**. Netlify will show you the
   exact DNS records to add. Keep that tab open — you'll use it in step 3.

To update the site later: drag the folder again (Deploys → drag onto the deploy zone), or
connect it to a GitHub repo for auto-deploys.

## 2B) Deploy via Cloudflare Pages (fastest globally)

1. Go to <https://dash.cloudflare.com> → sign up (free).
2. **Workers & Pages → Create → Pages → Upload assets**.
3. Name it `sampathake`, then **upload the contents of `~/Desktop/portfolio`**
   (select the files/folders inside it — `index.html`, `assets/`, `robots.txt`, `sitemap.xml`).
4. Deploy. You get `sampathake.pages.dev` — your site is live.
5. **Custom domains → Set up a domain → `sampathake.in`**. Cloudflare works best if you also
   move your DNS to Cloudflare (it will walk you through changing nameservers at GoDaddy).
   Follow its on-screen instructions — it's the most automated path.

---

## 3) Point your GoDaddy domain at the host (the important part)

> ⚠️ Right now `sampathake.in` shows a GoDaddy "Website Builder" parked page
> ("Welcome dear Co-coders"). Pointing DNS away from it will replace that with your new site.
> If GoDaddy has a **Website/Airo** product attached, you don't need to delete it — changing
> the DNS records below overrides what visitors see. Also turn OFF any **Domain Forwarding**
> (GoDaddy → Domain → Forwarding) if it's enabled, or it can override your records.

### If you stay on GoDaddy DNS (works for Netlify; simplest)

1. GoDaddy → **My Products → `sampathake.in` → DNS** (or the "Manage DNS" quick link).
2. Edit the **A record** with Name `@`:
   - **Type:** A · **Name:** `@` · **Value:** the IP your host shows.
     - Netlify's apex IP is **`75.2.60.5`** (confirm in Netlify's domain panel — it may also offer `99.83.190.102`; use what it shows).
   - Save.
3. Edit/add the **CNAME** with Name `www`:
   - **Type:** CNAME · **Name:** `www` · **Value:** your host's hostname.
     - Netlify: `your-site-name.netlify.app` (the name from step 2A.4).
   - Save.
4. Delete any extra/conflicting `@` A records or a `www` A record left over from GoDaddy parking.
5. Back in the host's domain panel, click **Verify / Check DNS**. It will provision HTTPS
   automatically once DNS resolves (minutes to a couple of hours).

### If you move nameservers to Cloudflare (best performance)

Cloudflare gives you two nameservers (e.g. `xxx.ns.cloudflare.com`). In GoDaddy:
**Domain → Nameservers → Change → I'll use my own nameservers →** paste the two Cloudflare
nameservers → Save. Cloudflare then manages everything (DNS + SSL + custom domain) automatically.

> **DNS propagation** takes anywhere from a few minutes to a few hours (occasionally up to 24h).
> Check status at <https://dnschecker.org> by entering `sampathake.in`.

---

## 4) Post-launch checklist

- [ ] Visit `https://sampathake.in` **and** `https://www.sampathake.in` — both should load with a 🔒 padlock.
- [ ] In the host's domain settings, set the **primary domain** (apex `sampathake.in`) so `www` redirects to it (or vice-versa — just pick one).
- [ ] **Wire the contact form** (see step 5) — until then it falls back to opening the visitor's email app, which still works.
- [ ] **Test the social preview:** paste `https://sampathake.in` into
      <https://www.linkedin.com/post-inspector/> — you should see your dark OG card. (Also add the link to your LinkedIn profile's *Website* / *Links* field.)
- [ ] **Submit to Google** so the world can find you: <https://search.google.com/search-console>
      → add `sampathake.in` → verify (GoDaddy TXT or the host) → submit `https://sampathake.in/sitemap.xml`.

---

## 5) Wire the contact form (5 min, free)

The form currently has a placeholder. Until you set it, submitting opens the visitor's email
client pre-filled to you — so it already works. To collect submissions in your inbox without
that step:

1. Go to <https://formspree.io> → sign up free → **New form** → use `sampat.hake.2000@gmail.com`.
2. Copy the form endpoint — it looks like `https://formspree.io/f/abcdwxyz`.
3. Open `~/Desktop/portfolio/index.html`, find:
   ```
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   Replace `YOUR_FORM_ID` with your real id (e.g. `abcdwxyz`).
4. Re-deploy (drag the folder again / push). Done — submissions arrive in your email + Formspree dashboard.

---

## 6) Updating the site later

Edit the files in `~/Desktop/portfolio/` and re-deploy:
- **Netlify:** drag the folder onto the Deploys page, or connect a GitHub repo for auto-deploy on push.
- **Cloudflare/Vercel:** re-upload, or connect Git.

Files you'll most likely touch:
- `index.html` — all text/content (experience, case studies, services, contact).
- `assets/styles.css` — colors, spacing, fonts.
- `assets/main.js` — interactions (command palette items, canvas, counters).
- `assets/Sampat_Hake_Resume.pdf` — replace to update the downloadable résumé.
- `assets/og.html` → re-render `og.png` (the social card) if you change the headline.

---

## 7) Optional upgrades

- **Custom email** `you@sampathake.in`: GoDaddy sells this, or use Cloudflare Email Routing
  (free forwarding to your Gmail) / Zoho Mail (free tier). Then update the email in `index.html`.
- **Analytics:** add free Cloudflare Web Analytics or Plausible (one script tag in `<head>`).
- **Auto-deploy:** put this folder in a GitHub repo and connect it to your host so every
  edit you push goes live automatically.
