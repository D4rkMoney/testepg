// scripts.js — versão com animações aprimoradas + botões animados
document.addEventListener('DOMContentLoaded', () => {

  /* ====== Atualiza ano ====== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ====== Frases rotativas ====== */
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
      rotEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      rotEl.style.opacity = 0;
      rotEl.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        pIdx = (pIdx + 1) % phrases.length;
        rotEl.textContent = phrases[pIdx];
        rotEl.style.opacity = 1;
        rotEl.style.transform = 'translateY(0)';
      }, 400);
    }, 3200);
  }

  /* ====== Animação “reveal” ao rolar ====== */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(el);
  });

  /* ====== Carrossel de serviços (2 visíveis) ====== */
  const track = document.getElementById('carousel-track');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  if (track && nextBtn && prevBtn) {
    const cards = Array.from(track.children);
    let index = 0;
    const visible = 2; // mostra 2 por vez

    function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 20; // leve gap
      const move = -(index * cardWidth);
      track.style.transform = `translateX(${move}px)`;
      track.style.transition = 'transform 0.6s ease';
    }

    nextBtn.addEventListener('click', () => {
      if (index < cards.length - visible) {
        index++;
      } else {
        index = 0; // loop
      }
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
      } else {
        index = cards.length - visible;
      }
      updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  /* ====== Scroll suave ====== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ====== FAQ toggle ====== */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const content = item.querySelector('.faq-answer');
      const isActive = item.classList.toggle('active');

      if (isActive) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  /* ====== Animações globais ====== */
  const fadeEls = document.querySelectorAll('h1, h2, p, button, .service-card');
  fadeEls.forEach(el => {
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
  });
  setTimeout(() => {
    fadeEls.forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    });
  }, 300);

  /* ====== Botões animados ====== */
  const buttons = document.querySelectorAll('button, .btn, a.button');
  buttons.forEach(btn => {
    btn.style.transition = 'all 0.25s ease';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    // Efeito “glow” suave no hover
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.04)';
      btn.style.boxShadow = '0 0 15px rgba(155, 80, 255, 0.5)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
    });

    // Pequeno “pulse” no clique
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'scale(1.03)';
      setTimeout(() => (btn.style.transform = 'scale(1)'), 150);
    });
  });

});
