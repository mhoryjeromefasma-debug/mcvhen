(() => {
  const body = document.body;
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    if (!btn || !nav) return;
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  if (btn) {
    btn.addEventListener('click', (e) => { e.stopPropagation(); setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  }

  // Fade out before moving to another page
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname === location.pathname) return;
    if (!/\.html?$|\/$/.test(url.pathname)) return;
    e.preventDefault();
    setMenu(false);
    body.classList.add('leaving');
    setTimeout(() => { location.href = url.href; }, 300);
  });
  window.addEventListener('pageshow', () => body.classList.remove('leaving'));
  window.addEventListener('pagehide', () => {});

  const copy = document.querySelector('[data-copy]');
  const status = document.querySelector('[data-status]');
  if (copy && status) {
    copy.addEventListener('click', async () => {
      const email = copy.dataset.copy;
      try { await navigator.clipboard.writeText(email); status.textContent = 'Email copied'; }
      catch { status.textContent = email; }
    });
  }
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Background follows the pointer slightly (throttled, GPU transform only)
  const bg = document.querySelector('.bg3d');
  if (bg && !reduce && window.matchMedia('(pointer: fine)').matches) {
    let raf = 0, px = 0, py = 0;
    window.addEventListener('pointermove', (e) => {
      px = (e.clientX / innerWidth - 0.5) * -16;
      py = (e.clientY / innerHeight - 0.5) * -16;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        bg.style.setProperty('--px', px.toFixed(1) + 'px');
        bg.style.setProperty('--py', py.toFixed(1) + 'px');
      });
    }, { passive: true });
  }

  // Rotating words in the hero headline
  const rot = document.querySelector('.rot');
  if (rot && !reduce) {
    const words = JSON.parse(rot.dataset.words || '[]');
    let i = 0;
    setInterval(() => {
      rot.classList.add('out');
      setTimeout(() => {
        i = (i + 1) % words.length;
        rot.textContent = words[i];
        rot.classList.add('pre');
        void rot.offsetWidth;
        rot.classList.remove('pre', 'out');
      }, 400);
    }, 2600);
  }

  // Click feedback: press pulse and ripple on cards and buttons
  if (!reduce) {
    document.addEventListener('pointerdown', (e) => {
      const el = e.target.closest('.card, .btn');
      if (!el) return;
      el.classList.add('pop');
      setTimeout(() => el.classList.remove('pop'), 460);
      const r = el.getBoundingClientRect();
      const d = Math.max(r.width, r.height) * 2;
      const s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left - d / 2) + 'px';
      s.style.top = (e.clientY - r.top - d / 2) + 'px';
      el.appendChild(s);
      setTimeout(() => s.remove(), 650);
    });
  }
})();

(() => {
  // Project slideshow on the home page
  const slides = document.querySelectorAll('.slides .slide');
  const dots = document.querySelectorAll('.dots i');
  if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('is-on');
      dots[idx] && dots[idx].classList.remove('on');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-on');
      dots[idx] && dots[idx].classList.add('on');
    }, 4000);
  }
})();
