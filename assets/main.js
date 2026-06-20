/* ============================================================
   Sampat Hake — portfolio interactions (vanilla, no deps)
   ============================================================ */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- nav scrolled state + progress bar ---------- */
  const progress = $('#progress'), toTop = $('#toTop');
  const onScroll = () => {
    const y = scrollY;
    toTop.classList.toggle('show', y > 600);
    const h = document.documentElement;
    const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    progress.style.width = (p * 100) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- spotlight cursor (desktop only) ---------- */
  if (!matchMedia('(hover: none)').matches) {
    const sp = $('.spotlight');
    addEventListener('pointermove', e => {
      sp.style.setProperty('--mx', e.clientX + 'px');
      sp.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
  // Safety net so anchor jumps / ⌘K navigation never land on hidden content
  const revealInView = () => {
    $$('.reveal:not(.in)').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.95 && r.bottom > 0) el.classList.add('in');
    });
  };
  addEventListener('hashchange', () => setTimeout(revealInView, 680));
  addEventListener('load', () => setTimeout(revealInView, 120));

  /* ---------- animated counters ---------- */
  const fmt = (n) => {
    if (Number.isInteger(n)) return n.toLocaleString('en-US');
    return n.toFixed(1);
  };
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, to = parseFloat(el.dataset.to), suf = el.dataset.suffix || '';
      countIO.unobserve(el);
      if (reduceMotion) { el.textContent = fmt(to) + suf; return; }
      const dur = 1500, t0 = performance.now();
      const tick = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);           // easeOutCubic
        el.textContent = fmt(to <= 10 ? +(to * e).toFixed(1) : Math.round(to * e)) + suf;
        if (k < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(to) + suf;
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('.num').forEach(el => countIO.observe(el));

  /* ---------- command palette ---------- */
  const cmdk = $('#cmdk'), input = $('#cmdkInput'), list = $('#cmdkList');
  const go = (sel) => { closeCmd(); const t = $(sel); if (t) { t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); setTimeout(revealInView, 700); } };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText('sampat.hake.2000@gmail.com'); toast('Email copied ✓'); }
    catch { location.href = 'mailto:sampat.hake.2000@gmail.com'; }
    closeCmd();
  };
  const items = [
    { ico: '◆', label: 'Work with me', hint: 'consulting', act: () => go('#services') },
    { ico: '✉', label: 'Copy email', hint: 'clipboard', act: copyEmail },
    { ico: '↗', label: 'View résumé', hint: 'Google Drive', act: () => { window.open('https://drive.google.com/file/d/13DgNvIruzxHMuO-MJf6MaZb0TiLwDXH8/view', '_blank'); closeCmd(); } },
    { ico: '▸', label: 'Selected work', hint: 'case studies', act: () => go('#work') },
    { ico: '▸', label: 'Experience', hint: 'career', act: () => go('#experience') },
    { ico: '▸', label: 'Tech stack', hint: 'toolkit', act: () => go('#stack') },
    { ico: '▸', label: 'Contact', hint: 'get in touch', act: () => go('#contact') },
    { ico: 'in', label: 'LinkedIn', hint: 'open ↗', act: () => { open('https://www.linkedin.com/in/sampatraohake121', '_blank'); closeCmd(); } },
    { ico: 'GH', label: 'GitHub', hint: 'open ↗', act: () => { open('https://github.com/SamieZian', '_blank'); closeCmd(); } },
  ];
  let active = 0, filtered = items;
  const render = () => {
    list.innerHTML = '';
    filtered.forEach((it, i) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item' + (i === active ? ' active' : '');
      li.innerHTML = `<span class="ico">${it.ico}</span><span>${it.label}</span><span class="k">${it.hint}</span>`;
      li.addEventListener('click', it.act);
      li.addEventListener('pointermove', () => { active = i; paint(); });
      list.appendChild(li);
    });
  };
  const paint = () => $$('.cmdk-item', list).forEach((li, i) => li.classList.toggle('active', i === active));
  const openCmd = () => { cmdk.classList.add('open'); cmdk.setAttribute('aria-hidden', 'false'); input.value = ''; filtered = items; active = 0; render(); setTimeout(() => input.focus(), 30); };
  const closeCmd = () => { cmdk.classList.remove('open'); cmdk.setAttribute('aria-hidden', 'true'); };
  const cmdkBtn = $('#cmdkBtn');
  if (cmdkBtn) cmdkBtn.addEventListener('click', openCmd);
  cmdk.addEventListener('click', e => { if (e.target === cmdk) closeCmd(); });
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    filtered = items.filter(it => (it.label + ' ' + it.hint).toLowerCase().includes(q));
    active = 0; render();
  });
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdk.classList.contains('open') ? closeCmd() : openCmd(); return; }
    if (!cmdk.classList.contains('open')) return;
    if (e.key === 'Escape') closeCmd();
    else if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % filtered.length; paint(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + filtered.length) % filtered.length; paint(); }
    else if (e.key === 'Enter') { e.preventDefault(); filtered[active]?.act(); }
  });

  /* ---------- tiny toast ---------- */
  let toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:34px;transform:translateX(-50%) translateY(20px);background:#0e1626;border:1px solid rgba(103,232,249,.4);color:#e8edf7;padding:11px 20px;border-radius:11px;font-size:14px;z-index:200;opacity:0;transition:.25s;box-shadow:0 12px 40px -12px rgba(0,0,0,.7)';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    requestAnimationFrame(() => { toastEl.style.opacity = '1'; toastEl.style.transform = 'translateX(-50%) translateY(0)'; });
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => { toastEl.style.opacity = '0'; toastEl.style.transform = 'translateX(-50%) translateY(20px)'; }, 1800);
  }

  /* ---------- contact form: AJAX submit to Formspree, inline status ---------- */
  const form = $('#contactForm'), formNote = $('#formNote');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    formNote.classList.remove('ok', 'err');
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.reset();
        formNote.textContent = "✓ Thanks, your message is in. I'll get back to you soon.";
        formNote.classList.add('ok');
        btn.innerHTML = 'Sent ✓';
      } else {
        const data = await res.json().catch(() => ({}));
        formNote.textContent = (data.errors && data.errors[0] && data.errors[0].message)
          || 'Something went wrong. Email me directly: sampat.hake.2000@gmail.com';
        formNote.classList.add('err');
        btn.disabled = false; btn.innerHTML = orig;
      }
    } catch {
      formNote.textContent = 'Network error. Email me directly: sampat.hake.2000@gmail.com';
      formNote.classList.add('err');
      btn.disabled = false; btn.innerHTML = orig;
    }
  });

  /* ---------- rotating company terminal ---------- */
  const termPath = $('#termPath'), termCode = $('#termCode'), termWrap = $('.hero-terminal');
  const scenes = [
    { path: '~/clientell/agent-platform', code:
`<span class="c-com"># query 9 connectors, merged in parallel</span>
<span class="c-kw">async def</span> <span class="c-fn">resolve</span>(intent: Intent):
    route = <span class="c-fn">classifier</span>.route(intent)  <span class="c-com"># −95% ctx</span>
    parts = <span class="c-kw">await</span> <span class="c-fn">gather</span>(route.<span class="c-fn">fan_out</span>(intent))
    <span class="c-kw">return</span> <span class="c-fn">merge</span>(parts)               <span class="c-com"># p95 250ms</span>

<span class="c-str">→ agent ready · 2,000+ runs/day</span><span class="cursor">▋</span>` },
    { path: '~/wizcommerce/erp-sync', code:
`<span class="c-com"># event-driven ERP sync · 99.9% uptime</span>
<span class="c-fn">@subscriber</span>(<span class="c-str">"pubsub/orders"</span>)
<span class="c-kw">async def</span> <span class="c-fn">on_change</span>(evt: CDCEvent):
    rec = <span class="c-fn">normalize</span>(evt.payload)
    <span class="c-kw">await</span> netsuite.<span class="c-fn">upsert</span>(rec)       <span class="c-com"># 100% acc</span>
    <span class="c-kw">await</span> cache.<span class="c-fn">invalidate</span>(rec.id)  <span class="c-com"># 10s→2s</span>

<span class="c-str">→ synced · 5K+ files/month</span><span class="cursor">▋</span>` },
    { path: '~/cogno/campaign-pipeline', code:
`<span class="c-com"># serverless fan-out · 1M+ users</span>
<span class="c-kw">def</span> <span class="c-fn">handler</span>(event, _ctx):
    batches = <span class="c-fn">chunk</span>(<span class="c-fn">load_users</span>(), 5_000)
    <span class="c-kw">for</span> b <span class="c-kw">in</span> batches:
        sqs.<span class="c-fn">send_batch</span>(queue, b)     <span class="c-com"># Lambda</span>
    <span class="c-kw">return</span> {<span class="c-str">"runtime"</span>: <span class="c-str">"30m"</span>}        <span class="c-com"># was 5h</span>

<span class="c-str">→ dispatched · 1M+ users (−90%)</span><span class="cursor">▋</span>` },
    { path: '~/guavus/data-pipeline', code:
`<span class="c-com">-- stream analytics · +40% throughput</span>
<span class="c-kw">SELECT</span> node_id, <span class="c-fn">p95</span>(latency_ms)
  <span class="c-kw">FROM</span> nwdaf_stream            <span class="c-com">-- SQLstream</span>
 <span class="c-kw">GROUP BY</span> node_id
 <span class="c-kw">WINDOW</span> <span class="c-fn">HOPPING</span>(60s);
<span class="c-com">-- 98% coverage on critical paths</span>
<span class="c-str">→ pipeline live · real-time KPIs</span><span class="cursor">▋</span>` },
  ];
  if (termPath && termCode && scenes.length > 1) {
    let si = 0, paused = false;
    const swap = () => {
      if (paused) return;
      termWrap.classList.add('term-swap');
      setTimeout(() => {
        si = (si + 1) % scenes.length;
        termPath.textContent = scenes[si].path;
        termCode.innerHTML = scenes[si].code;
        termWrap.classList.remove('term-swap');
      }, reduceMotion ? 0 : 280);
    };
    if (termWrap) {
      termWrap.addEventListener('mouseenter', () => paused = true);
      termWrap.addEventListener('mouseleave', () => paused = false);
    }
    setInterval(swap, 4200);
  }

  /* ============================================================
     Agent-network canvas — nodes + links, gentle drift,
     reacts subtly to pointer. Capped + paused off-screen.
     ============================================================ */
  const canvas = $('#net'); const ctx = canvas.getContext('2d');
  let W, H, DPR, nodes = [], raf, mouse = { x: -999, y: -999 }, running = true;
  const COUNT = () => Math.min(64, Math.floor(innerWidth / 26));
  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function init() {
    resize();
    const n = COUNT();
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.6 + 0.8
    }));
  }
  function step() {
    ctx.clearRect(0, 0, W, H);
    const LINK = 132;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;
      // pointer attraction (subtle)
      const dxm = mouse.x - a.x, dym = mouse.y - a.y, dm = Math.hypot(dxm, dym);
      if (dm < 160) { a.x += dxm / dm * .4; a.y += dym / dm * .4; }
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < LINK) {
          const o = (1 - d / LINK) * .5;
          ctx.strokeStyle = `rgba(103,232,249,${o * .5})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.283);
      ctx.fillStyle = 'rgba(150,200,255,.65)'; ctx.fill();
    }
    if (running) raf = requestAnimationFrame(step);
  }
  if (!reduceMotion) {
    init();
    raf = requestAnimationFrame(step);
    addEventListener('resize', () => { cancelAnimationFrame(raf); init(); if (running) raf = requestAnimationFrame(step); });
    addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(step); else cancelAnimationFrame(raf);
    });
  } else {
    canvas.style.display = 'none';
  }
})();
