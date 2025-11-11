// =============================
// scripts.js - Daniele (FINAL & STABLE)
// =============================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- ROTATOR ---------- */
  const rotEl = document.getElementById('rotating-line');
  const phrases = [
    'Detalhes que realçam, resultados que surpreendem.',
    'Técnica, sensibilidade e harmonia.',
    'Transforme seu reflexo — agende agora.'
  ];
  if (rotEl) {
    let k = 0;
    rotEl.textContent = phrases[k];
    setInterval(() => {
      rotEl.style.opacity = 0;
      rotEl.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        k = (k + 1) % phrases.length;
        rotEl.textContent = phrases[k];
        rotEl.style.opacity = 1;
        rotEl.style.transform = 'translateY(0)';
      }, 360);
    }, 3600);
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(r => io.observe(r));

  /* ---------- MOBILE MENU (button injected if missing) ---------- */
  const header = document.querySelector('.site-header .header-inner') || document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  if (header && nav) {
    // create button only if not present
    if (!document.querySelector('.menu-toggle')) {
      const btn = document.createElement('button');
      btn.className = 'menu-toggle';
      btn.setAttribute('aria-label', 'Abrir menu');
      btn.innerHTML = '☰';
      header.appendChild(btn);
      btn.addEventListener('click', () => {
        nav.classList.toggle('open');
        btn.classList.toggle('active');
      });
    } else {
      document.querySelector('.menu-toggle').addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }
  }

  /* ---------- CAROUSEL (pixel-accurate, 2 visible) ---------- */
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  if (track && prevBtn && nextBtn) {
    let cards = Array.from(track.querySelectorAll('.service-card'));
    let index = 0;
    const visibleDefault = 2;
    let visible = visibleDefault;
    let gap = parseFloat(getComputedStyle(track).gap) || 24;

    function recalc() {
      // recompute sizes after resize / images load
      gap = parseFloat(getComputedStyle(track).gap) || 24;
      cards = Array.from(track.querySelectorAll('.service-card'));
      if (window.innerWidth <= 520) {
        visible = 1;
      } else {
        visible = visibleDefault;
      }
      // clamp index
      index = Math.max(0, Math.min(index, Math.max(0, cards.length - visible)));
      update();
    }

    function update() {
      if (!cards.length) return;
      // use pixel-based transform to avoid rounding jumps
      const cardRect = cards[0].getBoundingClientRect();
      const cardWidth = cardRect.width;
      const movePx = index * (cardWidth + gap);
      track.style.transform = `translateX(-${movePx}px)`;
    }

    nextBtn.addEventListener('click', () => {
      if (index < cards.length - visible) index++;
      else index = 0;
      update();
    });

    prevBtn.addEventListener('click', () => {
      if (index > 0) index--;
      else index = Math.max(0, cards.length - visible);
      update();
    });

    // Recalculate when images load (so sizes are correct)
    window.addEventListener('resize', recalc);
    // images inside cards might change size - listen to load
    const imgs = track.querySelectorAll('img');
    let loaded = 0;
    imgs.forEach(img => {
      if (img.complete) loaded++;
      else img.addEventListener('load', () => { loaded++; if (loaded === imgs.length) recalc(); });
    });
    // initial
    setTimeout(recalc, 80);
  }

  /* ---------- SMOOTH NAV LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 70;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          // close mobile nav if open
          const navEl = document.querySelector('.nav.open');
          if (navEl) navEl.classList.remove('open');
        }
      }
    });
  });

  /* ---------- FAQ toggle ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (!item) return;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });
      if (!wasActive) {
        item.classList.add('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Buttons micro-animations ---------- */
  document.querySelectorAll('.btn, .btn-gold-large, .buy-btn, .carousel-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-4px) scale(1.02)');
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
    btn.addEventListener('mousedown', () => btn.style.transform = 'translateY(-2px) scale(.98)');
    btn.addEventListener('mouseup', () => btn.style.transform = 'translateY(-4px) scale(1.02)');
  });

});
