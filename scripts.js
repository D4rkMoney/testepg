// scripts.js - final for Daniele: rotator, reveal, carousel loop (2 visible), animations
document.addEventListener('DOMContentLoaded', () => {
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // rotator phrases
  const phrases = [
    'Detalhes que realçam, resultados que surpreendem.',
    'Técnica, sensibilidade e resultado.',
    'Agende, transforme, encante.'
  ];
  const rotEl = document.getElementById('rotating-line');
  let pIdx = 0;
  if (rotEl) {
    rotEl.textContent = phrases[0];
    setInterval(() => {
      rotEl.style.opacity = 0;
      rotEl.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        pIdx = (pIdx + 1) % phrases.length;
        rotEl.textContent = phrases[pIdx];
        rotEl.style.opacity = 1;
        rotEl.style.transform = 'translateY(0)';
      }, 360);
    }, 3200);
  }

  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------------- CAROUSEL (2 visible, loop via clones) ---------------- */
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (!track) return;

  // keep original nodes as templates
  const originalNodes = Array.from(track.children).map(n => n.cloneNode(true));
  const totalOriginal = originalNodes.length;
  let visibleCount = 2; // fixed 2 per view (as requested)
  let clonesPerSide = visibleCount;
  let currentIndex = clonesPerSide;
  let isAnimating = false;

  function rebuildTrack() {
    track.innerHTML = '';
    // left clones
    const leftClones = originalNodes.slice(-clonesPerSide).map(n => n.cloneNode(true));
    leftClones.forEach(n => track.appendChild(n));
    // originals
    originalNodes.forEach(n => track.appendChild(n.cloneNode(true)));
    // right clones
    const rightClones = originalNodes.slice(0,clonesPerSide).map(n => n.cloneNode(true));
    rightClones.forEach(n => track.appendChild(n));
  }

  function computeCardWidth() {
    const first = track.querySelector('.service-card');
    if (!first) return 360;
    const style = getComputedStyle(first);
    // gap handling: rely on CSS gap of container (28px) approximately
    const gap = 28;
    return first.offsetWidth + gap;
  }

  function setInitialPosition() {
    const cardW = computeCardWidth();
    currentIndex = clonesPerSide;
    track.style.transition = 'none';
    track.style.transform = `translateX(${-(cardW * currentIndex)}px)`;
    void track.offsetWidth;
    track.style.transition = '';
  }

  function moveTo(index) {
    if (isAnimating) return;
    isAnimating = true;
    const cardW = computeCardWidth();
    track.classList.add('is-animating');
    track.style.transition = 'transform 560ms cubic-bezier(.2,.9,.2,1)';
    track.style.transform = `translateX(${-(cardW * index)}px)`;
    currentIndex = index;
  }

  function next() { moveTo(currentIndex + 1); }
  function prev() { moveTo(currentIndex - 1); }

  // handle snapping when hitting clones
  track.addEventListener('transitionend', () => {
    track.classList.remove('is-animating');
    const cardW = computeCardWidth();
    if (currentIndex < clonesPerSide) {
      currentIndex += totalOriginal;
      track.style.transition = 'none';
      track.style.transform = `translateX(${-(cardW * currentIndex)}px)`;
      void track.offsetWidth;
    } else if (currentIndex >= clonesPerSide + totalOriginal) {
      currentIndex -= totalOriginal;
      track.style.transition = 'none';
      track.style.transform = `translateX(${-(cardW * currentIndex)}px)`;
      void track.offsetWidth;
    }
    setTimeout(()=> { track.style.transition = ''; isAnimating = false; }, 20);
  });

  // init carousel
  function initCarousel() {
    rebuildTrack();
    setTimeout(() => setInitialPosition(), 80);
  }

  // attach events
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // keyboard nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // rebuild on resize (keeps 2 visible; cards will shrink on small screens)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { initCarousel(); }, 140);
  });

  initCarousel();

  // smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // keyboard focus styling helper
  document.addEventListener('keyup', (e) => { if (e.key === 'Tab') document.body.classList.add('user-is-tabbing'); });

});

// FAQ toggle
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    item.classList.toggle('active');
  });
});
